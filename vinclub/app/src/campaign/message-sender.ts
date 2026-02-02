/**
 * Message sender service
 * Handles sending campaign messages via Twilio (SMS) or Brevo (Email)
 */

import { sendSMS, formatPhoneNumber, TwilioError } from '../integrations/twilio/client'
import { sendEmail, validateEmail, BrevoError } from '../integrations/brevo/client'
import { formatCampaignMessage } from '../integrations/twilio/templates'
import { formatCampaignEmail } from '../integrations/brevo/templates'
import { getTwilioConfig, getBrevoConfig } from '../integrations/config'
import {
  classifyError,
  RateLimitError,
  InvalidPhoneError,
  InvalidEmailError,
  BounceError,
  UnsubscribedError,
  UnknownError,
} from './message-errors'
import { waitForRateLimit } from '../integrations/twilio/rate-limiter'
import type { MessageChannel, MessageStatus } from '@prisma/client'

interface Campaign {
  id: string
  productName: string
  productPrice?: number
  message: string
  imageUrl?: string | null
}

interface Member {
  id: string
  name: string
  phone?: string | null
  email?: string | null
}

interface CampaignMessage {
  id: string
  campaignId: string
  memberId: string
  channel: MessageChannel
  status: MessageStatus
  externalId?: string | null // Brevo messageId for email; set after send
}

/**
 * Send a single campaign message
 */
export async function sendCampaignMessage(
  campaignMessage: CampaignMessage,
  campaign: Campaign,
  member: Member,
  context: any
): Promise<{ success: boolean; error?: string; externalId?: string }> {
  const { channel } = campaignMessage

  try {
    if (channel === 'sms') {
      return await sendSMSMessage(campaignMessage, campaign, member, context)
    } else if (channel === 'email') {
      return await sendEmailMessage(campaignMessage, campaign, member, context)
    } else {
      throw new UnknownError(`Unknown channel: ${channel}`)
    }
  } catch (error: any) {
    const errorClassification = classifyError(error)
    console.error(
      `Error sending ${channel} message ${campaignMessage.id}:`,
      error
    )

    // Update message status to failed
    await context.entities.CampaignMessage.update({
      where: { id: campaignMessage.id },
      data: {
        status: 'failed' as MessageStatus,
      },
    })

    return {
      success: false,
      error: error.message || 'Unknown error',
    }
  }
}

/**
 * Send SMS message via Twilio
 */
async function sendSMSMessage(
  campaignMessage: CampaignMessage,
  campaign: Campaign,
  member: Member,
  context: any
): Promise<{ success: boolean; error?: string; externalId?: string }> {
  if (!member.phone) {
    throw new InvalidPhoneError(`Member ${member.id} has no phone number`)
  }

  // Get Twilio config
  const twilioConfig = getTwilioConfig()

  // Wait for rate limit
  await waitForRateLimit()

  // Format message (member.phone is guaranteed to exist at this point)
  const smsText = formatCampaignMessage(campaign, {
    name: member.name || 'Cher membre',
    phone: member.phone!,
  })

  try {
    // Send SMS
    const result = await sendSMS(member.phone, smsText, twilioConfig)

    // Update message status
    await context.entities.CampaignMessage.update({
      where: { id: campaignMessage.id },
      data: {
        status: 'sent' as MessageStatus,
        sentAt: new Date(),
      },
    })

    return {
      success: true,
      externalId: result.sid,
    }
  } catch (error: any) {
    // Handle Twilio-specific errors
    if (error instanceof TwilioError) {
      if (error.code === 21211) {
        throw new InvalidPhoneError(`Invalid phone number: ${member.phone}`)
      }
      if (error.code === 21608) {
        throw new UnsubscribedError(`Member ${member.id} has unsubscribed`)
      }
      if (error.statusCode === 429) {
        throw new RateLimitError('Twilio rate limit exceeded')
      }
    }

    throw new UnknownError(
      `Failed to send SMS: ${error.message}`,
      error
    )
  }
}

/**
 * Send email message via Brevo
 */
async function sendEmailMessage(
  campaignMessage: CampaignMessage,
  campaign: Campaign,
  member: Member,
  context: any
): Promise<{ success: boolean; error?: string; externalId?: string }> {
  if (!member.email) {
    throw new InvalidEmailError(`Member ${member.id} has no email address`)
  }

  if (!validateEmail(member.email)) {
    throw new InvalidEmailError(`Invalid email address: ${member.email}`)
  }

  // Get Brevo config
  const brevoConfig = getBrevoConfig()

  // Format email (member.email is guaranteed to exist at this point)
  const { html, plainText } = formatCampaignEmail(campaign, {
    name: member.name || 'Cher membre',
    email: member.email!,
  })

  // Generate subject
  const subject = campaign.productName
    ? `🍷 Nouvelle Arrivée: ${campaign.productName}`
    : 'Nouvelle Arrivée - VinClub'

  try {
    // Send email
    const result = await sendEmail(
      member.email,
      subject,
      html,
      brevoConfig,
      plainText
    )

    // Update message status and store Brevo messageId for webhook lookups
    await context.entities.CampaignMessage.update({
      where: { id: campaignMessage.id },
      data: {
        status: 'sent' as MessageStatus,
        sentAt: new Date(),
        externalId: result.messageId,
      },
    })

    return {
      success: true,
      externalId: result.messageId,
    }
  } catch (error: any) {
    // Handle Brevo-specific errors
    if (error instanceof BrevoError) {
      if (error.code === 'INVALID_REQUEST') {
        throw new InvalidEmailError(`Invalid email: ${member.email}`)
      }
      if (error.statusCode === 402) {
        throw new UnknownError('Brevo credits insufficient')
      }
      if (error.statusCode === 429) {
        throw new RateLimitError('Brevo rate limit exceeded')
      }
    }

    throw new UnknownError(
      `Failed to send email: ${error.message}`,
      error
    )
  }
}

/**
 * Send campaign messages in batches
 * Processes messages synchronously (will be replaced by background job)
 */
export async function sendCampaignMessagesBatch(
  campaignMessages: CampaignMessage[],
  campaign: Campaign,
  members: Map<string, Member>,
  context: any,
  batchSize: number = 50
): Promise<{
  sent: number
  failed: number
  errors: Array<{ messageId: string; error: string }>
}> {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as Array<{ messageId: string; error: string }>,
  }

  // Process in batches
  for (let i = 0; i < campaignMessages.length; i += batchSize) {
    const batch = campaignMessages.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (message) => {
        const member = members.get(message.memberId)
        if (!member) {
          results.failed++
          results.errors.push({
            messageId: message.id,
            error: 'Member not found',
          })
          return
        }

        const result = await sendCampaignMessage(
          message,
          campaign,
          member,
          context
        )

        if (result.success) {
          results.sent++
        } else {
          results.failed++
          results.errors.push({
            messageId: message.id,
            error: result.error || 'Unknown error',
          })
        }
      })
    )
  }

  return results
}
