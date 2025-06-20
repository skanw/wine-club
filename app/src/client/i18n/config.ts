import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🌍 Wine Club Internationalization Configuration

// Language Resources - imported as ES Modules so they work in the browser
import enUS from './locales/en-US.json';
import frFR from './locales/fr-FR.json';

export type SupportedLanguage = 'en-US' | 'fr-FR';
export type LanguageCode = 'en' | 'fr';

// Language mapping for clean URLs and detection
const languageMap: Record<string, SupportedLanguage> = {
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-US',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'fr-CA': 'fr-FR',
};

// 🍷 Custom Language Persistence Utilities
export const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en-US';
  
  try {
    // 1. Try localStorage first
    const stored = localStorage.getItem('i18nextLng') as SupportedLanguage | null;
    if (stored && isValidLanguage(stored)) {
      return stored;
    }
    
    // 2. Fallback to cookie
    const cookieLanguage = getCookieLanguage();
    if (cookieLanguage) return cookieLanguage;
    
    // 3. Browser language detection
    const browserLanguage = navigator.language || 'en-US';
    const mappedLanguage = languageMap[browserLanguage] || languageMap[browserLanguage.split('-')[0]];
    if (mappedLanguage) return mappedLanguage;
    
    // 4. Default fallback
    return 'en-US';
  } catch (error) {
    console.warn('Failed to read language preference:', error);
    return 'en-US';
  }
};

export const setStoredLanguage = (language: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('i18nextLng', language);
    // Also set cookie as fallback
    setCookieLanguage(language);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
    // Fallback to cookie only
    setCookieLanguage(language);
  }
};

const isValidLanguage = (lang: string): lang is SupportedLanguage => {
  return ['en-US', 'fr-FR'].includes(lang);
};

const getCookieLanguage = (): SupportedLanguage | null => {
  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(cookie => cookie.trim().startsWith('i18nextLng='));
  if (langCookie) {
    const value = langCookie.split('=')[1] as SupportedLanguage;
    return isValidLanguage(value) ? value : null;
  }
  return null;
};

const setCookieLanguage = (language: SupportedLanguage): void => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
  document.cookie = `i18nextLng=${language}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

// 🎯 Language Change Handler
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    setStoredLanguage(language);
    
    // Update document language attribute
    document.documentElement.lang = language;
    
    // Update meta tags for SEO
    const metaLanguage = document.querySelector('meta[name="language"]');
    if (metaLanguage) {
      metaLanguage.setAttribute('content', language);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'language';
      newMeta.content = language;
      document.head.appendChild(newMeta);
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChange', { 
      detail: { language, previousLanguage: i18n.language } 
    }));
    
    console.log(`🌍 Language changed to: ${language}`);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

// 🚀 i18n Configuration
i18n
  // Language detection
  .use(LanguageDetector)
  // React integration
  .use(initReactI18next)
  // Initialize
  .init({
    // Language resources
    resources: {
      'en-US': {
        translation: enUS
      },
      'fr-FR': {
        translation: frFR
      }
    },
    
    // Language settings
    fallbackLng: 'en-US',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection configuration
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // Don't cache in CI mode
    },
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes
      format: (value, format) => {
        // Custom formatters
        if (format === 'currency') {
          const locale = i18n.language === 'fr-FR' ? 'fr-FR' : 'en-US';
          const currency = i18n.language === 'fr-FR' ? 'EUR' : 'USD';
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
          }).format(value);
        }
        if (format === 'date') {
          const locale = i18n.language === 'fr-FR' ? 'fr-FR' : 'en-US';
          return new Intl.DateTimeFormat(locale).format(new Date(value));
        }
        if (format === 'number') {
          const locale = i18n.language === 'fr-FR' ? 'fr-FR' : 'en-US';
          return new Intl.NumberFormat(locale).format(value);
        }
        return value;
      }
    },
    
    // Namespace settings
    defaultNS: 'translation',
    keySeparator: '.',
    nsSeparator: ':',
    
    // React-specific settings
    react: {
      useSuspense: false, // Avoid Suspense for SSR compatibility
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },
  });

// 🔧 Initialize language on app start
export const initializeLanguage = (): void => {
  const savedLanguage = getStoredLanguage();
  
  if (i18n.language !== savedLanguage) {
    changeLanguage(savedLanguage);
  }
  
  // Set document language
  document.documentElement.lang = savedLanguage;
};

// 🎭 Helper Functions
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage || 'en-US';
};

export const getLanguageCode = (language?: SupportedLanguage): LanguageCode => {
  const lang = language || getCurrentLanguage();
  return lang.split('-')[0] as LanguageCode;
};

export const getLanguageLabel = (language: SupportedLanguage): string => {
  const labels = {
    'en-US': 'English',
    'fr-FR': 'Français'
  };
  return labels[language];
};

export const getLanguageFlag = (language: SupportedLanguage): string => {
  const flags = {
    'en-US': '🇺🇸',
    'fr-FR': '🇫🇷'
  };
  return flags[language];
};

// 🌐 Export configured i18n instance
export default i18n; 