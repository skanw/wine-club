import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useScrollReveal } from '../../client/hooks/useScrollReveal';
import Button from './ui/Button';

const Hero = () => {
  const { data: user } = useAuth();
  
  // Use scroll reveals for hero elements
  const titleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 0
  });

  const subtitleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 150
  });

  const ctaReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 300
  });

  const trustReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 450
  });

  return (
    <section className="hero-responsive full-bleed relative overflow-hidden gpu-accelerated">
      {/* VP-01: Simple Minimalist Background - no images */}
      <div className="absolute inset-0 z-0">
        {/* Simple gradient background */}
        <div 
          className="responsive-image absolute inset-0"
          style={{
            background: 'var(--gradient-light)',
            width: '100vw',
            height: '100vh',
            willChange: 'transform'
          }}
        />
        
        {/* Subtle overlay for text contrast */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Wine Bottle Decorative Elements - Hidden on mobile for performance */}
      <div className="desktop-only absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="wine-bottle-decoration absolute top-20 left-10 opacity-5 animate-wine-pour">
          <svg width="50" height="140" viewBox="0 0 50 140" className="text-champagne-500 drop-shadow-lg">
            <rect x="20" y="0" width="10" height="25" fill="currentColor" />
            <rect x="15" y="25" width="20" height="90" fill="currentColor" rx="2" />
            <ellipse cx="25" cy="125" rx="12" ry="10" fill="currentColor" />
          </svg>
        </div>
        <div className="wine-bottle-decoration absolute top-40 right-20 opacity-5 transform rotate-12 animate-champagne-bubble">
          <svg width="50" height="140" viewBox="0 0 50 140" className="text-bordeaux-400 drop-shadow-lg">
            <rect x="20" y="0" width="10" height="25" fill="currentColor" />
            <rect x="15" y="25" width="20" height="90" fill="currentColor" rx="2" />
            <ellipse cx="25" cy="125" rx="12" ry="10" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Main Content - Using responsive container system */}
      <div className="relative z-20 responsive-container-narrow flex items-center justify-center h-full">
        <div className="space-responsive-xl text-center">
          {/* HH-04: Clean minimalist card */}
          <div 
            ref={titleReveal.ref} 
            className="hero-reveal p-responsive-md"
            style={{ 
              borderRadius: '12px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-backdrop)',
              backdropFilter: 'blur(10px)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Main Headline with Clean Typography */}
            <h1 
              className="responsive-heading-1 font-luxury text-text-primary leading-tight mb-6"
              style={{
                maxWidth: '64ch',
                margin: '0 auto 1.5rem auto'
              }}
            >
              Transform Your{' '}
              <span className="text-bordeaux-600">
                Wine Cave
              </span>
              <br />
              Into a Thriving{' '}
              <span className="text-bordeaux-700">
                Business
              </span>
            </h1>

            {/* Clean Subtitle */}
            <div 
              ref={subtitleReveal.ref}
              className="hero-subtitle-reveal text-text-secondary mb-8 responsive-text leading-relaxed"
              style={{
                maxWidth: '64ch',
                margin: '0 auto 2rem auto'
              }}
            >
              Launch your boutique wine subscription service with our all-in-one platform. 
              From inventory management to customer loyalty programs, we handle the technology 
              so you can focus on crafting exceptional wine experiences that delight your members.
            </div>

            {/* Clean CTA Buttons */}
            <div 
              ref={ctaReveal.ref}
              className="cta-bar-reveal flex-responsive justify-center items-center"
            >
              <Button
                to="/signup"
                variant="primary"
                size="md"
                leftIcon={<span className="text-xl">🍷</span>}
                rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
                className="group touch-optimized"
              >
                Start Your Wine Business
              </Button>
              
              <Button
                to="/pricing"
                variant="secondary"
                size="md"
                leftIcon={<span className="text-xl">📊</span>}
                className="group touch-optimized"
              >
                View Live Demo
              </Button>
            </div>
          </div>

          {/* Trust Indicators - Clean Design */}
          <div ref={trustReveal.ref} className="trust-indicator">
            <div className="responsive-grid-3 bg-white/80 backdrop-blur-sm rounded-2xl p-responsive-md border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">No Setup Fees</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Free 14-Day Trial</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Wine Glass Animation - Enhanced, desktop only */}
      <div className="desktop-only absolute bottom-16 right-16 wine-glass-float pointer-events-none opacity-10 animate-champagne-bubble">
        <svg width="80" height="100" viewBox="0 0 80 100" className="text-champagne-400 drop-shadow-champagne">
          <ellipse cx="40" cy="30" rx="25" ry="20" fill="currentColor" opacity="0.4" />
          <rect x="37" y="50" width="6" height="35" fill="currentColor" />
          <ellipse cx="40" cy="88" rx="18" ry="6" fill="currentColor" />
          <circle cx="35" cy="25" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="45" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="40" cy="35" r="1" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      {/* Simple Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 mobile-landscape-optimize">
        <div className="flex flex-col items-center space-y-3 text-gray-500 hover:text-gray-700 transition-colors duration-300 group">
          <span className="text-sm mobile-only:text-xs">Discover More</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center group-hover:border-gray-500 transition-colors duration-300">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce group-hover:bg-gray-600 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;