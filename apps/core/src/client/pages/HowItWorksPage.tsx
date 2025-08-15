import React from 'react';
import { useTranslation } from 'react-i18next';
import _Button from '../components/ui/Button'

export default function HowItWorksPage() {
  const { t: tFallback } = useTranslation();

  const steps = [
    {
      number: '01',
      title: tFallback('howitworks.step1.title', 'Join Our Club'),
      description: tFallback('howitworks.step1.description', 'Sign up for a subscription plan that matches your wine preferences and budget.'),
      icon: '🍷',
    },
    {
      number: '02',
      title: tFallback('howitworks.step2.title', 'Get Curated Selections'),
      description: tFallback('howitworks.step2.description', 'Receive carefully selected wines from our expert sommeliers, tailored to your taste profile.'),
      icon: '📦',
    },
    {
      number: '03',
      title: tFallback('howitworks.step3.title', 'Discover & Learn'),
      description: tFallback('howitworks.step3.description', 'Enjoy detailed tasting notes, food pairing suggestions, and educational content with each delivery.'),
      icon: '📚',
    },
  ];

  const features = [
    {
      icon: '🎯',
      title: tFallback('howitworks.feature1.title', 'Personalized Selection'),
      description: tFallback('howitworks.feature1.description', 'Our AI-powered system learns your preferences to deliver wines you\'ll love.'),
    },
    {
      icon: '🚚',
      title: tFallback('howitworks.feature2.title', 'Free Shipping'),
      description: tFallback('howitworks.feature2.description', 'All subscriptions include free shipping to your door, with temperature-controlled packaging.'),
    },
    {
      icon: '🔄',
      title: tFallback('howitworks.feature3.title', 'Flexible Plans'),
      description: tFallback('howitworks.feature3.description', 'Skip months, change preferences, or cancel anytime - no long-term commitments.'),
    },
    {
      icon: '👨‍🍳',
      title: tFallback('howitworks.feature4.title', 'Expert Guidance'),
      description: tFallback('howitworks.feature4.description', 'Access to our team of certified sommeliers for personalized recommendations.'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-shell to-porcelain">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-cave mb-6">
            {tFallback('howitworks.hero.title', 'How It Works')}
          </h1>
          <p className="text-xl text-grape-seed max-w-3xl mx-auto mb-8">
            {tFallback('howitworks.hero.subtitle', 'Discover how our wine club makes it easy to explore the world of fine wines')}
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-cave mb-4 text-center">
            {tFallback('howitworks.steps.title', 'Simple 3-Step Process')}
          </h2>
          <p className="text-lg text-grape-seed max-w-2xl mx-auto text-center mb-12">
            {tFallback('howitworks.steps.subtitle', 'From signup to your first delivery, we make the wine journey effortless')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-shell rounded-card p-8 text-center shadow-wc hover:shadow-xl transition-shadow duration-300 relative border border-porcelain">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-champagne rounded-full flex items-center justify-center text-cave font-bold text-lg shadow-wc">
                  {step.number}
                </div>
                <div className="flex items-center justify-center w-16 h-16 bg-champagne/20 rounded-full text-champagne mb-6 mx-auto">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-cave mb-4">
                  {step.title}
                </h3>
                <p className="text-grape-seed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-shell">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-cave mb-4 text-center">
            {tFallback('howitworks.features.title', 'Why Choose Our Wine Club?')}
          </h2>
          <p className="text-lg text-grape-seed max-w-2xl mx-auto text-center mb-12">
            {tFallback('howitworks.features.subtitle', 'Experience the difference with our premium wine subscription service')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-ivory to-shell rounded-card p-8 text-center transition-transform duration-300 hover:scale-105 border border-porcelain shadow-wc">
                <div className="flex items-center justify-center w-16 h-16 bg-champagne rounded-full text-cave mb-6 mx-auto shadow-wc">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-cave mb-4">
                  {feature.title}
                </h3>
                <p className="text-grape-seed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cave to-grape-seed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-ivory mb-4">
            {tFallback('howitworks.cta.title', 'Ready to Start Your Wine Journey?')}
          </h2>
          <p className="text-champagne mb-8 max-w-2xl mx-auto">
            {tFallback('howitworks.cta.subtitle', 'Join thousands of wine enthusiasts who have discovered their perfect wines through our curated selections.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-champagne text-cave px-8 py-4 rounded-lg hover:bg-chablis transition-colors duration-300 font-medium text-lg shadow-wc">
              {tFallback('howitworks.cta.start', 'Start Your Free Trial')}
            </button>
            <button className="border border-champagne text-champagne px-8 py-4 rounded-lg hover:bg-champagne hover:text-cave transition-colors duration-300 font-medium text-lg">
              {tFallback('howitworks.cta.learn', 'Learn More')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 