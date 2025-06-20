import type { NavigationItem } from '../client/components/AppNavbar';
import { routes } from 'wasp/client/router';
import { DocsUrl, BlogUrl } from '../shared/common';
import daBoiAvatar from '../client/static/da-boi.webp';
import avatarPlaceholder from '../client/static/avatar-placeholder.webp';

export const landingPageNavigationItems: NavigationItem[] = [
  { name: 'Features', to: '#features' },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
  { name: 'Wine Caves', to: '/wine-caves' },
  { name: 'Subscriptions', to: '/wine-subscriptions' },
];

export const features = [
  {
    name: 'Wine Cave Management',
    description: 'Create and manage your wine cave with inventory, tiers, and member management tools.',
    icon: '🍷',
    href: '/wine-caves',
  },
  {
    name: 'Subscription Platform',
    description: 'Launch wine subscription services with automated billing and member portals.',
    icon: '📦',
    href: '/wine-subscriptions',
  },
  {
    name: 'Member Analytics',
    description: 'Track member preferences, subscription trends, and business performance.',
    icon: '📊',
    href: '/wine-cave-analytics',
  },
  {
    name: 'Automated Shipping',
    description: 'Integrated shipping with FedEx and UPS for seamless wine delivery.',
    icon: '🚚',
    href: '/shipping-dashboard',
  },
  {
    name: 'Loyalty Program',
    description: 'Reward your best customers with points, referrals, and exclusive offers.',
    icon: '⭐',
    href: '/loyalty-dashboard',
  },
  {
    name: 'Personalized Recommendations',
    description: 'AI-powered wine recommendations based on member preferences and ratings.',
    icon: '🤖',
    href: '/recommendations',
  },
];

export const testimonials = [
  {
    name: 'Sarah Martinez',
    role: 'Owner @ Sunset Vineyard',
    avatarSrc: avatarPlaceholder,
    socialUrl: 'https://twitter.com/sunsetvineyard',
    quote: "This platform transformed our small vineyard into a thriving subscription business. We've grown from 50 to 500 members in just 6 months!",
  },
  {
    name: 'Michael Chen',
    role: 'Founder @ Napa Wine Cave',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'The automated shipping and member management features saved us 20 hours a week. Now we can focus on what we love - making great wine.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Wine Enthusiast & Subscriber',
    avatarSrc: avatarPlaceholder,
    socialUrl: '#',
    quote: 'I love discovering new wines through my subscription. The personalized recommendations are spot-on every time!',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'How do I get started with my wine subscription business?',
    answer: 'Simply sign up, create your wine cave profile, add your wines and subscription tiers, and start accepting members. We provide step-by-step onboarding.',
    href: '/onboarding-wizard',
  },
  {
    id: 2,
    question: 'What shipping carriers do you support?',
    answer: 'We integrate with FedEx and UPS for automated label printing and tracking. More carriers are being added regularly.',
    href: '/shipping-dashboard',
  },
  {
    id: 3,
    question: 'Can I customize my subscription tiers?',
    answer: 'Yes! Create unlimited subscription tiers with custom pricing, wine selections, and delivery frequencies to match your business model.',
    href: '/wine-caves/create',
  },
  {
    id: 4,
    question: 'How does the loyalty program work?',
    answer: 'Members earn points for purchases, referrals, and reviews. They can redeem points for discounts, exclusive wines, or special experiences.',
    href: '/loyalty-dashboard',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Wine Caves', href: '/wine-caves' },
    { name: 'Subscriptions', href: '/wine-subscriptions' },
    { name: 'Analytics', href: '/wine-cave-analytics' },
    { name: 'Documentation', href: DocsUrl },
  ],
  company: [
    { name: 'About', href: 'https://wasp.sh' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Wine Industry Compliance', href: '#' },
  ],
};
