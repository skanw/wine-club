import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';
import { BlogUrl, DocsUrl } from '../../../shared/common';

export const appNavigationItems: NavigationItem[] = [
  { name: 'Wine Caves', to: routes.WineCaveDashboardRoute.to },
  { name: 'Premium Subscription', to: '/premium-subscription' },
  { name: 'Subscriptions', to: routes.WineSubscriptionsRoute.to },
  { name: 'Member Portal', to: routes.MemberPortalRoute.to },
  { name: 'Demo', to: routes.DemoAppRoute.to },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
];
