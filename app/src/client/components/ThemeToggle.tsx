import React, { useState, useEffect } from 'react';

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
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-champagne-500 focus:ring-offset-2
        hover:scale-110 hover:shadow-lg
        min-w-11 min-h-11
        ${activeTheme === 'dark' 
          ? 'bg-bordeaux-600 hover:bg-bordeaux-700 text-champagne-100' 
          : 'bg-champagne-300 hover:bg-champagne-400 text-bordeaux-700'
        } 
        ${className}
      `}
      onClick={toggleTheme}
      role="switch"
      aria-checked={activeTheme === 'dark'}
      aria-label={`Switch to ${activeTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Currently ${activeTheme} theme. Click to switch to ${activeTheme === 'light' ? 'dark' : 'light'} theme.`}
      style={{ minWidth: '44px', minHeight: '44px' }} // HH-03: 44px hit-area
    >
      {/* HH-03: 🌞/🌜 icons */}
      <span className="text-xl transition-transform duration-300 ease-in-out transform hover:scale-110">
        {activeTheme === 'light' ? '🌞' : '🌜'}
      </span>
      
      <span className="sr-only">
        {activeTheme === 'light' ? 'Light theme active. Click to switch to dark theme.' : 'Dark theme active. Click to switch to light theme.'}
      </span>
    </button>
  );
};

export default ThemeToggle; 