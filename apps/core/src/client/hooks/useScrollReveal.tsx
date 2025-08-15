import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
  disabled?: boolean;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'parallax';
}

interface ScrollRevealState {
  isVisible: boolean;
  hasTriggered: boolean;
}

/**
 * Unified scroll reveal hook that handles both single and staggered animations
 * Features:
 * - Uses Intersection Observer for performance
 * - Supports staggered animations for multiple elements
 * - Respects prefers-reduced-motion
 * - Handles cleanup and memory management
 */
export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    staggerDelay = 0,
    disabled = false,
    animationType = 'fadeIn'
  } = options;

  const elementRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ScrollRevealState>({
    isVisible: false,
    hasTriggered: false
  });

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Apply reveal class with proper timing
  const applyRevealClass = useCallback((element: HTMLElement, shouldReveal: boolean) => {
    if (!element || disabled || prefersReducedMotion()) {
      if (element && !disabled) {
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
      return;
    }

    if (shouldReveal) {
      const totalDelay = delay + staggerDelay;
      
      // Set animation type class
      element.classList.add(`animate-${animationType}`);
      
      if (totalDelay > 0) {
        setTimeout(() => {
          element.classList.add('is-visible');
          // Clean up will-change after animation completes
          setTimeout(() => {
            element.style.willChange = 'auto';
          }, 400);
        }, totalDelay);
      } else {
        element.classList.add('is-visible');
        setTimeout(() => {
          element.style.willChange = 'auto';
        }, 400);
      }
    } else if (!triggerOnce) {
      element.classList.remove('is-visible');
      element.classList.remove(`animate-${animationType}`);
      element.style.willChange = 'opacity, transform';
    }
  }, [delay, staggerDelay, disabled, triggerOnce, prefersReducedMotion, animationType]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        setState(prev => {
          if (triggerOnce && prev.hasTriggered) return prev;
          return {
            isVisible: isIntersecting,
            hasTriggered: prev.hasTriggered || isIntersecting
          };
        });

        applyRevealClass(element, isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, disabled, applyRevealClass]);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    hasTriggered: state.hasTriggered
  };
};

/**
 * Hook for creating staggered reveal animations for multiple elements
 */
export const useStaggeredScrollReveal = (options: ScrollRevealOptions = {}) => {
  const elements = useRef<HTMLDivElement[]>([]);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    staggerDelay = 100,
    disabled = false,
    animationType = 'fadeIn'
  } = options;

  useEffect(() => {
    if (disabled || !elements.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLDivElement;
          const index = elements.current.indexOf(element);

          if (entry.isIntersecting) {
            setVisibleIndices(prev => {
              if (triggerOnce && prev.includes(index)) return prev;
              return [...prev, index];
            });

            setTimeout(() => {
              element.classList.add('is-visible', `animate-${animationType}`);
            }, delay + (staggerDelay * index));
          } else if (!triggerOnce) {
            setVisibleIndices(prev => prev.filter(i => i !== index));
            element.classList.remove('is-visible', `animate-${animationType}`);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.current.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, staggerDelay, disabled, animationType]);

  const addElement = useCallback((element: HTMLDivElement | null) => {
    if (element && !elements.current.includes(element)) {
      elements.current.push(element);
    }
  }, []);

  return {
    addElement,
    visibleIndices
  };
};

/**
 * Hook for batch scroll reveals with automatic staggering
 */
export const useBatchScrollReveal = (elements: string[], baseDelay: number = 0) => {
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show all elements immediately if reduced motion is preferred
      elements.forEach(selector => {
        const element = document.querySelector(selector) as HTMLDivElement;
        if (element) {
          element.classList.add('is-visible');
          element.style.opacity = '1';
          element.style.transform = 'none';
        }
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLDivElement;
            const elementId = element.dataset.revealId;
            
            if (elementId && !revealedElements.has(elementId)) {
              const elementIndex = elements.indexOf(elementId);
              const delay = baseDelay + (elementIndex * 100);
              
              setTimeout(() => {
                element.classList.add('is-visible');
                setRevealedElements(prev => new Set(prev).add(elementId));
                
                // Clean up will-change after animation
                setTimeout(() => {
                  element.style.willChange = 'auto';
                }, 400);
              }, delay);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements
    elements.forEach((selector, _index) => {
      const element = document.querySelector(selector) as HTMLDivElement;
      if (element) {
        element.classList.add('reveal');
        element.dataset.revealId = selector;
        observer.observe(element);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elements, baseDelay]);

  return {
    revealedElements
  };
};

export default useScrollReveal; 