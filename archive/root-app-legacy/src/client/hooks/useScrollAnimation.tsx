import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'parallax';
}

interface ScrollAnimationState {
  isVisible: boolean;
  hasTriggered: boolean;
  progress: number;
}

/**
 * Custom hook for scroll-linked reveal animations
 * Uses Intersection Observer for optimal performance
 */
export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    duration = 600,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    animationType = 'fadeIn'
  } = options;

  const elementRef = useRef<any>(null);
  const [state, setState] = useState<ScrollAnimationState>({
    isVisible: false,
    hasTriggered: false,
    progress: 0
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;

          setState(prevState => {
            // If already triggered and triggerOnce is true, don't update
            if (prevState.hasTriggered && triggerOnce && !isIntersecting) {
              return prevState;
            }

            return {
              isVisible: isIntersecting,
              hasTriggered: prevState.hasTriggered || isIntersecting,
              progress: intersectionRatio
            };
          });
        });
      },
      {
        threshold: typeof threshold === 'number' ? [threshold] : threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  // Apply animation styles
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const shouldAnimate = triggerOnce ? state.hasTriggered : state.isVisible;
    
    if (shouldAnimate) {
      // Apply animation with delay
      const timeoutId = setTimeout(() => {
        element.style.transition = `all ${duration}ms ${easing}`;
        element.classList.add('scroll-animate-visible');
        element.classList.add(`scroll-animate-${animationType}`);
      }, delay);

      return () => clearTimeout(timeoutId);
    } else {
      // Reset animation
      element.classList.remove('scroll-animate-visible');
      element.classList.remove(`scroll-animate-${animationType}`);
    }
  }, [state.isVisible, state.hasTriggered, delay, duration, easing, animationType, triggerOnce]);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    hasTriggered: state.hasTriggered,
    progress: state.progress
  };
};

/**
 * Hook for staggered animations (multiple elements)
 */
export const useStaggeredScrollAnimation = (
  count: number,
  baseOptions: ScrollAnimationOptions = {},
  staggerDelay: number = 100
) => {
  const animations = Array.from({ length: count }, (_, index) => 
    useScrollAnimation({
      ...baseOptions,
      delay: (baseOptions.delay || 0) + (index * staggerDelay)
    })
  );

  return animations;
};

/**
 * Hook for parallax scroll effects
 */
export const useParallaxScroll = (speed: number = 0.5) => {
  const elementRef = useRef<any>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setOffset(rate);
      }
    };

    // Throttled scroll handler for performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [speed]);

  return {
    ref: elementRef,
    offset,
    style: {
      transform: `translateY(${offset}px)`
    }
  };
};

/**
 * Hook for scroll progress indicator
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, []);

  return progress;
};

/**
 * Hook for element visibility with callback
 */
export const useIntersectionObserver = (
  callback: (isVisible: boolean, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) => {
  const elementRef = useRef<any>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting, entry);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, options]);

  return elementRef;
};

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