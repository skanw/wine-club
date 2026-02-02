/**
 * Brevo (formerly Sendinblue) Email Integration
 * Handles sending email messages for campaigns
 */

import * as brevo from '@getbrevo/brevo'

export interface BrevoConfig {
  apiKey: string
  senderEmail: string
  senderName: string
}

export interface EmailResult {
  messageId: string
  error?: string
}

export class BrevoError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'BrevoError'
  }
}

let brevoClientInstance: brevo.TransactionalEmailsApi | null = null

/**
 * Initialize Brevo client (singleton pattern)
 */
export function initializeBrevoClient(
  config: BrevoConfig
): brevo.TransactionalEmailsApi {
  if (!brevoClientInstance) {
    brevoClientInstance = new brevo.TransactionalEmailsApi()
    brevoClientInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      config.apiKey
    )
  }
  return brevoClientInstance
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Send email via Brevo
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  config: BrevoConfig,
  plainTextContent?: string
): Promise<EmailResult> {
  try {
    // Validate email format
    if (!validateEmail(to)) {
      throw new BrevoError(`Invalid email address: ${to}`)
    }

    const apiInstance = initializeBrevoClient(config)

    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent
    sendSmtpEmail.sender = {
      name: config.senderName,
      email: config.senderEmail,
    }
    sendSmtpEmail.to = [{ email: to }]

    // Add plain text fallback if provided
    if (plainTextContent) {
      sendSmtpEmail.textContent = plainTextContent
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    // Brevo returns messageId in the body
    const messageId = (result as any).messageId || (result as any).body?.messageId || 'unknown'

    return {
      messageId: messageId,
    }
  } catch (error: any) {
    // Handle Brevo-specific errors
    if (error.response) {
      const statusCode = error.response.status || error.statusCode
      const errorBody = error.response.body || error.body

      if (statusCode === 400) {
        throw new BrevoError(
          errorBody?.message || 'Invalid email request',
          'INVALID_REQUEST',
          statusCode
        )
      }
      if (statusCode === 401) {
        throw new BrevoError(
          'Invalid Brevo API key',
          'UNAUTHORIZED',
          statusCode
        )
      }
      if (statusCode === 402) {
        throw new BrevoError(
          'Insufficient Brevo credits',
          'INSUFFICIENT_CREDITS',
          statusCode
        )
      }
      if (statusCode === 403) {
        throw new BrevoError(
          'Brevo API access forbidden',
          'FORBIDDEN',
          statusCode
        )
      }

      throw new BrevoError(
        errorBody?.message || 'Failed to send email',
        errorBody?.code,
        statusCode
      )
    }

    // Generic error
    throw new BrevoError(
      error.message || 'Failed to send email',
      error.code,
      error.statusCode
    )
  }
}

/**
 * Handle email bounces and unsubscribes
 * Webhook endpoint for Brevo to call
 */
export async function handleEmailEvent(
  event: 'bounce' | 'unsubscribe',
  email: string,
  context: any
) {
  // TODO: Update member consent_email to false
  // await context.entities.Member.updateMany({
  //   where: { email: email },
  //   data: { consentEmail: false },
  // });
  throw new Error('Brevo event handling not yet implemented');
}

