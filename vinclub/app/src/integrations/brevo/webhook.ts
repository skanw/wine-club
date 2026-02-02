/**
 * Brevo webhook handler for email events (bounces, unsubscribes, etc.)
 * GDPR compliance: Automatically unsubscribe members on bounce/unsubscribe
 */

import { type BrevoWebhook } from 'wasp/server/api'
import { type MiddlewareConfigFn } from 'wasp/server'
import express from 'express'

/**
 * Middleware to handle Brevo webhook format
 * Brevo sends JSON data
 */
export const brevoWebhookMiddleware: MiddlewareConfigFn = (middlewareConfig) => {
  // Keep JSON parser for Brevo webhooks
  return middlewareConfig
}

interface BrevoWebhookEvent {
  event: string
  email?: string
  date: string
  'message-id'?: string
  ts_epoch?: number
  reason?: string
  tag?: string
}

function parseEventTime(event: BrevoWebhookEvent): Date {
  if (typeof event.ts_epoch === 'number') {
    return new Date(event.ts_epoch)
  }
  if (event.date) {
    const parsed = new Date(event.date)
    if (!isNaN(parsed.getTime())) return parsed
  }
  return new Date()
}

/**
 * Handle Brevo webhook (bounces, unsubscribes, opened, click, delivered, etc.)
 */
export const handleBrevoWebhook: BrevoWebhook = async (req, res, context) => {
  try {
    const events = req.body as BrevoWebhookEvent | BrevoWebhookEvent[]

    // Brevo can send single event or array of events
    const eventArray = Array.isArray(events) ? events : [events]

    for (const event of eventArray) {
      const eventType = event.event
      const email = event.email
      const eventDate = event.date
      const messageId = event['message-id']

      // Events that should unsubscribe the member (require email)
      const unsubscribeEvents = [
        'bounce',
        'hardbounce',
        'softbounce',
        'unsubscribe',
        'blocked',
        'invalid',
      ]

      if (unsubscribeEvents.includes(eventType)) {
        if (!email) {
          console.warn('Brevo webhook unsubscribe event missing email:', event)
          continue
        }
        // Update member consent
        const updated = await context.entities.Member.updateMany({
          where: {
            email: email.toLowerCase().trim(),
          },
          data: {
            consentEmail: false,
          },
        })

        console.log(
          `Brevo ${eventType} event for ${email}. Updated ${updated.count} member(s).`
        )
        continue
      }

      // Open / click / delivered: link by Brevo message-id to CampaignMessage
      if (
        (eventType === 'opened' ||
          eventType === 'unique_opened' ||
          eventType === 'click' ||
          eventType === 'delivered') &&
        messageId
      ) {
        const msg = await context.entities.CampaignMessage.findFirst({
          where: {
            externalId: messageId,
            channel: 'email',
          },
          select: {
            id: true,
            campaignId: true,
            openedAt: true,
            clickedAt: true,
            deliveredAt: true,
          },
        })

        if (!msg) {
          console.warn(
            `Brevo webhook: no CampaignMessage found for message-id ${messageId}`
          )
          continue
        }

        const eventTime = parseEventTime(event)

        if (
          (eventType === 'opened' || eventType === 'unique_opened') &&
          msg.openedAt == null
        ) {
          await context.entities.CampaignMessage.update({
            where: { id: msg.id },
            data: { openedAt: eventTime },
          })
          await context.entities.Campaign.update({
            where: { id: msg.campaignId },
            data: { openedCount: { increment: 1 } },
          })
        }

        if (eventType === 'click' && msg.clickedAt == null) {
          await context.entities.CampaignMessage.update({
            where: { id: msg.id },
            data: { clickedAt: eventTime },
          })
          await context.entities.Campaign.update({
            where: { id: msg.campaignId },
            data: { clickedCount: { increment: 1 } },
          })
        }

        if (
          eventType === 'delivered' &&
          msg.deliveredAt == null
        ) {
          await context.entities.CampaignMessage.update({
            where: { id: msg.id },
            data: { deliveredAt: eventTime },
          })
        }
      }
    }

    // Return 200 OK
    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Error handling Brevo webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
