import type { NavigationItem } from '../NavBar/NavBar';
import type { CardNavItem } from './CardNav';

/**
 * Gets a CSS variable value from the document root
 */
function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') return '#fff';
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : '#fff';
}

/**
 * Transforms marketing navigation items into CardNav format
 */
export function transformMarketingNavigation(
  items: NavigationItem[]
): CardNavItem[] {
  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  
  // Get theme colors
  const primary = getCSSVariable('--primary');
  const secondary = getCSSVariable('--secondary');
  const card = getCSSVariable('--card');
  const foreground = getCSSVariable('--foreground');
  const cardForeground = getCSSVariable('--card-foreground');

  return [
    {
      label: 'Fonctionnalités',
      bgColor: isDark ? primary : card,
      textColor: isDark ? getCSSVariable('--primary-foreground') : cardForeground,
      links: items
        .filter((item) => item.to.includes('features') || item.to.includes('about'))
        .map((item) => ({
          label: item.name,
          href: item.to,
          ariaLabel: `Aller à ${item.name}`,
        })),
    },
    {
      label: 'Tarifs',
      bgColor: isDark ? secondary : primary,
      textColor: isDark ? getCSSVariable('--secondary-foreground') : getCSSVariable('--primary-foreground'),
      links: items
        .filter((item) => item.to.includes('pricing') || item.to.includes('tarif'))
        .map((item) => ({
          label: item.name,
          href: item.to,
          ariaLabel: `Aller à ${item.name}`,
        })),
    },
    {
      label: 'Informations',
      bgColor: isDark ? getCSSVariable('--muted') : getCSSVariable('--card-subtle'),
      textColor: isDark ? getCSSVariable('--muted-foreground') : getCSSVariable('--card-subtle-foreground'),
      links: items
        .filter((item) => !item.to.includes('features') && !item.to.includes('pricing') && !item.to.includes('tarif'))
        .map((item) => ({
          label: item.name,
          href: item.to,
          ariaLabel: `Aller à ${item.name}`,
        })),
    },
  ].filter((card) => card.links.length > 0); // Remove empty cards
}

/**
 * Transforms demo/app navigation items into CardNav format
 */
export function transformDemoNavigation(items: NavigationItem[]): CardNavItem[] {
  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  
  // Get theme colors
  const primary = getCSSVariable('--primary');
  const secondary = getCSSVariable('--secondary');
  const card = getCSSVariable('--card');
  const cardForeground = getCSSVariable('--card-foreground');

  return [
    {
      label: 'Gestion',
      bgColor: isDark ? primary : card,
      textColor: isDark ? getCSSVariable('--primary-foreground') : cardForeground,
      links: items
        .filter((item) => item.name === 'Membres' || item.name === 'Campagnes')
        .map((item) => ({
          label: item.name,
          href: item.to,
          ariaLabel: `Aller à ${item.name}`,
        })),
    },
    {
      label: 'Abonnements',
      bgColor: isDark ? secondary : primary,
      textColor: isDark ? getCSSVariable('--secondary-foreground') : getCSSVariable('--primary-foreground'),
      links: items
        .filter((item) => item.name === 'Abonnements' || item.name === 'Box de vin')
        .map((item) => ({
          label: item.name,
          href: item.to,
          ariaLabel: `Aller à ${item.name}`,
        })),
    },
  ].filter((card) => card.links.length > 0); // Remove empty cards
}

/**
 * Gets theme colors for CardNav component
 */
export function getThemeColors() {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    baseColor: '#F4F4F0', // Label cream
    menuColor: '#3F1521', // Vintage wine
    buttonBgColor: 'transparent', // Ghost button
    buttonTextColor: '#3F1521', // Vintage wine
  };
}
