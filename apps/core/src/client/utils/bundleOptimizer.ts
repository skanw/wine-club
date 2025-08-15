import React from 'react';

// Bundle Optimization Utilities
// This utility helps analyze and optimize JavaScript bundle size

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  modules: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
  recommendations: string[];
}

interface OptimizationConfig {
  enableTreeShaking: boolean;
  enableCodeSplitting: boolean;
  enableDynamicImports: boolean;
  enableLazyLoading: boolean;
  minifyCode: boolean;
  compressAssets: boolean;
}

const optimizationConfig: OptimizationConfig = {
  enableTreeShaking: true,
  enableCodeSplitting: true,
  enableDynamicImports: true,
  enableLazyLoading: true,
  minifyCode: true,
  compressAssets: true
};

/**
 * Analyze bundle size (simulated - in real app, use webpack-bundle-analyzer)
 */
export const analyzeBundle = (): BundleAnalysis => {
  // This is a simulation - in production, you'd use actual bundle analysis
  return {
    totalSize: 1024 * 1024, // 1MB
    gzippedSize: 256 * 1024, // 256KB
    modules: [
      { name: 'react', size: 128 * 1024, percentage: 12.5 },
      { name: 'react-dom', size: 96 * 1024, percentage: 9.4 },
      { name: 'lucide-react', size: 64 * 1024, percentage: 6.3 },
      { name: 'tailwindcss', size: 48 * 1024, percentage: 4.7 },
      { name: 'wasp-client', size: 256 * 1024, percentage: 25.0 },
      { name: 'other-modules', size: 432 * 1024, percentage: 42.1 }
    ],
    chunks: [
      {
        name: 'main',
        size: 512 * 1024,
        modules: ['react', 'react-dom', 'wasp-client']
      },
      {
        name: 'vendor',
        size: 256 * 1024,
        modules: ['lucide-react', 'tailwindcss']
      },
      {
        name: 'async',
        size: 256 * 1024,
        modules: ['other-modules']
      }
    ],
    recommendations: [
      'Enable code splitting for routes',
      'Use dynamic imports for heavy components',
      'Optimize third-party library imports',
      'Implement lazy loading for images',
      'Consider using smaller icon libraries'
    ]
  };
};

/**
 * Dynamic import wrapper for code splitting
 */
export const dynamicImport = <T>(importFn: () => Promise<T>): Promise<T> => {
  return importFn();
};

/**
 * Lazy load component with loading state
 */
export const lazyLoadComponent = (
  importFn: () => Promise<any>,
  fallback?: React.ComponentType
) => {
  return React.lazy(() => 
    importFn().catch(() => {
      if (fallback) {
        return { default: fallback };
      }
      throw new Error('Failed to load component');
    })
  );
};

/**
 * Optimize icon imports
 */
export const optimizeIconImports = () => {
  // Instead of importing all icons, import only what's needed
  // This reduces bundle size significantly
  return {
    // Import icons individually
    Star: () => import('lucide-react').then(m => ({ default: m.Star })),
    Check: () => import('lucide-react').then(m => ({ default: m.Check })),
    Users: () => import('lucide-react').then(m => ({ default: m.Users })),
    // Add more as needed
  };
};

/**
 * Tree shaking optimization
 */
export const optimizeImports = {
  // Only import what you need from large libraries
  lodash: {
    debounce: (func: Function, wait: number) => {
      // Simple debounce implementation without lodash
      let timeout: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), wait);
      };
    },
    throttle: (func: Function, limit: number) => {
      // Simple throttle implementation without lodash
      let inThrottle: boolean;
      return (...args: any[]) => {
        if (!inThrottle) {
          func.apply(null, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    isEmpty: (value: any) => {
      // Simple isEmpty implementation without lodash
      if (value == null) return true;
      if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    }
  },
  
  // Date libraries - simplified for now
  dateFns: {
    format: (date: Date, format: string) => {
      // Simple date formatting without external dependency
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },
    parseISO: (dateString: string) => new Date(dateString),
    isToday: (date: Date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }
  }
};

/**
 * Generate bundle optimization recommendations
 */
export const generateOptimizationRecommendations = (analysis: BundleAnalysis): string[] => {
  const recommendations: string[] = [];

  // Check for large modules
  const largeModules = analysis.modules.filter(m => m.size > 100 * 1024); // > 100KB
  if (largeModules.length > 0) {
    recommendations.push(`Consider code splitting for large modules: ${largeModules.map(m => m.name).join(', ')}`);
  }

  // Check bundle size
  if (analysis.totalSize > 2 * 1024 * 1024) { // > 2MB
    recommendations.push('Bundle size is large. Consider implementing aggressive code splitting.');
  }

  // Check gzip ratio
  const gzipRatio = analysis.gzippedSize / analysis.totalSize;
  if (gzipRatio > 0.4) { // > 40%
    recommendations.push('Gzip compression ratio could be improved. Consider minification and tree shaking.');
  }

  return recommendations;
};

/**
 * Implement route-based code splitting
 */
export const createRouteChunks = () => {
  return {
    // Lazy load pages
    LandingPage: () => import('../pages/LandingPage'),
    DashboardPage: () => import('../pages/DashboardPage'),
    PricingPage: () => import('../pages/PricingPage'),
    AboutPage: () => import('../pages/AboutPage'),
    ContactPage: () => import('../pages/ContactPage'),
    
    // Lazy load components
    TestimonialsSection: () => import('../components/TestimonialsSection'),
    PricingSection: () => import('../components/PricingSection'),
    AccessibilityAudit: () => import('../components/AccessibilityAudit'),
    PerformanceMonitor: () => import('../components/PerformanceMonitor')
  };
};

/**
 * Optimize third-party library usage
 */
export const optimizeThirdPartyLibraries = () => {
  return {
    // Use smaller alternatives
    moment: 'date-fns', // Smaller date library
    lodash: 'native-js', // Use native JavaScript methods
    axios: 'fetch', // Use native fetch API
    
    // Bundle size comparisons
    alternatives: {
      'moment.js': '~232KB',
      'date-fns': '~13KB',
      'lodash': '~70KB',
      'native-js': '~0KB',
      'axios': '~13KB',
      'fetch': '~0KB'
    }
  };
};

/**
 * Monitor bundle size in development
 */
export const monitorBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const analysis = analyzeBundle();
    
    console.group('📦 Bundle Analysis');
    console.log(`Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Gzipped Size: ${(analysis.gzippedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Compression Ratio: ${((1 - analysis.gzippedSize / analysis.totalSize) * 100).toFixed(1)}%`);
    
    console.group('Top Modules:');
    analysis.modules.slice(0, 5).forEach(module => {
      console.log(`${module.name}: ${(module.size / 1024).toFixed(1)}KB (${module.percentage}%)`);
    });
    console.groupEnd();
    
    console.group('Recommendations:');
    analysis.recommendations.forEach(rec => console.log(`• ${rec}`));
    console.groupEnd();
    
    console.groupEnd();
  }
};

/**
 * Get optimization configuration
 */
export const getOptimizationConfig = (): OptimizationConfig => {
  return { ...optimizationConfig };
};

/**
 * Update optimization configuration
 */
export const updateOptimizationConfig = (config: Partial<OptimizationConfig>): void => {
  Object.assign(optimizationConfig, config);
};

export default {
  analyzeBundle,
  dynamicImport,
  lazyLoadComponent,
  optimizeIconImports,
  optimizeImports,
  generateOptimizationRecommendations,
  createRouteChunks,
  optimizeThirdPartyLibraries,
  monitorBundleSize,
  getOptimizationConfig,
  updateOptimizationConfig
}; 