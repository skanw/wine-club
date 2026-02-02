import type { TwilioConfig } from './twilio/client'
import type { BrevoConfig } from './brevo/client'

/**
 * Get Twilio configuration
 * For now, uses environment variables. In future, can extend to per-cave configuration.
 */
export function getTwilioConfig(caveId?: string): TwilioConfig {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !phoneNumber) {
    throw new Error(
      'Twilio configuration missing. Required env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER'
    )
  }

  return {
    accountSid,
    authToken,
    phoneNumber,
  }
}

/**
 * Get Brevo configuration
 * For now, uses environment variables. In future, can extend to per-cave configuration.
 */
export function getBrevoConfig(caveId?: string): BrevoConfig {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'VinClub'

  if (!apiKey || !senderEmail) {
    throw new Error(
      'Brevo configuration missing. Required env vars: BREVO_API_KEY, BREVO_SENDER_EMAIL'
    )
  }

  return {
    apiKey,
    senderEmail,
    senderName,
  }
}

/**
 * Validate that all required integration environment variables are set
 * Called on server startup to fail fast if configuration is missing
 */
export function validateIntegrationConfig(): {
  twilioConfigured: boolean
  brevoConfigured: boolean
  errors: string[]
} {
  const errors: string[] = []
  let twilioConfigured = true
  let brevoConfigured = true

  // Check Twilio
  if (!process.env.TWILIO_ACCOUNT_SID) {
    errors.push('TWILIO_ACCOUNT_SID is not set')
    twilioConfigured = false
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    errors.push('TWILIO_AUTH_TOKEN is not set')
    twilioConfigured = false
  }
  if (!process.env.TWILIO_PHONE_NUMBER) {
    errors.push('TWILIO_PHONE_NUMBER is not set')
    twilioConfigured = false
  }

  // Check Brevo
  if (!process.env.BREVO_API_KEY) {
    errors.push('BREVO_API_KEY is not set')
    brevoConfigured = false
  }
  if (!process.env.BREVO_SENDER_EMAIL) {
    errors.push('BREVO_SENDER_EMAIL is not set')
    brevoConfigured = false
  }

  return {
    twilioConfigured,
    brevoConfigured,
    errors,
  }
}
