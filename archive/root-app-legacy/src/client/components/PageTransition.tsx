import React, { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/wine-transitions.css';

interface PageTransitionProps {
  children: ReactNode;
  transitionType?: 'pour' | 'swirl' | 'fill' | 'fade-slide';
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  transitionType = 'pour',
  duration = 600 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    if (displayChildren !== children) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, duration / 2);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren, duration]);

  const getTransitionClass = () => {
    switch (transitionType) {
      case 'pour':
        return 'page-transition-wine-pour';
      case 'swirl':
        return 'page-transition-wine-swirl';
      case 'fill':
        return 'page-transition-wine-fill';
      case 'fade-slide':
        return 'page-transition-fade-slide';
      default:
        return 'page-transition-wine-pour';
    }
  };

  return (
    <div 
      className={`transition-container ${isTransitioning ? 'transitioning' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      <div 
        className={`${getTransitionClass()} wine-transition-normal`}
        key={location.pathname}
      >
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition; 