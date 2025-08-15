import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  domLoad: number | null; // DOM Content Loaded
  windowLoad: number | null; // Window Load
}

interface PerformanceObserver {
  observe: (options: any) => void;
  disconnect: () => void;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domLoad: null,
    windowLoad: null
  });

  const [isSupported, setIsSupported] = useState(false);

  // Check if Performance Observer is supported
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      'PerformanceObserver' in window &&
      'performance' in window
    );
  }, []);

  // Measure Time to First Byte
  const measureTTFB = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.requestStart
      }));
    }
  }, []);

  // Measure DOM and Window Load times
  const measureLoadTimes = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        windowLoad: navigation.loadEventEnd - navigation.loadEventStart
      }));
    }
  }, []);

  // Monitor Core Web Vitals
  useEffect(() => {
    if (!isSupported) return;

    // First Contentful Paint
    const fcpObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: fcpEntry.startTime
        }));
      }
    });

    // Largest Contentful Paint
    const lcpObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({
          ...prev,
          lcp: lastEntry.startTime
        }));
      }
    });

    // First Input Delay
    const fidObserver = new (window as any).PerformanceObserver((list: any) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => ({
          ...prev,
          fid: entry.processingStart - entry.startTime
        }));
      });
    });

    // Cumulative Layout Shift
    const clsObserver = new (window as any).PerformanceObserver((list: any) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics(prev => ({
        ...prev,
        cls: clsValue
      }));
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Measure load times when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', measureLoadTimes);
    } else {
      measureLoadTimes();
    }

    // Measure TTFB immediately
    measureTTFB();

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      document.removeEventListener('DOMContentLoaded', measureLoadTimes);
    };
  }, [isSupported, measureTTFB, measureLoadTimes]);

  // Calculate performance score
  const calculateScore = useCallback(() => {
    let score = 100;
    const { fcp, lcp, fid, cls } = metrics;

    // FCP scoring (good: < 1.8s, needs improvement: 1.8-3s, poor: > 3s)
    if (fcp && fcp > 3000) score -= 30;
    else if (fcp && fcp > 1800) score -= 15;

    // LCP scoring (good: < 2.5s, needs improvement: 2.5-4s, poor: > 4s)
    if (lcp && lcp > 4000) score -= 30;
    else if (lcp && lcp > 2500) score -= 15;

    // FID scoring (good: < 100ms, needs improvement: 100-300ms, poor: > 300ms)
    if (fid && fid > 300) score -= 20;
    else if (fid && fid > 100) score -= 10;

    // CLS scoring (good: < 0.1, needs improvement: 0.1-0.25, poor: > 0.25)
    if (cls && cls > 0.25) score -= 20;
    else if (cls && cls > 0.1) score -= 10;

    return Math.max(0, score);
  }, [metrics]);

  // Get performance grade
  const getGrade = useCallback((score: number) => {
    if (score >= 90) return { grade: 'A', color: 'green' };
    if (score >= 70) return { grade: 'B', color: 'yellow' };
    if (score >= 50) return { grade: 'C', color: 'orange' };
    return { grade: 'D', color: 'red' };
  }, []);

  // Get optimization recommendations
  const getRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    const { fcp, lcp, fid, cls, ttfb } = metrics;

    if (fcp && fcp > 1800) {
      recommendations.push('Optimize First Contentful Paint by reducing server response time and critical resources');
    }

    if (lcp && lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by improving image loading and server response time');
    }

    if (fid && fid > 100) {
      recommendations.push('Reduce First Input Delay by minimizing main thread work and breaking up long tasks');
    }

    if (cls && cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting explicit dimensions for images and ads');
    }

    if (ttfb && ttfb > 600) {
      recommendations.push('Improve Time to First Byte by optimizing server response time and using CDN');
    }

    return recommendations;
  }, [metrics]);

  return {
    metrics,
    isSupported,
    score: calculateScore(),
    grade: getGrade(calculateScore()),
    recommendations: getRecommendations(),
    isComplete: Object.values(metrics).some(value => value !== null)
  };
}; 