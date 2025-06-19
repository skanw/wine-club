import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
  delay?: number;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    animationClass = 'animate-fade-in-up',
    delay = 0,
    once = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }
        } else if (!once && !hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, delay, once, hasAnimated]);

  return {
    elementRef,
    isVisible,
    className: isVisible ? animationClass : '',
  };
}

// Predefined animation variants
export const scrollAnimations = {
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  fadeInLeft: 'animate-fade-in-left',
  fadeInRight: 'animate-fade-in-right',
  scaleIn: 'animate-scale-in',
  slideUp: 'animate-slide-up',
  wineReveal: 'animate-wine-reveal',
  winePour: 'animate-wine-pour',
  wineSwirl: 'animate-wine-swirl',
};

// Hook for multiple elements with staggered animations
export function useStaggeredAnimation(
  count: number,
  baseDelay: number = 100,
  options: UseScrollAnimationOptions = {}
) {
  const animations = Array.from({ length: count }, (_, index) => 
    useScrollAnimation({
      ...options,
      delay: baseDelay * index,
    })
  );

  return animations;
} 