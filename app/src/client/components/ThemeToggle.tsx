import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  className?: string;
}

// Theme persistence utilities
export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    // Try localStorage first
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default theme
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
  
  // Remove existing theme classes
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  // Apply new theme to html element
  document.documentElement.classList.add(`theme-${theme}`);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const themeColors = {
      light: '#F3E9D2', // White wine theme
      dark: '#5A1E1B'   // Red wine theme
    };
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [activeTheme, setActiveTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    // Apply theme immediately on mount (before any render)
    const theme = getStoredTheme();
    setActiveTheme(theme);
    applyTheme(theme);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = activeTheme === 'light' ? 'dark' : 'light';
    setActiveTheme(newTheme);
    applyTheme(newTheme);
    setStoredTheme(newTheme);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  };

  return (
    <div className={`theme-toggle-wrapper ${className}`}>
      <button
        className="theme-toggle-switch"
        onClick={toggleTheme}
        role="switch"
        aria-checked={activeTheme === 'dark'}
        aria-label={`Switch to ${activeTheme === 'light' ? 'Red Wine (Dark)' : 'White Wine (Light)'} theme`}
        title={`Currently ${activeTheme === 'light' ? 'White Wine' : 'Red Wine'} theme. Click to switch.`}
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-track-label left">
            🤍 White
          </span>
          <span className="theme-toggle-track-label right">
            ❤️ Red
          </span>
        </span>
        <span 
          className={`theme-toggle-thumb ${activeTheme === 'dark' ? 'active' : ''}`}
          aria-hidden="true"
        >
          <span className="theme-toggle-thumb-icon">
            {activeTheme === 'light' ? (
              // White wine glass icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1046 22 14 21.1046 14 20V16H10V20C10 21.1046 10.8954 22 12 22Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 2C8 2 8 8 12 11C16 8 16 2 16 2H8Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <ellipse cx="12" cy="6" rx="3" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="11.5" y="11" width="1" height="5" fill="currentColor"/>
              </svg>
            ) : (
              // Red wine glass icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1046 22 14 21.1046 14 20V16H10V20C10 21.1046 10.8954 22 12 22Z" fill="currentColor"/>
                <path d="M13 16V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V16H13Z" fill="currentColor" opacity="0.7"/>
                <path d="M8 2C8 2 8 8 12 11C16 8 16 2 16 2H8Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <ellipse cx="12" cy="6" rx="3" ry="2" fill="currentColor" opacity="0.8"/>
                <rect x="11.5" y="11" width="1" height="5" fill="currentColor"/>
              </svg>
            )}
          </span>
        </span>
        <span className="sr-only">
          {activeTheme === 'light' ? 'White Wine theme active' : 'Red Wine theme active'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle; 