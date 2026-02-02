/**
 * Twilio SMS Integration
 * Handles sending SMS messages for campaigns
 */

import twilio from 'twilio'

export interface TwilioConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
}

export interface SMSResult {
  sid: string
  status: string
  error?: string
}

export class TwilioError extends Error {
  constructor(
    message: string,
    public code?: number,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'TwilioError'
  }
}

let twilioClientInstance: twilio.Twilio | null = null

/**
 * Initialize Twilio client (singleton pattern)
 */
export function initializeTwilioClient(config: TwilioConfig): twilio.Twilio {
  if (!twilioClientInstance) {
    twilioClientInstance = twilio(config.accountSid, config.authToken)
  }
  return twilioClientInstance
}

/**
 * Format phone number to E.164 format
 * Handles French numbers and common formats
 */
export function formatPhoneNumber(phone: string): string {
  let normalized = phone.trim().replace(/\s+/g, '')

  // Remove common formatting
  normalized = normalized.replace(/[().-]/g, '')

  // If starts with 0, replace with +33 (France)
  if (normalized.startsWith('0') && normalized.length === 10) {
    normalized = '+33' + normalized.substring(1)
  }

  // If doesn't start with +, try to add country code
  if (!normalized.startsWith('+')) {
    // If looks like French number (10 digits), add +33
    if (/^\d{10}$/.test(normalized)) {
      normalized = '+33' + normalized.substring(1)
    } else if (/^\d{9}$/.test(normalized)) {
      // 9 digits, likely French mobile without leading 0
      normalized = '+33' + normalized
    } else if (/^\d+$/.test(normalized)) {
      // Just digits, assume it needs +
      normalized = '+' + normalized
    }
  }

  // Validate E.164 format
  if (!/^\+[1-9]\d{1,14}$/.test(normalized)) {
    throw new TwilioError(
      `Invalid phone number format: ${phone}. Expected E.164 format (e.g., +33612345678)`,
      21211
    )
  }

  return normalized
}

/**
 * Send SMS message via Twilio
 */
export async function sendSMS(
  to: string,
  message: string,
  config: TwilioConfig
): Promise<SMSResult> {
  try {
    const client = initializeTwilioClient(config)
    const normalizedPhone = formatPhoneNumber(to)

    // Validate message length (SMS has 160 character limit for single message)
    // Twilio will automatically split longer messages, but we should warn
    if (message.length > 1600) {
      console.warn(
        `SMS message is very long (${message.length} chars). Twilio will split into multiple messages.`
      )
    }

    const result = await client.messages.create({
      body: message,
      from: config.phoneNumber,
      to: normalizedPhone,
    })

    return {
      sid: result.sid,
      status: result.status || 'queued',
    }
  } catch (error: any) {
    // Handle Twilio-specific errors
    if (error.code === 21211) {
      throw new TwilioError(
        `Invalid phone number: ${to}`,
        error.code,
        error.status
      )
    }
    if (error.code === 21608) {
      throw new TwilioError(
        'Unsubscribed recipient. Member has replied STOP.',
        error.code,
        error.status
      )
    }
    if (error.code === 21614) {
      throw new TwilioError(
        'Invalid sender phone number',
        error.code,
        error.status
      )
    }

    // Generic error
    throw new TwilioError(
      error.message || 'Failed to send SMS',
      error.code,
      error.status
    )
  }
}

/**
 * Handle STOP replies (GDPR compliance)
 * Webhook endpoint for Twilio to call when user replies STOP
 */
export async function handleStopReply(phoneNumber: string, context: any) {
  // TODO: Update member consent_sms to false
  // await context.entities.Member.updateMany({
  //   where: { phone: phoneNumber },
  //   data: { consentSms: false },
  // });
  throw new Error('Twilio STOP reply handling not yet implemented');
}

