import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [activeTheme, setActiveTheme] = useState<'red' | 'white'>('red');

  useEffect(() => {
    // Initialize theme from localStorage or default to red
    const savedTheme = localStorage.getItem('wine-theme') as 'red' | 'white' | null;
    const initialTheme = savedTheme || 'red';
    setActiveTheme(initialTheme);
    document.body.className = `theme-${initialTheme}`;
  }, []);

  const handleThemeChange = (theme: 'red' | 'white') => {
    setActiveTheme(theme);
    document.body.className = `theme-${theme}`;
    localStorage.setItem('wine-theme', theme);
  };

  return (
    <div className={`theme-toggle-container ${className}`}>
      <div className="theme-toggle">
        <button
          className={`theme-option ${activeTheme === 'red' ? 'active' : ''}`}
          onClick={() => handleThemeChange('red')}
          aria-label="Switch to Red Wine Theme"
        >
          Red Wine
        </button>
        <button
          className={`theme-option ${activeTheme === 'white' ? 'active' : ''}`}
          onClick={() => handleThemeChange('white')}
          aria-label="Switch to White Wine Theme"
        >
          White Wine
        </button>
        <div 
          className={`theme-slider ${activeTheme === 'white' ? 'slide-right' : 'slide-left'}`}
        />
      </div>
    </div>
  );
};

export default ThemeToggle; 