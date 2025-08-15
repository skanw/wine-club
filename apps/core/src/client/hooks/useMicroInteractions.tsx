/// <reference lib="dom" />
import React, { useEffect, useCallback, useRef, useState } from 'react';

// 💫 Ripple Effect Hook
export const useRippleEffect = () => {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    // Add ripple-container class if not present
    if (!button.classList.contains('ripple-container')) {
      button.classList.add('ripple-container');
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }, []);

  return { createRipple };
};

// 🍷 Custom Cursor Hook
export const useCustomCursor = (targetSelector: string = '.wine-cursor-area') => {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'wine-custom-cursor';
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const targetElements = document.querySelectorAll(targetSelector);
    let _isHovering = false;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    // Mouse enter handler for target elements
    const handleMouseEnter = () => {
      _isHovering = true;
      if (cursorRef.current) {
        cursorRef.current.classList.add('hover');
      }
      document.body.style.cursor = 'none';
    };

    // Mouse leave handler for target elements
    const handleMouseLeave = (_event: Event) => {
      _isHovering = false;
      if (cursorRef.current) {
        cursorRef.current.classList.remove('hover');
      }
      document.body.style.cursor = 'auto';
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    targetElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Hide cursor when leaving window
    const handleMouseLeaveWindow = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnterWindow = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      
      targetElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });

      if (cursorRef.current && cursorRef.current.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
      }
      
      document.body.style.cursor = 'auto';
    };
  }, [targetSelector]);

  return cursorRef;
};

// 🎭 Loading State Hook
export const useLoadingState = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(async <T,>(
    asyncFunction: () => Promise<T>
  ): Promise<T> => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
};

// 🌊 Intersection Observer Animation Hook
export const useIntersectionAnimation = (
  options: { root?: Element | null; rootMargin?: string; threshold?: number | number[] } = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
) => {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    elementRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [options]);

  const addRef = useCallback((element: HTMLElement | null, index: number) => {
    elementRefs.current[index] = element;
  }, []);

  return { addRef };
};

// 🎯 Enhanced Button Component Hook
export const useEnhancedButton = () => {
  const { createRipple } = useRippleEffect();
  const { isLoading, startLoading, stopLoading, withLoading } = useLoadingState();

  const getButtonProps = useCallback((
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
    className: string = '',
    disabled: boolean = false
  ) => {
    return {
      className: `wine-button ${className} ${isLoading ? 'wine-loading' : ''}`,
      disabled: disabled || isLoading,
      onClick: async (event: React.MouseEvent<HTMLButtonElement>) => {
        createRipple(event);
        
        if (onClick) {
          if (onClick.constructor.name === 'AsyncFunction') {
            await withLoading(() => onClick(event) as Promise<void>);
          } else {
            onClick(event);
          }
        }
      },
      onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => {
        // Add pressed state
        event.currentTarget.style.transform = 'scale(0.98)';
      },
      onMouseUp: (event: React.MouseEvent<HTMLButtonElement>) => {
        // Remove pressed state
        event.currentTarget.style.transform = '';
      },
      onMouseLeave: (_event: React.MouseEvent<HTMLButtonElement>) => {
        // Ensure pressed state is removed
        _event.currentTarget.style.transform = '';
      }
    };
  }, [createRipple, isLoading, withLoading]);

  return {
    getButtonProps,
    isLoading,
    startLoading,
    stopLoading
  };
};

// 📱 Touch/Mobile Optimizations Hook
export const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable hover effects on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
  }, [isMobile]);

  return { isMobile };
};

// All React hooks imported at the top 