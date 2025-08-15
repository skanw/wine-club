import React from 'react';

interface WineLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'icon' | 'full';
}

const WineLogo: React.FC<WineLogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = false,
  variant = 'icon'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const LogoSvg = () => (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wine Club Logo"
    >
      {/* Wine Glass Shape */}
      <path 
        d="M20 38C22.2091 38 24 36.2091 24 34V28H16V34C16 36.2091 17.7909 38 20 38Z" 
        fill="currentColor" 
        className="text-wine-700 dark:text-wine-400"
      />
      
      {/* Wine in Glass */}
      <path 
        d="M23 28V32C23 33.1046 22.1046 34 21 34H19C17.8954 34 17 33.1046 17 32V28H23Z" 
        fill="currentColor"
        className="text-wine-600 dark:text-wine-300"
      />
      
      {/* Glass Bowl */}
      <path 
        d="M12 2C12 2 12 12 20 16C28 12 28 2 28 2H12Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="text-yellow-500 dark:text-yellow-400"
      />
      
      {/* Wine in Bowl */}
      <ellipse 
        cx="20" 
        cy="10" 
        rx="6" 
        ry="4" 
        fill="currentColor" 
        opacity="0.8"
        className="text-wine-700 dark:text-wine-400"
      />
      
      {/* Stem */}
      <rect 
        x="19" 
        y="16" 
        width="2" 
        height="12" 
        fill="currentColor"
        className="text-yellow-500 dark:text-yellow-400"
      />
      
      {/* Base */}
      <ellipse 
        cx="20" 
        cy="30" 
        rx="4" 
        ry="1" 
        fill="currentColor"
        className="text-yellow-500 dark:text-yellow-400"
      />
      
      {/* Grape Accents */}
      <circle 
        cx="14" 
        cy="6" 
        r="1.5" 
        fill="currentColor"
        className="text-purple-600 dark:text-purple-400"
      />
      <circle 
        cx="26" 
        cy="6" 
        r="1.5" 
        fill="currentColor"
        className="text-purple-600 dark:text-purple-400"
      />
      <circle 
        cx="13" 
        cy="8" 
        r="1" 
        fill="currentColor"
        className="text-purple-600 dark:text-purple-400"
      />
      <circle 
        cx="27" 
        cy="8" 
        r="1" 
        fill="currentColor"
        className="text-purple-600 dark:text-purple-400"
      />
    </svg>
  );

  if (variant === 'full' || showText) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LogoSvg />
        {showText && (
          <span className="text-lg font-bold leading-6 dark:text-white wine-primary-text">
            Wine Club
          </span>
        )}
      </div>
    );
  }

  return <LogoSvg />;
};

export default WineLogo; 