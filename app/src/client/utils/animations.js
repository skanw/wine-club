/* ===== ANIMATION UTILITIES ===== */

// 1. Scroll-based navbar transparency
export function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-minimal');
  if (!navbar) return;

  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
}

// 2. Typing animation for hero section
export function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const phrases = [
    'Handpicked French Wines.',
    'Delivered Monthly.',
    'Bespoke Cellar Selection.',
    'Curated by Sommeliers.'
  ];

  let currentPhraseIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeText() {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeText, typingSpeed);
  }

  // Start typing after a brief delay
  setTimeout(typeText, 1000);
}

// 3. Floating cards animation
export function initFloatingCards() {
  const cards = document.querySelectorAll('.floating-card');
  
  cards.forEach((card, index) => {
    let startTime = Date.now() + (index * 1000); // Stagger start times
    
    function float() {
      const elapsed = Date.now() - startTime;
      const offset = Math.sin(elapsed * 0.001) * 5; // ±5px movement
      
      card.style.transform = `translateY(${offset}px)`;
      requestAnimationFrame(float);
    }
    
    float();
  });
}

// 4. Scroll-triggered reveal animation
export function initScrollReveal() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // Observe reveal cards
  document.querySelectorAll('.reveal-card').forEach(card => {
    observer.observe(card);
  });

  // Observe wine cards for add-to-cart button animation
  document.querySelectorAll('.wine-card').forEach(card => {
    observer.observe(card);
  });
}

// 5. Tab underline animation
export function initTabUnderline() {
  const tabContainer = document.querySelector('.tab-container');
  const tabButtons = document.querySelectorAll('.tab-button');
  const underline = document.querySelector('.tab-underline');
  
  if (!tabContainer || !underline) return;

  function moveUnderline(toTab) {
    const containerRect = tabContainer.getBoundingClientRect();
    const tabRect = toTab.getBoundingClientRect();
    
    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;
    
    underline.style.setProperty('--u-left', `${left}px`);
    underline.style.setProperty('--u-width', `${width}px`);
    underline.style.left = `${left}px`;
    underline.style.width = `${width}px`;
  }

  // Initialize underline position
  const activeTab = document.querySelector('.tab-button.active') || tabButtons[0];
  if (activeTab) {
    moveUnderline(activeTab);
  }

  // Handle tab clicks
  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      // Move underline
      moveUnderline(tab);
    });
  });
}

// 6. 3D card tilt effect
export function initCardTilt() {
  const cards = document.querySelectorAll('.floating-card, .plan-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -15; // Max 15 degrees
      const rotateY = (x - centerX) / centerX * 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

// 7. Footer parallax effect
export function initFooterParallax() {
  const parallaxTexts = document.querySelectorAll('.parallax-text');
  
  function updateParallax() {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', scrollY);
    
    parallaxTexts.forEach((text, index) => {
      const speed = 0.1 + (index * 0.05);
      const yPos = scrollY * speed;
      text.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  let ticking = false;
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
}

// 8. Theme toggle animation
export function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle-minimal');
  if (!toggle) return;
  
  toggle.addEventListener('click', () => {
    const currentTheme = toggle.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth animation
    toggle.classList.add('transitioning');
    
    // Update theme
    toggle.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      toggle.classList.remove('transitioning');
    }, 300);
  });
}

// 9. Smooth scroll for navigation links
export function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 10. Performance-optimized scroll handler
export function initPerformanceOptimizations() {
  // Throttle scroll events
  let scrollTimeout;
  
  function throttledScrollHandler() {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      // Update scroll-based animations here
      scrollTimeout = null;
    }, 16); // ~60fps
  }
  
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
}

// 11. Initialize all animations
export function initAllAnimations() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
    return;
  }
  
  // Initialize all animation systems
  initNavbarScroll();
  initTypingAnimation();
  initFloatingCards();
  initScrollReveal();
  initTabUnderline();
  initCardTilt();
  initFooterParallax();
  initThemeToggle();
  initSmoothScroll();
  initPerformanceOptimizations();
  
  console.log('🎭 All animations initialized');
}

// 12. Utility functions
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for use in components
export default {
  initAllAnimations,
  initNavbarScroll,
  initTypingAnimation,
  initFloatingCards,
  initScrollReveal,
  initTabUnderline,
  initCardTilt,
  initFooterParallax,
  initThemeToggle,
  initSmoothScroll,
  debounce,
  throttle
}; 