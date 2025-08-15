import React from 'react';
import { Check, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';

interface PricingTier {
  name: string;
  description: string;
  price: number;
  frequency: string;
  bottles: number;
  features: string[];
  popular: boolean;
}

interface PricingProps {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export default function Pricing({ title, subtitle, tiers }: PricingProps) {
  return (
    <SectionWrapper background="shell" padding="large">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-cave mb-6">
          {title}
        </h2>
        <p className="text-xl text-grape-seed max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
      
      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier, index) => (
          <div 
            key={index}
            className={`relative bg-ivory/80 backdrop-blur-sm rounded-card border transition-all duration-200 hover:scale-105 ${
              tier.popular 
                ? 'border-champagne shadow-lg ring-2 ring-champagne/20' 
                : 'border-porcelain shadow-wc hover:border-champagne/50'
            }`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-champagne text-cave px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cave mb-2">
                  {tier.name}
                </h3>
                <p className="text-grape-seed mb-4">
                  {tier.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-cave">
                    €{tier.price}
                  </span>
                  <span className="text-grape-seed">
                    /{tier.frequency}
                  </span>
                </div>
                <div className="text-sm text-grape-seed">
                  {tier.bottles} premium bottles included
                </div>
              </div>
              
              {/* Features */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-champagne mt-0.5 flex-shrink-0" />
                    <span className="text-grape-seed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <Link
                to="/signup"
                className={`block w-full text-center font-semibold px-6 py-4 rounded-full transition-all duration-200 ${
                  tier.popular
                    ? 'bg-champagne hover:bg-chablis text-cave shadow-md hover:shadow-lg'
                    : 'bg-ivory hover:bg-champagne/20 text-cave border border-porcelain hover:border-champagne'
                }`}
              >
                Start {tier.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom note */}
      <div className="text-center mt-12">
        <p className="text-grape-seed">
          All plans include free shipping, expert curation, and 30-day satisfaction guarantee
        </p>
      </div>
    </SectionWrapper>
  );
}
