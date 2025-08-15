// GDPR and CNIL compliance utilities for French data protection
// Compliant with RGPD (GDPR) and CNIL guidelines

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'analytics' | 'marketing' | 'necessary' | 'preferences';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  consentVersion: string;
  source: 'banner' | 'settings' | 'registration';
}

export interface DataSubjectRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  objection: boolean;
  restriction: boolean;
}

export const CONSENT_VERSION = '1.0.0';

export const CONSENT_TYPES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences'
} as const;

export function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getConsentBannerText(): Record<string, any> {
  return {
    fr: {
      title: 'Respect de votre vie privée',
      message: 'Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", vous consentez à l\'utilisation de ces technologies.',
      accept: 'Accepter tout',
      reject: 'Refuser tout',
      customize: 'Personnaliser',
      necessary: 'Nécessaires',
      analytics: 'Analytics',
      marketing: 'Marketing',
      preferences: 'Préférences'
    },
    en: {
      title: 'Privacy Notice',
      message: 'We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content. By clicking "Accept", you consent to the use of these technologies.',
      accept: 'Accept All',
      reject: 'Reject All',
      customize: 'Customize',
      necessary: 'Necessary',
      analytics: 'Analytics',
      marketing: 'Marketing',
      preferences: 'Preferences'
    }
  };
}

export function getPrivacyPolicyContent(): string {
  return `
# Politique de Confidentialité - WineClub Pro

## 1. Responsable du traitement
WineClub Pro
Adresse: [Adresse complète]
Email: privacy@wineclubpro.fr
SIRET: [Numéro SIRET]

## 2. Finalités du traitement
- Gestion des comptes utilisateurs
- Traitement des commandes et abonnements
- Communication marketing (avec consentement)
- Analyse et amélioration du service
- Conformité légale

## 3. Base légale
- Exécution du contrat (art. 6.1.b RGPD)
- Intérêt légitime (art. 6.1.f RGPD)
- Consentement (art. 6.1.a RGPD)

## 4. Destinataires
- Prestataires de services (hébergement, paiement)
- Autorités compétentes (si requis par la loi)

## 5. Durée de conservation
- Données de compte: 3 ans après dernière activité
- Données de facturation: 10 ans (obligation légale)
- Données de consentement: 5 ans

## 6. Vos droits
- Accès, rectification, effacement
- Portabilité des données
- Opposition au traitement
- Retrait du consentement

## 7. Contact DPO
Email: dpo@wineclubpro.fr
Adresse: [Adresse DPO]

## 8. Autorité de contrôle
CNIL - www.cnil.fr
  `;
}

export function getCookiePolicyContent(): string {
  return `
# Politique des Cookies - WineClub Pro

## Cookies techniques (nécessaires)
- Session utilisateur
- Préférences de langue
- Sécurité et authentification

## Cookies analytics
- Google Analytics (avec consentement)
- Mesure d'audience
- Analyse des performances

## Cookies marketing
- Publicité ciblée (avec consentement)
- Réseaux sociaux
- Email marketing

## Gestion des cookies
Vous pouvez modifier vos préférences à tout moment dans les paramètres de votre compte.
  `;
}

export function validateFrenchAddress(address: {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}): boolean {
  // Basic validation for French addresses
  const frenchPostalCodeRegex = /^[0-9]{5}$/;
  const isFrenchAddress = address.country === 'FR' || address.country === 'France';
  
  return isFrenchAddress && 
         frenchPostalCodeRegex.test(address.postalCode) &&
         address.street.length > 0 &&
         address.city.length > 0;
}

export function anonymizeEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;
  
  const anonymizedLocal = localPart.charAt(0) + 
                         '*'.repeat(localPart.length - 2) + 
                         localPart.charAt(localPart.length - 1);
  
  return `${anonymizedLocal}@${domain}`;
}

export function getDataRetentionPolicy(): Record<string, number> {
  return {
    userAccount: 3 * 365 * 24 * 60 * 60 * 1000, // 3 years
    billingData: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
    consentRecords: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
    analyticsData: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    marketingData: 3 * 365 * 24 * 60 * 60 * 1000, // 3 years
    sessionData: 24 * 60 * 60 * 1000, // 24 hours
  };
}

export function createConsentRecord(data: {
  userId: string;
  consentType: ConsentRecord['consentType'];
  granted: boolean;
  ipAddress: string;
  userAgent: string;
  source: ConsentRecord['source'];
}): ConsentRecord {
  return {
    id: generateConsentId(),
    userId: data.userId,
    consentType: data.consentType,
    granted: data.granted,
    timestamp: new Date(),
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    consentVersion: CONSENT_VERSION,
    source: data.source
  };
} 