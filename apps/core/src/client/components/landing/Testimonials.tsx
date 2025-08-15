import React from 'react';
import { Star, Quote } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  rating: number;
}

interface TestimonialsProps {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

export default function Testimonials({ title, subtitle, items }: TestimonialsProps) {
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
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-shell/80 backdrop-blur-sm rounded-card border border-porcelain p-8 hover:shadow-wc transition-all duration-200"
          >
            {/* Quote Icon */}
            <div className="mb-6">
              <Quote className="h-8 w-8 text-champagne" />
            </div>
            
            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-champagne fill-current" />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote className="text-grape-seed mb-6 leading-relaxed text-lg">
              "{testimonial.quote}"
            </blockquote>
            
            {/* Author */}
            <div className="border-t border-porcelain pt-6">
              <div className="font-semibold text-cave">
                {testimonial.author}
              </div>
              <div className="text-grape-seed text-sm">
                {testimonial.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
