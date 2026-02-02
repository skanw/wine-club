/**
 * Twilio webhook handler for STOP replies and status updates
 * GDPR compliance: Automatically unsubscribe members who reply STOP
 */

import { type TwilioWebhook } from 'wasp/server/api'
import { type MiddlewareConfigFn } from 'wasp/server'
import express from 'express'
import twilio from 'twilio'

/**
 * Middleware to handle Twilio webhook format
 * Twilio sends form-encoded data, not JSON
 */
export const twilioWebhookMiddleware: MiddlewareConfigFn = (middlewareConfig) => {
  // Remove default JSON parser and add URL-encoded parser for Twilio webhooks
  middlewareConfig.delete('express.json')
  middlewareConfig.set(
    'express.urlencoded',
    express.urlencoded({ extended: true, type: 'application/x-www-form-urlencoded' })
  )
  return middlewareConfig
}

/**
 * Verify Twilio webhook signature
 */
function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
  authToken: string
): boolean {
  try {
    return twilio.validateRequest(authToken, signature, url, params)
  } catch (error) {
    console.error('Error verifying Twilio signature:', error)
    return false
  }
}

/**
 * Handle Twilio webhook (STOP replies, status updates)
 */
export const handleTwilioWebhook: TwilioWebhook = async (req, res, context) => {
  try {
    const body = req.body as Record<string, string>
    const signature = req.headers['x-twilio-signature'] as string

    // Verify webhook signature if auth token is available
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (authToken && signature) {
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      const isValid = verifyTwilioSignature(url, body, signature, authToken)

      if (!isValid) {
        console.warn('Invalid Twilio webhook signature')
        res.status(403).send('Invalid signature')
        return
      }
    }

    const messageBody = (body.Body || '').trim().toUpperCase()
    const fromPhone = body.From
    const messageSid = body.MessageSid

    // Handle STOP replies (GDPR compliance)
    if (
      messageBody === 'STOP' ||
      messageBody === 'ARRET' ||
      messageBody === 'STOP.' ||
      messageBody === 'ARRET.'
    ) {
      if (fromPhone) {
        // Normalize phone number (remove + if present for matching)
        const normalizedPhone = fromPhone.replace(/^\+/, '')

        // Update member consent
        const updated = await context.entities.Member.updateMany({
          where: {
            phone: {
              contains: normalizedPhone,
            },
          },
          data: {
            consentSms: false,
          },
        })

        console.log(
          `STOP reply received from ${fromPhone}. Updated ${updated.count} member(s).`
        )

        // Log unsubscribe event (for audit trail)
        // TODO: Create UnsubscribeLog entity if needed for compliance
      }

      // Return TwiML response (empty response acknowledges receipt)
      res.type('text/xml')
      res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
      return
    }

    // Handle other message types (status updates, etc.)
    // Twilio sends status callbacks separately, but we can log them here
    if (body.MessageStatus) {
      console.log(
        `Twilio status update for ${messageSid}: ${body.MessageStatus}`
      )
      // TODO: Update CampaignMessage status if messageSid is tracked
    }

    // Default response
    res.type('text/xml')
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
  } catch (error: any) {
    console.error('Error handling Twilio webhook:', error)
    res.status(500).send('Internal server error')
  }
}
