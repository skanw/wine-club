interface PerformanceMetrics {
  ttfb: number; // Time to First Byte
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  tti: number;  // Time to Interactive
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Web Vitals Observer
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint & Largest Contentful Paint
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              this.metrics.lcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        this.observers.push(paintObserver);

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }

    // Navigation Timing API
    if ('performance' in window && 'timing' in window.performance) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        this.metrics.ttfb = timing.responseStart - timing.navigationStart;
        
        // Estimate TTI (simplified)
        this.metrics.tti = timing.loadEventEnd - timing.navigationStart;
      });
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  async validatePerformanceBudget(): Promise<{
    passed: boolean;
    results: Array<{
      metric: string;
      value: number;
      budget: number;
      passed: boolean;
      unit: string;
    }>;
  }> {
    const budgets = {
      fcp: 1800,  // 1.8s
      lcp: 2500,  // 2.5s
      fid: 100,   // 100ms
      cls: 0.1,   // 0.1
      tti: 2000,  // 2s
    };

    const results = Object.entries(budgets).map(([metric, budget]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics] || 0;
      const passed = value <= budget;
      
      return {
        metric: metric.toUpperCase(),
        value: Math.round(value * 100) / 100,
        budget,
        passed,
        unit: metric === 'cls' ? '' : 'ms'
      };
    });

    const allPassed = results.every(result => result.passed);

    return {
      passed: allPassed,
      results
    };
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    const report = `
🎯 Wine Club Performance Report
================================

Core Web Vitals:
• First Contentful Paint: ${metrics.fcp ? Math.round(metrics.fcp) + 'ms' : 'Not measured'}
• Largest Contentful Paint: ${metrics.lcp ? Math.round(metrics.lcp) + 'ms' : 'Not measured'}  
• First Input Delay: ${metrics.fid ? Math.round(metrics.fid) + 'ms' : 'Not measured'}
• Cumulative Layout Shift: ${metrics.cls ? Math.round(metrics.cls * 1000) / 1000 : 'Not measured'}

Additional Metrics:
• Time to First Byte: ${metrics.ttfb ? Math.round(metrics.ttfb) + 'ms' : 'Not measured'}
• Time to Interactive: ${metrics.tti ? Math.round(metrics.tti) + 'ms' : 'Not measured'}

Performance Budget Status:
${metrics.fcp && metrics.fcp <= 1800 ? '✅' : '❌'} FCP under 1.8s
${metrics.lcp && metrics.lcp <= 2500 ? '✅' : '❌'} LCP under 2.5s  
${metrics.fid && metrics.fid <= 100 ? '✅' : '❌'} FID under 100ms
${metrics.cls && metrics.cls <= 0.1 ? '✅' : '❌'} CLS under 0.1
${metrics.tti && metrics.tti <= 2000 ? '✅' : '❌'} TTI under 2s
    `;

    return report;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Wine-specific performance validation
export const validateWineClubPerformance = async (): Promise<boolean> => {
  const validation = await performanceMonitor.validatePerformanceBudget();
  
  console.log('🍷 Wine Club Performance Validation:');
  validation.results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.metric}: ${result.value}${result.unit} (Budget: ${result.budget}${result.unit})`);
  });

  return validation.passed;
};

// Export for testing
export default PerformanceMonitor; 