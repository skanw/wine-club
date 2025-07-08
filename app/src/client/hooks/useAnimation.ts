import { useEffect, useRef, useState, useCallback } from 'react';

type AnimationType = 
  | 'fade-in'
  | 'fade-out'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'scale-in'
  | 'scale-out'
  | 'wine-pour'
  | 'wine-swirl';

interface AnimationOptions {
  type: AnimationType;
  duration?: number;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
}

interface StaggerOptions extends Omit<AnimationOptions, 'type'> {
  staggerDelay?: number;
}

interface AnimationState {
  isVisible: boolean;
  hasTriggered: boolean;
}

/**
 * Custom hook for handling animations with IntersectionObserver
 * Features:
 * - Supports all animation types from our animation system
 * - Handles intersection observation
 * - Respects reduced motion preferences
 * - Supports staggered animations
 * - Handles cleanup and memory management
 */
export const useAnimation = (options: AnimationOptions) => {
  const {
    type,
    duration = 300,
    delay = 0,
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    disabled = false
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<AnimationState>({
    isVisible: false,
    hasTriggered: false
  });

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled || prefersReducedMotion()) {
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
      return;
    }

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

        if (isIntersecting) {
          // Apply animation class
          element.classList.add(`animate-${type}`);
          
          // Apply duration and delay if custom values provided
          if (duration !== 300) {
            element.style.animationDuration = `${duration}ms`;
          }
          if (delay > 0) {
            element.style.animationDelay = `${delay}ms`;
          }

          // Add visible class
          element.classList.add('is-visible');

          // Cleanup will-change after animation
          const cleanup = () => {
            element.style.willChange = 'auto';
            element.removeEventListener('animationend', cleanup);
          };
          element.addEventListener('animationend', cleanup);

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          element.classList.remove(`animate-${type}`);
          element.classList.remove('is-visible');
          element.style.willChange = 'opacity, transform';
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [type, duration, delay, threshold, rootMargin, triggerOnce, disabled, prefersReducedMotion]);

  return { ref: elementRef, ...state };
};

/**
 * Hook for creating staggered animations for multiple elements
 */
export const useStaggeredAnimation = (options: {
  type: AnimationType;
  staggerOptions?: StaggerOptions;
}) => {
  const {
    type,
    staggerOptions = {}
  } = options;

  const {
    duration = 300,
    delay = 0,
    staggerDelay = 100,
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    disabled = false
  } = staggerOptions;

  const elements = useRef<HTMLElement[]>([]);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (disabled || prefersReducedMotion() || !elements.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const index = elements.current.indexOf(element);

          if (entry.isIntersecting) {
            setVisibleIndices(prev => {
              if (triggerOnce && prev.includes(index)) return prev;
              return [...prev, index];
            });

            // Apply animation with stagger
            setTimeout(() => {
              element.classList.add(`animate-${type}`);
              element.classList.add('is-visible');

              // Apply custom duration if provided
              if (duration !== 300) {
                element.style.animationDuration = `${duration}ms`;
              }

              // Cleanup will-change after animation
              const cleanup = () => {
                element.style.willChange = 'auto';
                element.removeEventListener('animationend', cleanup);
              };
              element.addEventListener('animationend', cleanup);
            }, delay + (staggerDelay * index));

          } else if (!triggerOnce) {
            setVisibleIndices(prev => prev.filter(i => i !== index));
            element.classList.remove(`animate-${type}`);
            element.classList.remove('is-visible');
            element.style.willChange = 'opacity, transform';
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.current.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [type, duration, delay, staggerDelay, threshold, rootMargin, triggerOnce, disabled, prefersReducedMotion]);

  const addElement = useCallback((element: HTMLElement | null) => {
    if (element && !elements.current.includes(element)) {
      elements.current.push(element);
    }
  }, []);

  return { addElement, visibleIndices };
}; 