import { NavigationItem } from '../client/components/AppNavbar';
import { routes } from 'wasp/client/router';
import { DocsUrl, BlogUrl } from '../shared/common';
import avatarPlaceholder from '../client/static/avatar-placeholder.webp';

export const landingPageNavigationItems: NavigationItem[] = [
  { name: 'About', to: routes.AboutRoute?.to || '/about' },
  { name: 'Features', to: '#features' },
  { name: 'Blog', to: routes.BlogRoute?.to || '/blog' },
  { name: 'Contact', to: routes.ContactRoute?.to || '/contact' },
];

export const heroSection = {
  title: "Découvrez l'Art du Vin Français",
  subtitle: "Abonnements premium de vins français sélectionnés par des sommeliers experts",
  ctaText: "Commencer l'Expérience",
  ctaLink: routes.LandingPageRoute.to,
  features: [
    "Sélection exclusive de vins français",
    "Livraison automatisée mensuelle",
    "Conseils de sommeliers experts",
    "Programme de fidélité premium"
  ]
};

export const howItWorksSection = {
  title: "Comment ça marche",
  steps: [
    {
      title: "Choisissez votre cave",
      description: "Sélectionnez parmi nos caves partenaires expertes",
      link: routes.LandingPageRoute.to
    },
    {
      title: "Personnalisez votre abonnement",
      description: "Adaptez votre sélection selon vos préférences",
      link: routes.LandingPageRoute.to
    },
    {
      title: "Recevez vos vins",
      description: "Livraison automatique à domicile chaque mois",
      link: routes.LandingPageRoute.to
    }
  ]
};

export const featuresSection = {
  title: "Why Choose WineClub Pro?",
  subtitle: "Experience the finest French wines with our premium subscription service",
  features: [
    {
      title: "Expert Curation",
      description: "Each wine is carefully selected by certified sommeliers",
      icon: "🍷"
    },
    {
      title: "Premium Quality",
      description: "Only the finest French wines from renowned regions",
      icon: "⭐"
    },
    {
      title: "Flexible Plans",
      description: "Choose the subscription that fits your taste and budget",
      icon: "📦"
    }
  ]
};

export const features = [
  {
    name: 'Wine Cave Management',
    description: 'Create and manage your wine cave profile with detailed information and branding.',
    icon: '🏰',
    href: '/wine-cave/create',
  },
  {
    name: 'Subscription Platform',
    description: 'Offer flexible subscription tiers with different pricing and bottle quantities.',
    icon: '📦',
    href: '/wine-caves',
  },
  {
    name: 'Member Analytics',
    description: 'Track subscription performance, revenue, and member engagement metrics.',
    icon: '📊',
    href: '/dashboard',
  },
  {
    name: 'Automated Shipping',
    description: 'Streamlined shipping and fulfillment with tracking and delivery management.',
    icon: '🚚',
    href: '/dashboard',
  },
  {
    name: 'Loyalty Program',
    description: 'Reward loyal customers with points, referrals, and exclusive benefits.',
    icon: '⭐',
    href: '/dashboard',
  },
  {
    name: 'AI Recommendations',
    description: 'Personalized wine recommendations based on preferences and ratings.',
    icon: '🤖',
    href: '/dashboard',
  },
];

export const testimonials = [
  {
    name: 'Sarah Martinez',
    role: 'Wine Enthusiast',
    avatarSrc: avatarPlaceholder,
    socialUrl: 'https://twitter.com/sarahmartinez',
    quote: "I love discovering new wines through my subscription. The personalized recommendations are spot-on every time!",
  },
  {
    name: 'Michael Chen',
    role: 'Wine Collector',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'The quality of wines and the convenience of delivery make this service exceptional.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Wine Enthusiast',
    avatarSrc: avatarPlaceholder,
    socialUrl: '#',
    quote: 'I love discovering new wines through my subscription. The personalized recommendations are spot-on every time!',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'How do I get started with my wine subscription?',
    answer: 'Simply sign up and choose your preferred subscription plan. We\'ll guide you through the process step by step.',
    href: '/dashboard',
  },
  {
    id: 2,
    question: 'What types of wines do you offer?',
    answer: 'We focus on premium French wines from renowned regions, carefully curated by expert sommeliers.',
    href: '/dashboard',
  },
  {
    id: 3,
    question: 'Can I customize my subscription?',
    answer: 'Yes! You can choose from different subscription tiers and customize your preferences.',
    href: '/dashboard',
  },
  {
    id: 4,
    question: 'How does shipping work?',
    answer: 'We offer secure shipping with tracking to ensure your wines arrive safely and on time.',
    href: '/dashboard',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Account', href: '/account' },
    { name: 'Documentation', href: DocsUrl },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};
