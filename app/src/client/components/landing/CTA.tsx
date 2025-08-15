import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';

interface CTAProps {
  title: string;
  subtitle: string;
  benefits: string[];
  button: string;
}

export default function CTA({ title, subtitle, benefits, button }: CTAProps) {
  return (
    <SectionWrapper background="shell" padding="large">
      <div className="text-center max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-cave mb-6">
          {title}
        </h2>
        <p className="text-xl text-grape-seed mb-12">
          {subtitle}
        </p>
        
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <Check className="h-5 w-5 text-champagne flex-shrink-0" />
              <span className="text-grape-seed">{benefit}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            to="/signup"
            className="bg-champagne hover:bg-chablis text-cave font-bold px-12 py-5 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg"
          >
            {button}
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-8 text-sm text-grape-seed">
          Join 15,000+ wine enthusiasts • Cancel anytime • No commitment
        </div>
      </div>
    </SectionWrapper>
  );
}
