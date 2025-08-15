import React, { useState, useEffect, useCallback } from 'react';
import { useRippleEffect } from '../hooks/useMicroInteractions';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface ScrollSpyNavbarProps {
  items: NavItem[];
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export const ScrollSpyNavbar: React.FC<ScrollSpyNavbarProps> = ({
  items,
  className = '',
  threshold = 0.6,
  rootMargin = '-20% 0px -20% 0px'
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);
  const { createRipple } = useRippleEffect();

  // Scroll spy functionality
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold,
      rootMargin
    };

    const observer = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        
        const sectionId = mostVisible.target.id;
        setActiveSection(sectionId);
      }
    }, observerOptions);

    // Observe all sections
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items, threshold, rootMargin]);

  // Sticky navbar detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    createRipple(e);
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const navbarHeight = 80; // Account for sticky navbar height
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [createRipple]);

  return (
    <nav 
      className={`scroll-spy-navbar ${isSticky ? 'sticky' : ''} ${className}`}
      role="navigation"
      aria-label="Page sections"
    >
      <div className="navbar-container">
        <ul className="navbar-items">
          {items.map((item, index) => (
            <li key={item.id} className="navbar-item">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`navbar-link ripple-container ${
                  activeSection === item.id ? 'active' : ''
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
                <span className="navbar-underline" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ScrollSpyNavbar; 