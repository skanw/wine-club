import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  className?: string;
}

// Theme persistence utilities
export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  } catch (error) {
    console.warn('Failed to read theme preference:', error);
    return 'light';
  }
};

export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
};

export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const themeColors = {
      light: '#D9C6A0', // Champagne theme
      dark: '#5A1E1B'   // Bordeaux theme
    };
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [activeTheme, setActiveTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    const theme = getStoredTheme();
    setActiveTheme(theme);
    applyTheme(theme);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = activeTheme === 'light' ? 'dark' : 'light';
    setActiveTheme(newTheme);
    applyTheme(newTheme);
    setStoredTheme(newTheme);
    
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  };

  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-champagne-500 focus:ring-offset-2 ${
        activeTheme === 'dark' 
          ? 'bg-bordeaux-600 hover:bg-bordeaux-700' 
          : 'bg-champagne-300 hover:bg-champagne-400'
      } ${className}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={activeTheme === 'dark'}
      aria-label="Toggle red-wine (dark) / white-wine (light) theme"
      title={`Currently ${activeTheme === 'light' ? 'white-wine (light)' : 'red-wine (dark)'} theme. Click to switch.`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          activeTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {activeTheme === 'light' ? (
            <SunIcon className="h-3 w-3 text-champagne-600" />
          ) : (
            <MoonIcon className="h-3 w-3 text-bordeaux-600" />
          )}
        </span>
      </span>
      <span className="sr-only">
        {activeTheme === 'light' ? 'White-wine (light) theme active' : 'Red-wine (dark) theme active'}
      </span>
    </button>
  );
};

export default ThemeToggle; 