import type { GridFeature } from './components/FeaturesGrid';

export const features: GridFeature[] = [
  {
    name: 'Liste VIP, Monétisée',
    description: 'Transformez votre carnet de clients en machine à revenus',
    emoji: '👥',
    href: '#',
    size: 'small',
  },
  {
    name: 'Campagnes Marketing',
    description: 'Plus rapide que de mettre une bouteille sur l\'étagère',
    emoji: '📧',
    href: '#',
    size: 'small',
  },
  {
    name: 'Abonnements',
    description: 'Rendez votre loyer "ennuyeux" pendant les mois creux',
    emoji: '📦',
    href: '#',
    size: 'medium',
  },
  {
    name: 'Statistiques',
    description: 'Suivez vos performances de campagne en temps réel',
    emoji: '📈',
    href: '#',
    size: 'large',
  },
];

export const testimonials = [
  {
    name: 'Propriétaire',
    role: 'Cave du Vieux Port',
    socialUrl: '#',
    quote: 'VinClub a ajouté +€4 000/mois en revenus récurrents en 60 jours. Mon loyer est maintenant couvert par les abonnements même pendant les mois creux. Je dors mieux. Et je n\'ai pas eu à changer ma caisse !',
  },
  {
    name: 'Gérant',
    role: 'La Cave des Saveurs',
    socialUrl: '#',
    quote: 'Fini les pallets qui traînent dans le couloir ! Maintenant je vends avant même de finir de déballer. 30 secondes depuis mon téléphone, même dans la cave. Mes clients adorent.',
  },
  {
    name: 'Marie Leclerc',
    role: 'Propriétaire, Cave des Lilas',
    socialUrl: '#',
    quote: 'Gérer les abonnements de box est maintenant un jeu d\'enfant. Les prélèvements automatiques m\'ont fait gagner des heures chaque mois. Plus jamais d\'appels téléphoniques gênants.',
  },
  {
    name: 'Jean Martin',
    role: 'Caviste indépendant',
    socialUrl: '#',
    quote: 'Enfin je peux concurrencer Le Petit Ballon sur leur terrain : les abonnements. Mais je garde mon avantage : la relation physique. Mes clients peuvent venir goûter, discuter, choisir. C\'est ça qui fait la différence.',
  },
  {
    name: 'Sophie Bernard',
    role: 'Gérante, La Cave du Quartier',
    socialUrl: '#',
    quote: 'La conformité RGPD me terrifiait. Avec VinClub, je dors mieux. Tout est géré automatiquement, et je suis protégée contre les amendes. C\'est rassurant.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'Dois-je remplacer mon système de caisse pour utiliser VinClub ?',
    answer: 'Non ! C\'est exactement l\'avantage de VinClub. Aucune intégration technique requise. Vous exportez simplement votre liste de clients en CSV depuis Excel ou votre carnet, puis vous la glissez-déposez dans VinClub. Vos données financières restent dans votre POS. VinClub est une couche de revenus autonome et sécurisée.',
    href: '#',
  },
  {
    id: 2,
    question: 'Comment fonctionnent les campagnes VinClub ?',
    answer: 'Plus rapide que de mettre une bouteille sur l\'étagère. Vous glissez-déposez votre CSV de clients (une seule fois), puis pour chaque nouvelle arrivée : vous prenez une photo avec votre smartphone, sélectionnez votre audience (par tags ou "Tous les membres"), et cliquez sur "Envoyer". C\'est tout ! Le vin est vendu avant même que vous finissiez de déballer le pallet. Aucune connexion à votre POS nécessaire.',
    href: '#',
  },
  {
    id: 3,
    question: 'Comment VinClub gère-t-il la conformité RGPD et la Loi Evin ?',
    answer: 'VinClub est votre police d\'assurance la moins chère. Un SMS à la mauvaise personne peut coûter €20,000 en amendes CNIL. Un post Instagram "Party Time!" peut déclencher une violation Loi Evin. Avec VinClub, c\'est impossible. Nous nous occupons des réglementations pour que vous puissiez vous concentrer sur le vin. C\'est une assurance, pas juste une fonctionnalité.',
    href: '#',
  },
  {
    id: 4,
    question: 'Les abonnements sont-ils "Sans engagement" ?',
    answer: 'Oui ! Vos clients peuvent annuler ou mettre en pause leur abonnement en un clic, sans engagement. Cela réduit la peur de s\'engager et augmente les inscriptions. C\'est conforme à la Loi Hamon et c\'est meilleur pour votre business.',
    href: '#',
  },
  {
    id: 5,
    question: 'Comment VinClub se compare-t-il à Le Petit Ballon ?',
    answer: 'Le Petit Ballon est un e-commerce pur. Vous avez un avantage qu\'ils n\'ont pas : la relation physique avec vos clients. VinClub vous donne la technologie pour concurrencer leur logistique, tout en préservant votre avantage relationnel. Vous pouvez offrir des dégustations, des conseils personnalisés, et un service de proximité qu\'ils ne peuvent pas égaler.',
    href: '#',
  },
  {
    id: 6,
    question: 'Puis-je envoyer des SMS et emails à mes clients ?',
    answer: 'Oui ! VinClub vous permet d\'envoyer des campagnes marketing via SMS (via Twilio) et email (via Brevo) directement depuis la plateforme. Le système respecte automatiquement les consentements RGPD et gère les désabonnements.',
    href: '#',
  },
  {
    id: 7,
    question: 'Comment fonctionnent les prélèvements automatiques pour les abonnements ?',
    answer: 'VinClub utilise Stripe Connect pour gérer les prélèvements automatiques chaque mois. Si un paiement échoue, le système envoie automatiquement un email/SMS poli au client pour mettre à jour sa carte. Plus jamais d\'appels téléphoniques gênants !',
    href: '#',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Fonctionnalités', href: '#solution' },
    { name: 'Calculateur de Revenus', href: '/calculateur' },
    { name: 'Tarifs', href: '/pricing' },
  ],
  company: [
    { name: 'À propos', href: '#' },
    { name: 'Confidentialité', href: '#' },
    { name: 'Conditions d\'utilisation', href: '#' },
  ],
};

// Examples carousel removed - using feature cards in Hero instead
