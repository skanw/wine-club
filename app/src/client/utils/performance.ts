/**
 * Performance monitoring and optimization utilities
 */

import type { Metric } from 'web-vitals';

// Constants for performance thresholds
const PERFORMANCE_THRESHOLDS = {
  FCP: 1800, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift (score)
  TTI: 3800, // Time to Interactive (ms)
} as const;

// Interface for performance metrics
interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTI?: number;
  navigationStart?: number;
  loadComplete?: number;
}

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Report Web Vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ onFCP, onLCP, onCLS, onTTFB }) => {
      onFCP((metric: Metric) => reportMetric('FCP', metric.value));
      onLCP((metric: Metric) => reportMetric('LCP', metric.value));
      onCLS((metric: Metric) => reportMetric('CLS', metric.value));
      onTTFB((metric: Metric) => reportMetric('TTFB', metric.value));
    });
  }

  // Initialize Performance Observer
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Report long tasks
          if (entry.entryType === 'longtask') {
            reportLongTask(entry);
          }
          // Report layout shifts
          if (entry.entryType === 'layout-shift') {
            reportLayoutShift(entry);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask', 'layout-shift'] });
    } catch (e) {
      console.error('Performance monitoring error:', e);
    }
  }
};

/**
 * Report a performance metric
 */
const reportMetric = (name: string, value: number) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance metric - ${name}:`, value);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement analytics reporting
  }

  // Check against thresholds
  const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  if (threshold && value > threshold) {
    console.warn(`Performance metric ${name} (${value}) exceeds threshold (${threshold})`);
  }
};

/**
 * Report a long task
 */
const reportLongTask = (entry: PerformanceEntry) => {
  if (entry.duration > 50) { // Tasks longer than 50ms are considered problematic
    console.warn('Long task detected:', {
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name
    });
  }
};

/**
 * Report a layout shift
 */
const reportLayoutShift = (entry: any) => {
  if (entry.value > 0.1) { // CLS values over 0.1 are considered problematic
    console.warn('Significant layout shift detected:', {
      value: entry.value,
      startTime: entry.startTime,
      elements: entry.sources?.map((source: any) => ({
        node: source.node,
        previousRect: source.previousRect,
        currentRect: source.currentRect
      }))
    });
  }
};

/**
 * Get current performance metrics
 */
export const getCurrentPerformanceMetrics = (): PerformanceMetrics => {
  if (typeof window === 'undefined') return {};

  const metrics: PerformanceMetrics = {};
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (navigation) {
    metrics.navigationStart = navigation.startTime;
    metrics.loadComplete = navigation.loadEventEnd;
  }

  // Get paint metrics
  const paintMetrics = performance.getEntriesByType('paint');
  for (const paint of paintMetrics) {
    if (paint.name === 'first-contentful-paint') {
      metrics.FCP = paint.startTime;
    }
  }

  return metrics;
};

/**
 * Optimize image loading
 */
export const optimizeImageLoading = (imageElement: HTMLImageElement) => {
  // Set loading attribute
  imageElement.loading = 'lazy';

  // Set decoding attribute
  imageElement.decoding = 'async';

  // Add srcset if available
  if (imageElement.src && !imageElement.srcset) {
    const src = imageElement.src;
    const extension = src.split('.').pop();
    if (extension) {
      imageElement.srcset = `
        ${src.replace(`.${extension}`, `-small.${extension}`)} 300w,
        ${src.replace(`.${extension}`, `-medium.${extension}`)} 600w,
        ${src.replace(`.${extension}`, `-large.${extension}`)} 900w
      `;
    }
  }

  return imageElement;
};

/**
 * Optimize media queries
 */
export const optimizeMediaQueries = () => {
  // Define breakpoints
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  };

  // Create media query strings
  const mediaQueries = {
    sm: `(min-width: ${breakpoints.sm})`,
    md: `(min-width: ${breakpoints.md})`,
    lg: `(min-width: ${breakpoints.lg})`,
    xl: `(min-width: ${breakpoints.xl})`,
    '2xl': `(min-width: ${breakpoints['2xl']})`,
    dark: '(prefers-color-scheme: dark)',
    light: '(prefers-color-scheme: light)',
    reducedMotion: '(prefers-reduced-motion: reduce)',
    highContrast: '(prefers-contrast: more)',
  };

  // Create media query listeners
  const mediaQueryLists = Object.entries(mediaQueries).reduce((acc, [key, query]) => {
    acc[key] = window.matchMedia(query);
    return acc;
  }, {} as Record<string, MediaQueryList>);

  return {
    breakpoints,
    mediaQueries,
    mediaQueryLists
  };
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 