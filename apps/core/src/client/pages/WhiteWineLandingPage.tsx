import React, { useEffect, useState } from 'react';

// Import landing components
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

// Import content
import homeContent from '../content/home.json';

export default function WhiteWineLandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      return;
    }
  }, []);

  return (
    <div className={`min-h-screen bg-ivory transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Main content with proper spacing for fixed navbar */}
      <main id="main-content" className="pt-0">
        {/* Hero Section */}
        <Hero
          badge={homeContent.hero.badge}
          title={homeContent.hero.title}
          subtitle={homeContent.hero.subtitle}
          cta={homeContent.hero.cta}
          stats={homeContent.hero.stats}
        />
        
        {/* Features Section */}
        <Features
          title={homeContent.features.title}
          subtitle={homeContent.features.subtitle}
          items={homeContent.features.items}
        />
        
        {/* Pricing Section */}
        <Pricing
          title={homeContent.pricing.title}
          subtitle={homeContent.pricing.subtitle}
          tiers={homeContent.pricing.tiers}
        />
        
        {/* Testimonials Section */}
        <Testimonials
          title={homeContent.testimonials.title}
          subtitle={homeContent.testimonials.subtitle}
          items={homeContent.testimonials.items}
        />
        
        {/* CTA Section */}
        <CTA
          title={homeContent.cta.title}
          subtitle={homeContent.cta.subtitle}
          benefits={homeContent.cta.benefits}
          button={homeContent.cta.button}
        />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
