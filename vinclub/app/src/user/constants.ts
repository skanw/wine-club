import { LayoutDashboard, Settings, Shield, Users } from 'lucide-react';
import { routes } from 'wasp/client/router';

export const userMenuItems = [
  {
    name: 'Tableau de bord',
    to: routes.DashboardRoute.to,
    icon: LayoutDashboard,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: 'Membres',
    to: routes.MembersRoute.to,
    icon: Users,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: 'Paramètres du compte',
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
  {
    name: 'Tableau de bord admin',
    to: routes.AdminRoute.to,
    icon: Shield,
    isAuthRequired: false,
    isAdminOnly: true,
  },
] as const;
