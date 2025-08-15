import i18n, { 
  getStoredLanguage, 
  setStoredLanguage, 
  changeLanguage,
  getCurrentLanguage,
  getLanguageCode,
  getLanguageLabel,
  getLanguageFlag,
  type SupportedLanguage 
} from '../config';

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock document for cookie testing
const documentMock = {
  cookie: '',
  createElement: jest.fn(() => ({ 
    name: '', 
    content: '', 
    setAttribute: jest.fn() 
  })),
  head: { appendChild: jest.fn() },
  documentElement: { lang: 'en-US' },
  querySelector: jest.fn(() => ({ setAttribute: jest.fn() })),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(global, 'document', {
  value: documentMock,
});

// Mock window for browser testing
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
});

describe('🌍 Wine Club i18n Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    documentMock.cookie = '';
  });

  describe('Language Storage & Retrieval', () => {
    test('should return default language when no stored preference', () => {
      const language = getStoredLanguage();
      expect(language).toBe('en-US');
    });

    test('should return stored language from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('fr-FR');
      const language = getStoredLanguage();
      expect(language).toBe('fr-FR');
    });

    test('should fallback to cookie when localStorage fails', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      documentMock.cookie = 'i18nextLng=fr-FR';
      
      const language = getStoredLanguage();
      expect(language).toBe('fr-FR');
    });

    test('should set language in localStorage and cookie', () => {
      setStoredLanguage('fr-FR');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'fr-FR');
      expect(documentMock.cookie).toContain('i18nextLng=fr-FR');
    });

    test('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });
      
      expect(() => setStoredLanguage('fr-FR')).not.toThrow();
      expect(documentMock.cookie).toContain('i18nextLng=fr-FR');
    });
  });

  describe('Language Change Functionality', () => {
    test('should change language and update document attributes', async () => {
      await changeLanguage('fr-FR');
      
      expect(i18n.language).toBe('fr-FR');
      expect(documentMock.documentElement.lang).toBe('fr-FR');
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'languageChange',
          detail: expect.objectContaining({
            language: 'fr-FR'
          })
        })
      );
    });

    test('should update meta tags for SEO', async () => {
      const mockMeta = { setAttribute: jest.fn() };
      documentMock.querySelector.mockReturnValue(mockMeta);
      
      await changeLanguage('fr-FR');
      
      expect(mockMeta.setAttribute).toHaveBeenCalledWith('content', 'fr-FR');
    });

    test('should create meta tag if none exists', async () => {
      documentMock.querySelector.mockReturnValue(null);
      const mockMeta = { name: '', content: '' };
      documentMock.createElement.mockReturnValue(mockMeta);
      
      await changeLanguage('fr-FR');
      
      expect(documentMock.createElement).toHaveBeenCalledWith('meta');
      expect(mockMeta.name).toBe('language');
      expect(mockMeta.content).toBe('fr-FR');
      expect(documentMock.head.appendChild).toHaveBeenCalledWith(mockMeta);
    });
  });

  describe('Helper Functions', () => {
    test('should get current language', () => {
      i18n.language = 'fr-FR';
      expect(getCurrentLanguage()).toBe('fr-FR');
    });

    test('should extract language code from full language', () => {
      expect(getLanguageCode('en-US')).toBe('en');
      expect(getLanguageCode('fr-FR')).toBe('fr');
    });

    test('should get language labels', () => {
      expect(getLanguageLabel('en-US')).toBe('English');
      expect(getLanguageLabel('fr-FR')).toBe('Français');
    });

    test('should get language flags', () => {
      expect(getLanguageFlag('en-US')).toBe('🇺🇸');
      expect(getLanguageFlag('fr-FR')).toBe('🇫🇷');
    });
  });

  describe('i18n Configuration', () => {
    test('should have correct fallback language', () => {
      expect(i18n.options.fallbackLng).toBe('en-US');
    });

    test('should have correct resource structure', () => {
      expect(i18n.options.resources).toHaveProperty('en-US');
      expect(i18n.options.resources).toHaveProperty('fr-FR');
      expect(i18n.options.resources?.['en-US']).toHaveProperty('translation');
      expect(i18n.options.resources?.['fr-FR']).toHaveProperty('translation');
    });

    test('should have debug mode disabled in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Re-import to get fresh config
      jest.resetModules();
      const { default: prodI18n } = require('../config');
      
      expect(prodI18n.options.debug).toBe(false);
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Translation Keys', () => {
    test('should have all common translation keys', () => {
      const commonKeys = [
        'common.loading',
        'common.error',
        'common.save',
        'common.delete',
        'common.edit'
      ];
      
      commonKeys.forEach(key => {
        expect(i18n.exists(key, { lng: 'en-US' })).toBe(true);
        expect(i18n.exists(key, { lng: 'fr-FR' })).toBe(true);
      });
    });

    test('should have navigation translation keys', () => {
      const navKeys = [
        'navigation.home',
        'navigation.wineCaves',
        'navigation.subscriptions',
        'navigation.login'
      ];
      
      navKeys.forEach(key => {
        expect(i18n.exists(key, { lng: 'en-US' })).toBe(true);
        expect(i18n.exists(key, { lng: 'fr-FR' })).toBe(true);
      });
    });

    test('should have hero section translation keys', () => {
      const heroKeys = [
        'hero.title',
        'hero.subtitle',
        'hero.description',
        'hero.subscribeNow',
        'hero.learnMore'
      ];
      
      heroKeys.forEach(key => {
        expect(i18n.exists(key, { lng: 'en-US' })).toBe(true);
        expect(i18n.exists(key, { lng: 'fr-FR' })).toBe(true);
      });
    });

    test('should have accessibility translation keys', () => {
      const a11yKeys = [
        'accessibility.skipToContent',
        'accessibility.changeLanguage',
        'accessibility.changeLanguageToFrench',
        'accessibility.changeLanguageToEnglish'
      ];
      
      a11yKeys.forEach(key => {
        expect(i18n.exists(key, { lng: 'en-US' })).toBe(true);
        expect(i18n.exists(key, { lng: 'fr-FR' })).toBe(true);
      });
    });
  });

  describe('Interpolation', () => {
    test('should handle variable interpolation', () => {
      const text = i18n.t('subscription.bottlesPerShipment', { count: 3 });
      expect(text).toContain('3');
    });

    test('should format currency correctly', () => {
      i18n.language = 'en-US';
      const formatted = i18n.options.interpolation?.format?.(29.99, 'currency');
      expect(formatted).toContain('$');
      expect(formatted).toContain('29.99');
    });

    test('should format numbers correctly', () => {
      i18n.language = 'fr-FR';
      const formatted = i18n.options.interpolation?.format?.(1234.56, 'number');
      expect(formatted).toBe('1 234,56');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing translation keys gracefully', () => {
      const result = i18n.t('nonexistent.key');
      expect(result).toBe('nonexistent.key'); // Falls back to key
    });

    test('should handle network/loading errors', () => {
      expect(() => {
        i18n.loadLanguages(['invalid-locale']);
      }).not.toThrow();
    });
  });
});

// 🧪 Integration Test for Real Browser Environment
describe('🌐 Browser Integration Tests', () => {
  beforeAll(() => {
    // Reset i18n to initial state
    i18n.changeLanguage('en-US');
  });

  test('should initialize with correct language', async () => {
    // Simulate app startup
    await i18n.init();
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBeDefined();
  });

  test('should persist language changes across sessions', async () => {
    // Change language
    await changeLanguage('fr-FR');
    expect(getCurrentLanguage()).toBe('fr-FR');
    
    // Simulate page reload by getting stored language
    const storedLang = getStoredLanguage();
    expect(storedLang).toBe('fr-FR');
  });

  test('should provide translated text for key components', () => {
    i18n.changeLanguage('en-US');
    expect(i18n.t('hero.title')).toBe('Transform Your Wine Cave into a');
    expect(i18n.t('navigation.login')).toBe('Login');
    
    i18n.changeLanguage('fr-FR');
    expect(i18n.t('hero.title')).toBe('Transformez Votre Cave à Vin en une');
    expect(i18n.t('navigation.login')).toBe('Connexion');
  });
}); 