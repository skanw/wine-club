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
export const initializeAnalytics = (_config: AnalyticsConfig) => {
  // TODO: Integrate analytics initialization with provider
};

// Track event (client-side only)
export const trackEvent = (_event: string, _properties?: Record<string, any>) => {
  // TODO: Integrate event tracking with analytics provider
};

// Track page view (client-side only)
export const trackPageView = (_path: string) => {
  // TODO: Integrate page view tracking with analytics provider
};

// Identify user (client-side only)
export const identifyUser = (_userId: string, _traits?: Record<string, any>) => {
  // TODO: Integrate user identification with analytics provider
}; 