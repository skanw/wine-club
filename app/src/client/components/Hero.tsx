import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import useScrollReveal from '../../client/hooks/useScrollReveal';
import { useStaggeredScrollReveal } from '../../client/hooks/useScrollReveal';

const Hero = () => {
  const { data: user } = useAuth();
  
  // Use staggered scroll reveals for hero elements
  const heroReveals = useStaggeredScrollReveal(4, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }, 150);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* HH-04: Full-Bleed Background pushed down 96px to clear navbar */}
      <div className="absolute inset-0 z-0" style={{ top: '96px' }}>
        {/* Primary Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat object-cover w-full"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')`,
            transform: 'scale(1.1)',
            willChange: 'transform'
          }}
        />
        
        {/* HH-04: Semi-transparent Bordeaux overlay (#000, 0.35) behind headline for contrast */}
        <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.35)' }} />
        
        {/* Additional subtle gradient for enhanced readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Wine Bottle Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="wine-bottle-decoration absolute top-20 left-10 opacity-5 animate-wine-pour">
          <svg width="50" height="140" viewBox="0 0 50 140" className="text-champagne-500 drop-shadow-luxury">
            <rect x="20" y="0" width="10" height="25" fill="currentColor" />
            <rect x="15" y="25" width="20" height="90" fill="currentColor" rx="2" />
            <ellipse cx="25" cy="125" rx="12" ry="10" fill="currentColor" />
          </svg>
        </div>
        <div className="wine-bottle-decoration absolute top-40 right-20 opacity-5 transform rotate-12 animate-champagne-bubble">
          <svg width="50" height="140" viewBox="0 0 50 140" className="text-bordeaux-400 drop-shadow-luxury">
            <rect x="20" y="0" width="10" height="25" fill="currentColor" />
            <rect x="15" y="25" width="20" height="90" fill="currentColor" rx="2" />
            <ellipse cx="25" cy="125" rx="12" ry="10" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Main Content - Centered with proper spacing */}
      <div className="relative z-20 max-w-luxury-content mx-auto px-16 sm:px-20 lg:px-24 text-center">
        <div className="space-y-luxury-xl">
          {/* HH-04: Replace heavy glass card with max-width 720px outline card */}
          <div 
            ref={heroReveals[0].ref} 
            className="hero-reveal mx-auto border border-champagne-500"
            style={{ 
              maxWidth: '720px',
              backdropFilter: 'blur(3px)',
              borderRadius: '12px',
              border: '1px solid #D9C6A0', // Champagne border
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3rem 2rem'
            }}
          >
            {/* Main Headline with Enhanced Text Shadow */}
            <h1 
              className="luxury-h1 text-luxury-h1 md:text-luxury-h1-md sm:text-luxury-h1-sm font-luxury text-white leading-tight mb-6"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
                maxWidth: '64ch', // HH-04: Text ≤64 ch width
                margin: '0 auto 1.5rem auto'
              }}
            >
              Transform Your{' '}
              <span className="text-champagne-300">
                Wine Cave
              </span>
              <br />
              Into a Thriving{' '}
              <span className="text-bordeaux-300">
                Business
              </span>
            </h1>

            {/* Wine Tasting Notes Style Subtitle with Text Shadow and Reveal */}
            <div 
              ref={heroReveals[1].ref}
              className="hero-subtitle-reveal wine-tasting-notes text-white/95 mb-8 text-lg leading-relaxed"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
                maxWidth: '64ch', // HH-04: Text ≤64 ch width
                margin: '0 auto 2rem auto'
              }}
            >
              Launch your boutique wine subscription service with our all-in-one platform. 
              From inventory management to customer loyalty programs, we handle the technology 
              so you can focus on crafting exceptional wine experiences that delight your members.
            </div>

            {/* Premium CTA Buttons with Micro-Interactions and Reveal */}
            <div 
              ref={heroReveals[2].ref}
              className="cta-bar-reveal flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/signup"
                className="btn-primary group"
                style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  height: '52px', // HH-05: Equal height 52px
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px' // HH-05: 16px gap between buttons
                }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">🍷</span>
                Start Your Wine Business
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/pricing"
                className="btn-secondary group"
                style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  height: '52px', // HH-05: Equal height 52px
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">📊</span>
                View Live Demo
              </Link>
            </div>
          </div>

          {/* Trust Indicators - Refined Layout */}
          <div ref={heroReveals[3].ref} className="trust-indicator">
            <div className="flex flex-wrap justify-center items-center gap-8 backdrop-blur-sm bg-white/5 dark:bg-black/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-champagne-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>No Setup Fees</span>
              </div>
              
              <div className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-bordeaux-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Free 14-Day Trial</span>
              </div>
              
              <div className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-champagne-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Wine Glass Animation - Enhanced */}
      <div className="absolute bottom-16 right-16 wine-glass-float pointer-events-none opacity-10 animate-champagne-bubble">
        <svg width="80" height="100" viewBox="0 0 80 100" className="text-champagne-400 drop-shadow-champagne">
          <ellipse cx="40" cy="30" rx="25" ry="20" fill="currentColor" opacity="0.4" />
          <rect x="37" y="50" width="6" height="35" fill="currentColor" />
          <ellipse cx="40" cy="88" rx="18" ry="6" fill="currentColor" />
          <circle cx="35" cy="25" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="45" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="40" cy="35" r="1" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      {/* Elegant Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-3 text-white/70 hover:text-white transition-colors duration-300 group">
          <span className="text-sm" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Discover More</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors duration-300">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce group-hover:bg-white/80 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;