import React from 'react';
import { useScrollProgress } from '../hooks/useScrollAnimation';

interface ScrollProgressProps {
  className?: string;
  showPercentage?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ 
  className = '', 
  showPercentage = false 
}) => {
  const progress = useScrollProgress();

  return (
    <>
      {/* Progress Bar */}
      <div 
        className={`scroll-progress-bar ${className}`}
        style={{ 
          transform: `scaleX(${progress / 100})`,
          width: '100%'
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Page scroll progress: ${Math.round(progress)}%`}
      />
      
      {/* Optional Percentage Display */}
      {showPercentage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`
            px-3 py-2 rounded-full text-sm font-medium
            backdrop-blur-md border transition-all duration-300
            ${progress > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)'
          }}>
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollProgress; 