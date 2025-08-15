import { useScrollReveal } from './useScrollReveal';

interface ScrollAnimationOptions {
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'parallax';
  threshold?: number;
  delay?: number;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    animationType = 'fadeIn',
    threshold = 0.15,
    delay = 0,
    triggerOnce = true
  } = options;

  return useScrollReveal({
    animationType,
    threshold,
    delay,
    triggerOnce
  });
};

export default useScrollAnimation; 