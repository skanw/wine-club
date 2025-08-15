import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      'fr-FR': {
        translation: {
          // Navigation
          'nav.home': 'Accueil',
          'nav.discover': 'Découvrir',
          'nav.dashboard': 'Tableau de bord',
          'nav.subscriptions': 'Mes Abonnements',
          'nav.wineCave': 'Ma Cave à Vin',
          'nav.account': 'Mon Compte',
          'nav.pricing': 'Tarifs',
          'nav.about': 'À propos',
          'nav.contact': 'Contact',
          'nav.login': 'Connexion',
          'nav.signup': 'Inscription',

          // Common
          'common.loading': 'Chargement...',
          'common.error': 'Erreur',
          'common.success': 'Succès',
          'common.save': 'Enregistrer',
          'common.cancel': 'Annuler',
          'common.edit': 'Modifier',
          'common.delete': 'Supprimer',
          'common.add': 'Ajouter',
          'common.search': 'Rechercher',
          'common.filter': 'Filtrer',
          'common.sort': 'Trier',
          'common.view': 'Voir',
          'common.back': 'Retour',
          'common.next': 'Suivant',
          'common.previous': 'Précédent',
          'common.submit': 'Soumettre',
          'common.confirm': 'Confirmer',
          'common.yes': 'Oui',
          'common.no': 'Non',

          // Pricing
          'pricing.monthly': 'par mois',
          'pricing.yearly': 'par an',
          'pricing.vatIncluded': 'TTC',
          'pricing.vatExcluded': 'HT',
          'pricing.startingFrom': 'À partir de',
          'pricing.bottlesPerMonth': 'bouteilles/mois',
          'pricing.subscribe': 'S\'abonner',
          'pricing.currentPlan': 'Plan actuel',

          // Wine Cave
          'wineCave.create': 'Créer ma cave à vin',
          'wineCave.manage': 'Gérer ma cave',
          'wineCave.subscribers': 'Abonnés',
          'wineCave.revenue': 'Revenus',
          'wineCave.wines': 'Vins',
          'wineCave.addWine': 'Ajouter un vin',
          'wineCave.addTier': 'Ajouter un forfait',
          'wineCave.editProfile': 'Modifier le profil',
          'wineCave.location': 'Localisation',
          'wineCave.website': 'Site web',
          'wineCave.contact': 'Contact',

          // Subscriptions
          'subscription.active': 'Actif',
          'subscription.cancelled': 'Annulé',
          'subscription.paused': 'En pause',
          'subscription.nextShipment': 'Prochain envoi',
          'subscription.cancel': 'Annuler l\'abonnement',
          'subscription.pause': 'Mettre en pause',
          'subscription.resume': 'Reprendre',
          'subscription.changePlan': 'Changer de forfait',

          // Wine
          'wine.name': 'Nom du vin',
          'wine.varietal': 'Cépage',
          'wine.vintage': 'Millésime',
          'wine.description': 'Description',
          'wine.price': 'Prix',
          'wine.stock': 'Stock',
          'wine.rating': 'Note',
          'wine.reviews': 'Avis',

          // Forms
          'form.required': 'Champ obligatoire',
          'form.invalidEmail': 'Email invalide',
          'form.passwordTooShort': 'Mot de passe trop court',
          'form.passwordsDoNotMatch': 'Les mots de passe ne correspondent pas',
          'form.invalidPhone': 'Numéro de téléphone invalide',
          'form.invalidPostalCode': 'Code postal invalide',

          // Messages
          'message.success': 'Opération réussie',
          'message.error': 'Une erreur est survenue',
          'message.warning': 'Attention',
          'message.info': 'Information',
          'message.confirmDelete': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
          'message.unsavedChanges': 'Vous avez des modifications non sauvegardées',

          // Dates
          'date.today': 'Aujourd\'hui',
          'date.yesterday': 'Hier',
          'date.tomorrow': 'Demain',
          'date.thisWeek': 'Cette semaine',
          'date.lastWeek': 'La semaine dernière',
          'date.thisMonth': 'Ce mois',
          'date.lastMonth': 'Le mois dernier',

          // Currency
          'currency.eur': 'EUR',
          'currency.usd': 'USD',
          'currency.format': '{amount} €',

          // Legal
          'legal.privacyPolicy': 'Politique de confidentialité',
          'legal.termsOfService': 'Conditions d\'utilisation',
          'legal.cookiePolicy': 'Politique des cookies',
          'legal.gdpr': 'RGPD',
          'legal.contact': 'Nous contacter',
        }
      },
      'en-US': {
        translation: {
          // Navigation
          'nav.home': 'Home',
          'nav.discover': 'Discover',
          'nav.dashboard': 'Dashboard',
          'nav.subscriptions': 'My Subscriptions',
          'nav.wineCave': 'My Wine Cave',
          'nav.account': 'My Account',
          'nav.pricing': 'Pricing',
          'nav.about': 'About',
          'nav.contact': 'Contact',
          'nav.login': 'Login',
          'nav.signup': 'Sign Up',

          // Common
          'common.loading': 'Loading...',
          'common.error': 'Error',
          'common.success': 'Success',
          'common.save': 'Save',
          'common.cancel': 'Cancel',
          'common.edit': 'Edit',
          'common.delete': 'Delete',
          'common.add': 'Add',
          'common.search': 'Search',
          'common.filter': 'Filter',
          'common.sort': 'Sort',
          'common.view': 'View',
          'common.back': 'Back',
          'common.next': 'Next',
          'common.previous': 'Previous',
          'common.submit': 'Submit',
          'common.confirm': 'Confirm',
          'common.yes': 'Yes',
          'common.no': 'No',

          // Pricing
          'pricing.monthly': 'per month',
          'pricing.yearly': 'per year',
          'pricing.vatIncluded': 'VAT included',
          'pricing.vatExcluded': 'VAT excluded',
          'pricing.startingFrom': 'Starting from',
          'pricing.bottlesPerMonth': 'bottles/month',
          'pricing.subscribe': 'Subscribe',
          'pricing.currentPlan': 'Current plan',

          // Wine Cave
          'wineCave.create': 'Create my wine cave',
          'wineCave.manage': 'Manage my cave',
          'wineCave.subscribers': 'Subscribers',
          'wineCave.revenue': 'Revenue',
          'wineCave.wines': 'Wines',
          'wineCave.addWine': 'Add wine',
          'wineCave.addTier': 'Add tier',
          'wineCave.editProfile': 'Edit profile',
          'wineCave.location': 'Location',
          'wineCave.website': 'Website',
          'wineCave.contact': 'Contact',

          // Subscriptions
          'subscription.active': 'Active',
          'subscription.cancelled': 'Cancelled',
          'subscription.paused': 'Paused',
          'subscription.nextShipment': 'Next shipment',
          'subscription.cancel': 'Cancel subscription',
          'subscription.pause': 'Pause',
          'subscription.resume': 'Resume',
          'subscription.changePlan': 'Change plan',

          // Wine
          'wine.name': 'Wine name',
          'wine.varietal': 'Varietal',
          'wine.vintage': 'Vintage',
          'wine.description': 'Description',
          'wine.price': 'Price',
          'wine.stock': 'Stock',
          'wine.rating': 'Rating',
          'wine.reviews': 'Reviews',

          // Forms
          'form.required': 'Required field',
          'form.invalidEmail': 'Invalid email',
          'form.passwordTooShort': 'Password too short',
          'form.passwordsDoNotMatch': 'Passwords do not match',
          'form.invalidPhone': 'Invalid phone number',
          'form.invalidPostalCode': 'Invalid postal code',

          // Messages
          'message.success': 'Operation successful',
          'message.error': 'An error occurred',
          'message.warning': 'Warning',
          'message.info': 'Information',
          'message.confirmDelete': 'Are you sure you want to delete this item?',
          'message.unsavedChanges': 'You have unsaved changes',

          // Dates
          'date.today': 'Today',
          'date.yesterday': 'Yesterday',
          'date.tomorrow': 'Tomorrow',
          'date.thisWeek': 'This week',
          'date.lastWeek': 'Last week',
          'date.thisMonth': 'This month',
          'date.lastMonth': 'Last month',

          // Currency
          'currency.eur': 'EUR',
          'currency.usd': 'USD',
          'currency.format': '€{amount}',

          // Legal
          'legal.privacyPolicy': 'Privacy Policy',
          'legal.termsOfService': 'Terms of Service',
          'legal.cookiePolicy': 'Cookie Policy',
          'legal.gdpr': 'GDPR',
          'legal.contact': 'Contact Us',
        }
      }
    },
    lng: 'fr-FR', // default language
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n; 