/**
 * Error handling for campaign message sending
 */

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class InvalidPhoneError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPhoneError'
  }
}

export class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidEmailError'
  }
}

export class BounceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BounceError'
  }
}

export class UnsubscribedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsubscribedError'
  }
}

export class UnknownError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'UnknownError'
  }
}

/**
 * Classify error type for retry logic
 */
export function classifyError(error: Error): {
  isTransient: boolean
  shouldRetry: boolean
  maxRetries: number
} {
  // Transient errors (network issues, rate limits) - should retry
  if (
    error instanceof RateLimitError ||
    error.name === 'RateLimitError' ||
    error.message.includes('rate limit') ||
    error.message.includes('timeout') ||
    error.message.includes('network')
  ) {
    return {
      isTransient: true,
      shouldRetry: true,
      maxRetries: 3,
    }
  }

  // Permanent errors (invalid phone/email, unsubscribed) - don't retry
  if (
    error instanceof InvalidPhoneError ||
    error instanceof InvalidEmailError ||
    error instanceof BounceError ||
    error instanceof UnsubscribedError ||
    error.name === 'InvalidPhoneError' ||
    error.name === 'InvalidEmailError' ||
    error.name === 'BounceError' ||
    error.name === 'UnsubscribedError' ||
    error.message.includes('invalid') ||
    error.message.includes('unsubscribed') ||
    error.message.includes('bounce')
  ) {
    return {
      isTransient: false,
      shouldRetry: false,
      maxRetries: 0,
    }
  }

  // Unknown errors - retry once
  return {
    isTransient: true,
    shouldRetry: true,
    maxRetries: 1,
  }
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(retryCount: number, baseDelay: number = 1000): number {
  return baseDelay * Math.pow(2, retryCount)
}
