import { Users, Mail, Package, BarChart3 } from 'lucide-react';
import FeatureSection from './FeatureSection';

export default function FeaturesSections() {
  return (
    <div id="features" className='bg-background'>
      {/* Gestion des Membres */}
      <FeatureSection
        title='Gestion des Membres'
        subtitle='Base de données unifiée - Conformité RGPD intégrée'
        description="Fini les carnets papier et les fichiers Excel éparpillés. Capturez les informations de vos clients en 10 secondes depuis votre smartphone, directement en caisse. Une seule base de données centralisée pour tous vos contacts. Conformité RGPD garantie - vous êtes protégé contre les amendes."
        benefits={[
          'Ajout de membre en moins de 10 secondes depuis votre mobile',
          'Base de données centralisée accessible partout',
          'Tags et préférences pour segmenter vos clients (régions, types de vin)',
          'Conformité RGPD intégrée : double opt-in, gestion des consentements, droit à l\'oubli',
          'Recherche instantanée pour retrouver n\'importe quel client',
          'Fonctionne avec votre POS existant - pas de migration nécessaire',
        ]}
        icon={<Users className='h-24 w-24 md:h-32 md:w-32' />}
        direction='left'
        className='bg-gradient-to-b from-background to-muted/30'
      />

      {/* Campagnes Marketing */}
      <FeatureSection
        title='Campagnes Marketing'
        subtitle='3 clics, 30 secondes (vs 20+ clics, 15 minutes avec Brevo)'
        description="Réduisez le temps d'envoi d'une campagne de 30 minutes à 30 secondes. Annoncez vos nouvelles arrivées instantanément par SMS ou email depuis votre entrepôt. Plus besoin d'être devant un ordinateur. Fonctionne avec votre POS existant - aucun changement nécessaire."
        benefits={[
          '3 clics, 30 secondes : Photo → Audience → Envoi (vs 20+ clics avec Brevo)',
          'Daily Drop : depuis votre smartphone, même dans la cave',
          'SMS et emails automatiques pour vos nouveautés',
          'Ciblage intelligent par tags ou préférences',
          'Respect automatique des consentements RGPD',
          'Templates pré-validés conformes Loi Evin',
        ]}
        icon={<Mail className='h-24 w-24 md:h-32 md:w-32' />}
        direction='right'
        className='bg-muted/30'
      />

      {/* Abonnements */}
      <FeatureSection
        title='Abonnements'
        subtitle='Revenus récurrents automatisés - Sans engagement'
        description="Transformez vos clients ponctuels en abonnés fidèles. Gérez vos box de vin mensuelles sans stress : prélèvements automatiques, listes de préparation générées automatiquement, suivi des statuts. Fini les tableurs Excel et les appels téléphoniques. Abonnements 'Sans engagement' - vos clients peuvent annuler en un clic."
        benefits={[
          'Prélèvements automatiques via Stripe chaque mois',
          'Génération automatique des listes de préparation (PDF mobile-friendly)',
          'Suivi en temps réel : emballé, expédié, prêt à récupérer',
          'Gestion des pauses et annulations en un clic (Sans engagement)',
          'Gestion automatique des échecs de paiement (email/SMS poli)',
          'Revenus récurrents prévisibles pour votre cave (couvre le loyer pendant les mois creux)',
        ]}
        icon={<Package className='h-24 w-24 md:h-32 md:w-32' />}
        direction='left'
        className='bg-gradient-to-b from-muted/30 to-background'
      />

      {/* Statistiques */}
      <FeatureSection
        title='Statistiques'
        subtitle='Mesurez votre croissance'
        description="Suivez l'impact réel de vos campagnes en temps réel. Découvrez quels messages convertissent le mieux, quels clients sont les plus actifs, et mesurez votre retour sur investissement. Des données claires pour prendre les bonnes décisions."
        benefits={[
          'Taux d\'ouverture et de clic en temps réel',
          'Performance de chaque campagne (SMS vs Email)',
          'Suivi des revenus générés par vos campagnes',
          'Statistiques sur vos membres et abonnements',
          'Tableaux de bord simples et compréhensibles',
        ]}
        icon={<BarChart3 className='h-24 w-24 md:h-32 md:w-32' />}
        direction='right'
        className='bg-background'
      />
    </div>
  );
}

