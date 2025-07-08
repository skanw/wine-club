import * as googleAnalytics from '../../analytics/providers/googleAnalyticsUtils';
import * as plausible from '../../analytics/providers/plausibleAnalyticsUtils';

// Analytics event types
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

// Analytics provider interface
export interface AnalyticsProvider {
  getDailyPageViews: () => Promise<{
    totalViews: number;
    prevDayViewsChangePercent: string;
  }>;
  getSources: () => Promise<any[]>;
}

// Re-export analytics utilities
export const analytics = {
  google: googleAnalytics,
  plausible: plausible
} as const;

// Get daily page views from all providers
export const getDailyPageViews = async () => {
  const [googleData, plausibleData] = await Promise.all([
    googleAnalytics.getDailyPageViews(),
    plausible.getDailyPageViews()
  ]);

  return {
    google: googleData,
    plausible: plausibleData
  };
};

// Get sources from all providers
export const getSources = async () => {
  const [googleSources, plausibleSources] = await Promise.all([
    googleAnalytics.getSources(),
    plausible.getSources()
  ]);

  return {
    google: googleSources,
    plausible: plausibleSources
  };
};

// Analytics configuration
export interface AnalyticsConfig {
  providers: {
    googleAnalytics?: {
      trackingId: string;
    };
    plausible?: {
      domain: string;
    };
  };
}

// Initialize analytics with configuration
export const initializeAnalytics = (config: AnalyticsConfig): void => {
  // No initialization needed for server-side analytics
  console.log('Analytics initialized with config:', config);
};

// Track event (client-side only)
export const trackEvent = (event: AnalyticsEvent): void => {
  // Events should be tracked client-side using the respective provider's script
  console.log('Track event:', event);
};

// Track page view (client-side only)
export const trackPageView = (path: string): void => {
  // Page views should be tracked client-side using the respective provider's script
  console.log('Track page view:', path);
};

// Identify user (client-side only)
export const identifyUser = (userId: string, traits?: Record<string, any>): void => {
  // User identification should be done client-side using the respective provider's script
  console.log('Identify user:', userId, traits);
}; 