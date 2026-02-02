/**
 * Rate limiter for Twilio SMS sending
 * Twilio limits: ~1 SMS/second per phone number
 * We use a conservative limit of 0.5/second (1 every 2 seconds)
 */

interface RateLimitEntry {
  lastSent: number
  queue: Array<() => Promise<void>>
  processing: boolean
}

// In-memory rate limiter per cave (or global if single config)
const rateLimiters = new Map<string, RateLimitEntry>()

const MIN_INTERVAL_MS = 2000 // 2 seconds between messages (0.5/second)
const MAX_QUEUE_SIZE = 1000
const QUEUE_TIMEOUT_MS = 60000 // 1 minute timeout for queued messages

/**
 * Get or create rate limiter for a cave
 */
function getRateLimiter(caveId: string): RateLimitEntry {
  if (!rateLimiters.has(caveId)) {
    rateLimiters.set(caveId, {
      lastSent: 0,
      queue: [],
      processing: false,
    })
  }
  return rateLimiters.get(caveId)!
}

/**
 * Wait for rate limit window
 * Returns a promise that resolves when it's safe to send
 */
export async function waitForRateLimit(caveId: string = 'global'): Promise<void> {
  const limiter = getRateLimiter(caveId)
  const now = Date.now()
  const timeSinceLastSent = now - limiter.lastSent

  if (timeSinceLastSent >= MIN_INTERVAL_MS) {
    // Can send immediately
    limiter.lastSent = now
    return
  }

  // Need to wait
  const waitTime = MIN_INTERVAL_MS - timeSinceLastSent
  await new Promise((resolve) => setTimeout(resolve, waitTime))
  limiter.lastSent = Date.now()
}

/**
 * Process queued messages
 */
async function processQueue(caveId: string): Promise<void> {
  const limiter = getRateLimiter(caveId)

  if (limiter.processing || limiter.queue.length === 0) {
    return
  }

  limiter.processing = true

  while (limiter.queue.length > 0) {
    const messageFn = limiter.queue.shift()
    if (messageFn) {
      try {
        await messageFn()
      } catch (error) {
        console.error(`Error processing queued SMS for cave ${caveId}:`, error)
      }
    }
    await waitForRateLimit(caveId)
  }

  limiter.processing = false
}

/**
 * Queue a message for sending with rate limiting
 */
export async function queueSMS(
  caveId: string,
  sendFn: () => Promise<void>
): Promise<void> {
  const limiter = getRateLimiter(caveId)

  if (limiter.queue.length >= MAX_QUEUE_SIZE) {
    throw new Error(
      `SMS queue is full (${MAX_QUEUE_SIZE} messages). Please try again later.`
    )
  }

  // Add to queue
  limiter.queue.push(sendFn)

  // Start processing if not already processing
  if (!limiter.processing) {
    // Process in background (don't await)
    processQueue(caveId).catch((error) => {
      console.error(`Error processing SMS queue for cave ${caveId}:`, error)
    })
  }

  // Wait for our message to be processed
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('SMS queue timeout'))
    }, QUEUE_TIMEOUT_MS)

    const checkInterval = setInterval(() => {
      if (limiter.queue.length === 0 && !limiter.processing) {
        clearInterval(checkInterval)
        clearTimeout(timeout)
        resolve()
      }
    }, 100)
  })
}

/**
 * Check if rate limiter is ready (no queue backlog)
 */
export function isRateLimitReady(caveId: string = 'global'): boolean {
  const limiter = rateLimiters.get(caveId)
  if (!limiter) return true
  return limiter.queue.length === 0 && !limiter.processing
}
