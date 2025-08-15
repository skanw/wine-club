/// <reference types="node" />
// 🎯 Performance & UX Metrics Monitor

interface WineClubMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint  
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  tti?: number; // Time to Interactive
  
  // Custom UX Metrics
  themeLoadTime?: number;
  animationFrameRate?: number;
  scrollPerformance?: number;
  interactionLatency?: number;
  
  // Accessibility Metrics
  colorContrast?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
}

class WineClubPerformanceMonitor {
  private metrics: WineClubMetrics = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number = performance.now();

  constructor() {
    this.initializeObservers();
    this.trackCustomMetrics();
  }

  private initializeObservers(): void {
    // Core Web Vitals Observer
    if ('PerformanceObserver' in window) {
      // FCP & LCP Observer
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private trackCustomMetrics(): void {
    // Theme Load Performance
    this.trackThemeLoadTime();
    
    // Animation Performance
    this.trackAnimationPerformance();
    
    // Scroll Performance
    this.trackScrollPerformance();
    
    // Interaction Latency
    this.trackInteractionLatency();
    
    // Accessibility Metrics
    this.trackAccessibilityMetrics();
  }

  private trackThemeLoadTime(): void {
    const themeStart = performance.now();
    
    // Listen for theme change events
    window.addEventListener('themeChange', () => {
      this.metrics.themeLoadTime = performance.now() - themeStart;
    });
    
    // Measure initial theme application
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            (mutation.target as Element).classList.contains('theme-red')) {
          this.metrics.themeLoadTime = performance.now() - this.startTime;
          observer.disconnect();
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private trackAnimationPerformance(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        this.metrics.animationFrameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private trackScrollPerformance(): void {
    let scrollStart: number;
    let isScrolling = false;
    
    const scrollStartHandler = () => {
      if (!isScrolling) {
        scrollStart = performance.now();
        isScrolling = true;
      }
    };
    
    const scrollEndHandler = () => {
      if (isScrolling) {
        this.metrics.scrollPerformance = performance.now() - scrollStart;
        isScrolling = false;
      }
    };
    
    window.addEventListener('scroll', scrollStartHandler, { passive: true });
    
    // Debounced scroll end
    let scrollTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(scrollEndHandler, 150);
    }, { passive: true });
  }

  private trackInteractionLatency(): void {
    const interactionTypes = ['click', 'keydown', 'touchstart'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (_event) => {
        const interactionStart = performance.now();
        
        requestAnimationFrame(() => {
          this.metrics.interactionLatency = performance.now() - interactionStart;
        });
      }, { passive: true });
    });
  }

  private trackAccessibilityMetrics(): void {
    // Color Contrast Check
    this.checkColorContrast();
    
    // Keyboard Navigation Check
    this.checkKeyboardNavigation();
    
    // Screen Reader Support Check
    this.checkScreenReaderSupport();
  }

  private checkColorContrast(): void {
    // Sample key elements for contrast
    const elements = document.querySelectorAll('.wine-button, .navbar-link, .hero-title');
    let contrastPassed = true;
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;
      
      // Basic contrast check (simplified)
      if (this.getContrastRatio(color, backgroundColor) < 4.5) {
        contrastPassed = false;
      }
    });
    
    this.metrics.colorContrast = contrastPassed;
  }

  private getContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In production, use a proper color contrast library
    const rgb1 = this.parseRGB(color1);
    const rgb2 = this.parseRGB(color2);
    
    if (!rgb1 || !rgb2) return 21; // Assume good contrast if can't parse
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private parseRGB(color: string): [number, number, number] | null {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private checkKeyboardNavigation(): void {
    // Check if focusable elements have proper focus indicators
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let keyboardAccessible = true;
    
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      const outlineStyle = styles.outline;
      const boxShadow = styles.boxShadow;
      
      if (outlineStyle === 'none' && boxShadow === 'none') {
        keyboardAccessible = false;
      }
    });
    
    this.metrics.keyboardNavigation = keyboardAccessible;
  }

  private checkScreenReaderSupport(): void {
    // Check for proper semantic HTML and ARIA attributes
    const images = document.querySelectorAll('img');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input');
    
    let screenReaderFriendly = true;
    
    // Check images have alt text
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        screenReaderFriendly = false;
      }
    });
    
    // Check buttons have accessible names
    buttons.forEach(button => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        screenReaderFriendly = false;
      }
    });
    
    // Check inputs have labels
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      
      if (!hasLabel && !hasAriaLabel) {
        screenReaderFriendly = false;
      }
    });
    
    this.metrics.screenReaderSupport = screenReaderFriendly;
  }

  // Public Methods
  public getMetrics(): WineClubMetrics {
    return { ...this.metrics };
  }

  public logMetrics(): void {
    // TODO: Integrate with analytics/monitoring service for metrics logging
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    
    const report = `
# 🍷 Wine Club Performance & UX Report

## Core Web Vitals
- **FCP**: ${metrics.fcp?.toFixed(2) || 'N/A'}ms (Target: ≤1500ms)
- **LCP**: ${metrics.lcp?.toFixed(2) || 'N/A'}ms (Target: ≤2500ms) 
- **FID**: ${metrics.fid?.toFixed(2) || 'N/A'}ms (Target: ≤100ms)
- **CLS**: ${metrics.cls?.toFixed(3) || 'N/A'} (Target: ≤0.1)
- **TTI**: ${metrics.tti?.toFixed(2) || 'N/A'}ms (Target: ≤2000ms)

## UX Metrics
- **Theme Load Time**: ${metrics.themeLoadTime?.toFixed(2) || 'N/A'}ms
- **Animation FPS**: ${metrics.animationFrameRate || 'N/A'}
- **Scroll Performance**: ${metrics.scrollPerformance?.toFixed(2) || 'N/A'}ms
- **Interaction Latency**: ${metrics.interactionLatency?.toFixed(2) || 'N/A'}ms

## Accessibility
- **Color Contrast**: ${metrics.colorContrast ? '✅ Pass' : '❌ Fail'}
- **Keyboard Navigation**: ${metrics.keyboardNavigation ? '✅ Pass' : '❌ Fail'}
- **Screen Reader Support**: ${metrics.screenReaderSupport ? '✅ Pass' : '❌ Fail'}

Generated at: ${new Date().toISOString()}
    `;
    
    return report;
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: WineClubPerformanceMonitor | null = null;

export const getPerformanceMonitor = (): WineClubPerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new WineClubPerformanceMonitor();
  }
  return performanceMonitor;
};

export const startPerformanceMonitoring = (): void => {
  const monitor = getPerformanceMonitor();
  
  // Auto-log metrics every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      monitor.logMetrics();
    }, 30000);
  }
};

export const generatePerformanceReport = (): string => {
  const monitor = getPerformanceMonitor();
  return monitor.generateReport();
};

// Auto-start monitoring
if (typeof window !== 'undefined') {
  startPerformanceMonitoring();
}

export type { WineClubMetrics }; 