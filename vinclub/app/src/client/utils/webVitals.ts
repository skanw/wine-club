/**
 * Web Vitals tracking for frontend performance monitoring
 * 
 * Tracks Core Web Vitals:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay) / INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Send Web Vitals to analytics endpoint
 */
function sendToAnalytics(metric: WebVitalMetric) {
  // In production, send to your analytics service (e.g., Google Analytics, Plausible, etc.)
  // For now, log to console
  console.log('Web Vital:', metric);

  // Example: Send to Plausible (if configured)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Web Vital', {
      props: {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      },
    });
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') {
    return;
  }

  // Dynamically import web-vitals library (optional dependency)
  // Only works if web-vitals is installed: npm install web-vitals
  // Use eval to bypass TypeScript checking for optional dependency
  eval('import("web-vitals")')
    .then((webVitals: any) => {
      const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = webVitals;
      onCLS(sendToAnalytics);
      onFID(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      if (onINP) {
        onINP(sendToAnalytics);
      }
    })
    .catch((error: any) => {
      // web-vitals not installed, silently skip
      // Install with: npm install web-vitals
      if (process.env.NODE_ENV === 'development') {
        console.debug('Web Vitals tracking not available (optional dependency). Install with: npm install web-vitals');
      }
    });
}

