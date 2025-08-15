/// <reference types="node" />

/**
 * Performance monitoring and optimization utilities
 */

const PERFORMANCE_THRESHOLDS = {
  FCP: 1800, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift (score)
  TTI: 3800, // Time to Interactive (ms)
} as const

interface PerformanceMetrics {
  FCP?: number
  LCP?: number
  FID?: number
  CLS?: number
  TTI?: number
  navigationStart?: number
  loadComplete?: number
}

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Report Web Vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ onFCP, onLCP, onCLS, onTTFB }) => {
      onFCP((metric) => reportMetric('FCP', metric.value));
      onLCP((metric) => reportMetric('LCP', metric.value));
      onCLS((metric) => reportMetric('CLS', metric.value));
      onTTFB((metric) => reportMetric('TTFB', metric.value));
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
      // TODO: Handle performance monitoring error (e.g., send to monitoring service)
    }
  }
};

/**
 * Report a performance metric
 */
const reportMetric = (name: string, value: number) => {
  // TODO: Integrate with analytics reporting in production
  // Check against thresholds
  const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  if (threshold && value > threshold) {
    // TODO: Handle threshold exceedance (e.g., send to monitoring service)
  }
};

/**
 * Report a long task
 */
const reportLongTask = (entry: PerformanceEntry) => {
  if (entry.duration > 50) {
    // TODO: Handle long task (e.g., send to monitoring service)
  }
};

/**
 * Report a layout shift
 */
const reportLayoutShift = (entry: any) => {
  if (entry.value > 0.1) {
    // TODO: Handle significant layout shift (e.g., send to monitoring service)
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
  let timeout: ReturnType<typeof setTimeout>;
  return (..._args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(..._args), wait);
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
  return (..._args: Parameters<T>) => {
    if (!inThrottle) {
      func(..._args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 