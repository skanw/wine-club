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
      {/* Full-Bleed 8K Vineyard Background with Parallax */}
      <div className="absolute inset-0 z-0">
        {/* Primary Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')`,
            transform: 'scale(1.1)',
            willChange: 'transform'
          }}
        />
        
        {/* Soft Semi-Transparent Bordeaux to Champagne Overlay */}
        <div className="absolute inset-0 bg-luxury-overlay opacity-60" />
        
        {/* Elegant Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
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

      {/* Main Content - Centered 900px Max Width */}
      <div className="relative z-20 max-w-luxury-content mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="space-y-luxury-xl">
          {/* Translucent Floating Card for Headline */}
          <div 
            ref={heroReveals[0].ref} 
            className="hero-reveal backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-3xl p-8 sm:p-12 shadow-luxury-xl border border-white/20 dark:border-white/10"
            style={{ willChange: 'transform' }}
          >
            {/* Main Headline - Luxury Typography */}
            <h1 className="luxury-h1 text-luxury-h1 md:text-luxury-h1-md sm:text-luxury-h1-sm font-luxury text-white leading-tight mb-6">
              Transform Your{' '}
              <span className="text-champagne-gradient">
                Wine Cave
              </span>
              <br />
              Into a Thriving{' '}
              <span className="text-bordeaux-gradient">
                Business
              </span>
            </h1>

            {/* Wine Tasting Notes Style Subtitle */}
            <div className="wine-tasting-notes text-white/90 max-w-3xl mx-auto mb-8">
              Launch your boutique wine subscription service with our all-in-one platform. 
              From inventory management to customer loyalty programs, we handle the technology 
              so you can focus on crafting exceptional wine experiences that delight your members.
            </div>

            {/* Premium CTA Buttons with Micro-Interactions */}
            <div className="luxury-btn-group justify-center">
              <Link
                to="/signup"
                className="luxury-btn luxury-btn-primary luxury-btn-lg group"
              >
                <span className="icon icon-scale">🍷</span>
                Start Your Wine Business
                <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/pricing"
                className="luxury-btn luxury-btn-secondary luxury-btn-lg group"
              >
                <span className="icon icon-up">📊</span>
                View Live Demo
              </Link>
            </div>
          </div>

          {/* Trust Indicators - Refined Layout */}
          <div ref={heroReveals[1].ref} className="trust-indicator">
            <div className="flex flex-wrap justify-center items-center gap-8 backdrop-blur-sm bg-white/5 dark:bg-black/10 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-champagne-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="luxury-small font-medium">No Setup Fees</span>
              </div>
              
              <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-bordeaux-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="luxury-small font-medium">Free 14-Day Trial</span>
              </div>
              
              <div className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-champagne-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="luxury-small font-medium">Cancel Anytime</span>
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
      <div ref={heroReveals[2].ref} className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-3 text-white/70 hover:text-white transition-colors duration-300 group">
          <span className="luxury-caption">Discover More</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors duration-300">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce group-hover:bg-white/80 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;