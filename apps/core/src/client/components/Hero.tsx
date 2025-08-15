import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Button from './ui/Button';
import OptimizedImage from './OptimizedImage';
import { preloadImages } from '../utils/cdn';

export default function Hero() {
  const titleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 0
  });

  const subtitleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 200
  });

  const ctaReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 400
  });

  const featuresReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 600
  });

  const statsReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 800
  });

  // Preload critical images
  React.useEffect(() => {
    preloadImages([
      '/static/logo.webp'
    ]);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bordeaux-50 via-white to-champagne-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bordeaux-600' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>



      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center">
          {/* Enhanced Title */}
          <div 
            ref={titleReveal.ref}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-bordeaux-900 mb-6 font-serif leading-tight">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-bordeaux-600 via-bordeaux-700 to-bordeaux-800 bg-clip-text text-transparent">
                Wine Club
              </span>
              <span className="block">Experience</span>
            </h1>
          </div>

          {/* Enhanced Subtitle */}
          <div 
            ref={subtitleReveal.ref}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-taupe-700 max-w-3xl mx-auto leading-relaxed font-light">
              The complete SaaS platform for boutique wine clubs. 
              <span className="font-semibold text-bordeaux-700"> Manage members, automate shipping, and grow your business</span> 
              with enterprise-grade tools designed for wine professionals.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div 
            ref={ctaReveal.ref}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              to="/signup"
              variant="primary"
              size="lg"
              rightIcon="ArrowRight"
              className="group hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl text-lg px-8 py-4"
            >
              Start Free Trial
              <span className="text-sm font-normal opacity-90 ml-2">
                No credit card required
              </span>
            </Button>
            
            <Button
              to="/demo"
              variant="secondary"
              size="lg"
              rightIcon="Play"
              className="group hover:scale-105 transition-transform duration-300 text-lg px-8 py-4"
            >
              Watch Demo
              <span className="text-sm font-normal opacity-90 ml-2">
                2 min video
              </span>
            </Button>
          </div>

          {/* Enhanced Feature Cards */}
          <div 
            ref={featuresReveal.ref}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-bordeaux-100 hover:border-bordeaux-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 mb-4">Member Management</h3>
              <p className="text-taupe-600 leading-relaxed">
                Seamlessly manage your wine club members with automated onboarding, preferences tracking, and communication tools.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-bordeaux-100 hover:border-bordeaux-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 mb-4">Automated Shipping</h3>
              <p className="text-taupe-600 leading-relaxed">
                Streamline your shipping process with automated label generation, tracking notifications, and inventory management.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-bordeaux-100 hover:border-bordeaux-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-bordeaux-900 mb-4">Analytics & Insights</h3>
              <p className="text-taupe-600 leading-relaxed">
                Make data-driven decisions with comprehensive analytics, member insights, and business performance metrics.
              </p>
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div 
            ref={statsReveal.ref}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-taupe-600 font-medium">Wine Clubs</div>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-taupe-600 font-medium">Members</div>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-taupe-600 font-medium">Satisfaction</div>
            </div>
            
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-taupe-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-bordeaux-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-champagne-200 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-bordeaux-100 rounded-full opacity-30 animate-pulse delay-500" />
    </section>
  );
}