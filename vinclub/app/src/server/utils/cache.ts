/**
 * Caching utility with Redis support and in-memory fallback
 * 
 * To use Redis:
 * 1. Install redis: npm install redis
 * 2. Set REDIS_URL environment variable
 * 3. Redis will be used automatically
 * 
 * Without Redis, falls back to in-memory cache (cleared on server restart)
 */

interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

// In-memory cache fallback
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

// Cache TTL constants
export const CACHE_TTL = {
  SUBSCRIPTION_PLANS: 3600, // 1 hour
  CAVE_SETTINGS: 3600, // 1 hour
  MEMBER_COUNT: 300, // 5 minutes
  CAMPAIGN_STATS: 60, // 1 minute
  SUBSCRIPTION_PLAN_BY_ID: 1800, // 30 minutes
} as const;

/**
 * Get cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    // Try Redis first if available
    if (process.env.REDIS_URL) {
      const redis = await getRedisClient();
      if (redis) {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached) as T;
        }
        return null;
      }
    }

    // Fallback to memory cache
    const cached = memoryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }
    
    // Clean up expired entry
    if (cached) {
      memoryCache.delete(key);
    }
    
    return null;
  } catch (error) {
    // Log with structured logging
    console.error('Cache get error:', {
      key: key.substring(0, 50), // Truncate long keys
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    
    // Track cache failures for monitoring
    // In production, send to monitoring service (Sentry, Datadog, etc.)
    
    return null; // Graceful degradation
  }
}

/**
 * Set cached value
 */
export async function setCache<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
  try {
    const ttl = options.ttl || 3600; // Default 1 hour

    // Try Redis first if available
    if (process.env.REDIS_URL) {
      const redis = await getRedisClient();
      if (redis) {
        await redis.setEx(key, ttl, JSON.stringify(value));
        return;
      }
    }

    // Fallback to memory cache
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  } catch (error) {
    // Log with structured logging
    console.error('Cache set error:', {
      key: key.substring(0, 50), // Truncate long keys
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    
    // Track cache failures for monitoring
    // In production, send to monitoring service (Sentry, Datadog, etc.)
    
    // Don't throw - caching is non-critical
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    // Try Redis first if available
    if (process.env.REDIS_URL) {
      const redis = await getRedisClient();
      if (redis) {
        await redis.del(key);
        return;
      }
    }

    // Fallback to memory cache
    memoryCache.delete(key);
  } catch (error) {
    console.error('Cache delete error:', {
      key: key.substring(0, 50), // Truncate long keys
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Delete cache by pattern (for invalidation)
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    // Try Redis first if available
    if (process.env.REDIS_URL) {
      const redis = await getRedisClient();
      if (redis) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(keys);
        }
        return;
      }
    }

    // Fallback to memory cache - delete all matching keys using regex
    const keysToDelete: string[] = [];
    // Convert wildcard pattern to regex (e.g., "member:*:123" -> /^member:.*:123$/)
    const regexPattern = pattern.replace(/\*/g, '.*').replace(/::/g, ':');
    const regex = new RegExp(`^${regexPattern}$`);

    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => memoryCache.delete(key));
  } catch (error) {
    console.error('Cache pattern delete error:', {
      pattern: pattern.substring(0, 50), // Truncate long patterns
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Generate cache key
 * Escapes colons in parts to prevent key collisions
 */
export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  // Escape colons in parts to prevent collisions
  const escapedParts = parts.map(p => String(p).replace(/:/g, '::'));
  return `${prefix}:${escapedParts.join(':')}`;
}

// Redis client singleton
let redisClient: any = null;

async function getRedisClient(): Promise<any | null> {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    // Dynamic import to avoid requiring redis in package.json if not used
    // Use eval to bypass TypeScript checking for optional dependency
    const redisModule = await eval('import("redis")').catch(() => null);
    if (!redisModule) {
      // Redis not installed, fall back to memory cache
      console.warn('Redis package not installed, using in-memory cache. Install with: npm install redis');
      return null;
    }

    const redis = redisModule as any;
    const client = redis.createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
      redisClient = null; // Reset on error
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.warn('Redis not available, using in-memory cache:', error);
    return null;
  }
}

