/**
 * Performance monitoring utilities
 * 
 * This module provides utilities for tracking performance metrics
 * including API response times, database query times, and frontend Web Vitals
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

// In-memory storage for performance metrics (in production, send to APM service)
const metrics: PerformanceMetric[] = [];

/**
 * Track API response time
 */
export function trackApiResponseTime(operation: string, durationMs: number, tags?: Record<string, string>) {
  metrics.push({
    name: 'api.response_time',
    value: durationMs,
    timestamp: Date.now(),
    tags: {
      operation,
      ...tags,
    },
  });

  // Log slow queries (> 500ms)
  if (durationMs > 500) {
    console.warn(`Slow API operation: ${operation} took ${durationMs}ms`, tags);
  }
}

/**
 * Track database query time
 */
export function trackDbQueryTime(query: string, durationMs: number, tags?: Record<string, string>) {
  metrics.push({
    name: 'db.query_time',
    value: durationMs,
    timestamp: Date.now(),
    tags: {
      query: query.substring(0, 100), // Truncate long queries
      ...tags,
    },
  });

  // Log slow queries (> 200ms)
  if (durationMs > 200) {
    console.warn(`Slow database query took ${durationMs}ms: ${query.substring(0, 100)}`, tags);
  }
}

/**
 * Track cache hit/miss
 */
export function trackCacheHit(cacheKey: string, hit: boolean) {
  metrics.push({
    name: hit ? 'cache.hit' : 'cache.miss',
    value: 1,
    timestamp: Date.now(),
    tags: {
      key: cacheKey.substring(0, 50), // Truncate long keys
    },
  });
}

/**
 * Get performance metrics summary
 */
export function getPerformanceSummary(): {
  avgApiResponseTime: number;
  avgDbQueryTime: number;
  cacheHitRate: number;
  slowQueries: PerformanceMetric[];
} {
  const apiMetrics = metrics.filter((m) => m.name === 'api.response_time');
  const dbMetrics = metrics.filter((m) => m.name === 'db.query_time');
  const cacheHits = metrics.filter((m) => m.name === 'cache.hit').length;
  const cacheMisses = metrics.filter((m) => m.name === 'cache.miss').length;
  const slowQueries = dbMetrics.filter((m) => m.value > 200);

  const avgApiResponseTime =
    apiMetrics.length > 0 ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length : 0;
  const avgDbQueryTime =
    dbMetrics.length > 0 ? dbMetrics.reduce((sum, m) => sum + m.value, 0) / dbMetrics.length : 0;
  const cacheHitRate =
    cacheHits + cacheMisses > 0 ? cacheHits / (cacheHits + cacheMisses) : 0;

  return {
    avgApiResponseTime,
    avgDbQueryTime,
    cacheHitRate,
    slowQueries,
  };
}

/**
 * Performance monitoring middleware wrapper
 */
export function withPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  operationName: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      trackApiResponseTime(operationName, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      trackApiResponseTime(operationName, duration, { error: 'true' });
      throw error;
    }
  }) as T;
}

