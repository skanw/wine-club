import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
  disabled?: boolean;
}

interface ScrollRevealState {
  isVisible: boolean;
  hasTriggered: boolean;
}

/**
 * Optimized scroll reveal hook following HCI best practices
 * - Uses Intersection Observer for performance
 * - Fires animations only once per page load
 * - Respects prefers-reduced-motion
 * - Supports staggered animations
 */
export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    staggerDelay = 0,
    disabled = false
  } = options;

  const elementRef = useRef<any>(null);
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
      // If reduced motion is preferred, show content immediately
      if (element && !disabled) {
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
      return;
    }

    if (shouldReveal) {
      const totalDelay = delay + staggerDelay;
      
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
      element.style.willChange = 'opacity, transform';
    }
  }, [delay, staggerDelay, disabled, triggerOnce, prefersReducedMotion]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add base reveal class and initial styles
    element.classList.add('reveal');
    
    // Skip observer if disabled or reduced motion
    if (disabled || prefersReducedMotion()) {
      applyRevealClass(element, true);
      setState({ isVisible: true, hasTriggered: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          
          setState(prevState => {
            // If already triggered and triggerOnce is true, don't update
            if (prevState.hasTriggered && triggerOnce && !isIntersecting) {
              return prevState;
            }

            const newState = {
              isVisible: isIntersecting,
              hasTriggered: prevState.hasTriggered || isIntersecting
            };

            // Apply reveal class based on intersection
            applyRevealClass(element, isIntersecting);

            return newState;
          });
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      // Clean up will-change property
      if (element.style.willChange) {
        element.style.willChange = 'auto';
      }
    };
  }, [threshold, rootMargin, triggerOnce, applyRevealClass]);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    hasTriggered: state.hasTriggered
  };
};

/**
 * Hook for creating staggered scroll reveals
 */
export const useStaggeredScrollReveal = (
  count: number,
  baseOptions: ScrollRevealOptions = {},
  staggerInterval: number = 100
) => {
  const reveals = Array.from({ length: count }, (_, index) => 
    useScrollReveal({
      ...baseOptions,
      staggerDelay: index * staggerInterval
    })
  );

  return reveals;
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
        const element = document.querySelector(selector) as HTMLElement;
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
            const element = entry.target as HTMLElement;
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
    elements.forEach((selector, index) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.classList.add('reveal');
        element.dataset.revealId = selector;
        observer.observe(element);
      }
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [elements, baseDelay, revealedElements]);

  return { revealedElements };
};

export default useScrollReveal; 