import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getCurrentLanguage, 
  changeLanguage, 
  getLanguageFlag, 
  getLanguageLabel,
  type SupportedLanguage 
} from '../i18n/config';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'navbar' | 'dropdown' | 'inline';
  showLabels?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'navbar',
  showLabels = true 
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage = getCurrentLanguage();
  
  const languages: SupportedLanguage[] = ['en-US', 'fr-FR'];
  
  // Handle language change
  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage || isChanging) return;
    
    setIsChanging(true);
    try {
      await changeLanguage(language);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inline variant (simple toggle)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {languages.map((language) => (
          <button
            key={language}
            onClick={() => handleLanguageChange(language)}
            disabled={isChanging}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              language === currentLanguage 
                ? 'bg-wine-600 text-white dark:bg-wine-500' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-pressed={language === currentLanguage}
            aria-label={language === 'en-US' 
              ? t('accessibility.changeLanguageToEnglish')
              : t('accessibility.changeLanguageToFrench')
            }
          >
            <span className="text-lg" role="img" aria-hidden="true">
              {getLanguageFlag(language)}
            </span>
            {showLabels && (
              <span className="hidden sm:inline">
                {getLanguageLabel(language)}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
          isChanging ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('accessibility.changeLanguage')}
      >
        <span className="text-lg" role="img" aria-hidden="true">
          {getLanguageFlag(currentLanguage)}
        </span>
        {showLabels && (
          <span className="hidden sm:inline">
            {getLanguageLabel(currentLanguage)}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageChange(language)}
              disabled={isChanging || language === currentLanguage}
              className={`flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 w-full text-left ${
                language === currentLanguage 
                  ? 'bg-wine-50 dark:bg-wine-900/20 text-wine-700 dark:text-wine-300' 
                  : ''
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {getLanguageFlag(language)}
              </span>
              <span className="flex-1">
                {getLanguageLabel(language)}
              </span>
              {language === currentLanguage && (
                <svg
                  className="w-4 h-4 text-wine-600 dark:text-wine-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 