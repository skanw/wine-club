import React from 'react';
import { Wine, Package, Star, Users } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title: string;
  subtitle: string;
  items: Feature[];
}

const iconMap = {
  Wine,
  Package,
  Star,
  Users,
};

export default function Features({ title, subtitle, items }: FeaturesProps) {
  return (
    <SectionWrapper background="ivory" padding="large">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-cave mb-6">
          {title}
        </h2>
        <p className="text-xl text-grape-seed max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((feature, index) => {
          const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
          const staggerClass = `animate-stagger-${Math.min(index + 1, 4)}`;
          
          return (
            <div 
              key={index}
              className={`text-center group animate-fade-in ${staggerClass}`}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-champagne/20 rounded-card border border-champagne/30 mb-6 group-hover:bg-champagne/30 transition-all duration-200">
                <IconComponent className="h-8 w-8 text-grape-seed" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-cave mb-4">
                {feature.title}
              </h3>
              <p className="text-grape-seed leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
