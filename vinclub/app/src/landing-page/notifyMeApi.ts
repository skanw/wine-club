/**
 * Public API: "Notify me when ready" waitlist signup.
 * Stores email in WaitlistSignup; idempotent for duplicate emails.
 */

import type { NotifyMe } from 'wasp/server/api'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed)
}

export const handleNotifyMe: NotifyMe = async (req, res, context) => {
  try {
    const body = req.body as { email?: unknown }
    const rawEmail = body?.email

    if (!isValidEmail(rawEmail)) {
      res.status(400).json({ success: false, message: 'Invalid email' })
      return
    }

    const email = (rawEmail as string).trim().toLowerCase()

    // Idempotent: if email already exists, return success (no duplicate record)
    const existing = await context.entities.WaitlistSignup.findUnique({
      where: { email },
    })
    if (existing) {
      res.status(200).json({ success: true })
      return
    }

    await context.entities.WaitlistSignup.create({
      data: { email },
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('NotifyMe API error:', error)
    res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
