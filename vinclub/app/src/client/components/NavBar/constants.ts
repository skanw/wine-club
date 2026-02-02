import { routes } from 'wasp/client/router';
import type { NavigationItem } from './NavBar';

export const marketingNavigationItems: NavigationItem[] = [
  { name: 'Solution', to: '/#solution' },
  { name: 'Sécurité', to: '/#security' },
  { name: 'Calculateur', to: routes.CalculatorRoute.to },
  { name: 'Tarifs', to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: 'Tableau de bord', to: routes.DashboardRoute.to },
  { name: 'Membres', to: routes.MembersRoute.to },
  { name: 'Campagnes', to: routes.CampaignsRoute.to },
  { name: 'Abonnements', to: routes.SubscriptionsRoute.to },
  { name: 'Box de vin', to: routes.WineBoxesRoute.to },
] as const;
