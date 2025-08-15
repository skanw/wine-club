import React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Owner, Château Bordeaux",
    company: "Bordeaux, France",
    content: "WineClub Pro transformed our wine club operations. The member management is seamless, and our customers love the automated shipping notifications. Revenue increased by 40% in the first year.",
    rating: 5,
    avatar: "🍷"
  },
  {
    id: 2,
    name: "Antonio Rossi",
    role: "Sommelier & Founder",
    company: "Vino Italiano Club",
    content: "The analytics and insights helped us understand our members' preferences better than ever. The platform is intuitive and the support team is incredibly responsive.",
    rating: 5,
    avatar: "🍇"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Wine Director",
    company: "Napa Valley Wines",
    content: "From inventory management to customer communications, everything is streamlined. Our members appreciate the personalized experience, and we love the automated workflows.",
    rating: 5,
    avatar: "🍷"
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    role: "Owner",
    company: "Mendoza Wine Club",
    content: "The platform's security features give us peace of mind, and the multi-language support helps us serve our international members. Highly recommended for any wine business.",
    rating: 5,
    avatar: "🍷"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const titleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 0
  });

  const testimonialsReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 200
  });

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-champagne-50 to-bordeaux-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div 
            ref={titleReveal.ref}
            className="inline-flex items-center px-4 py-2 bg-bordeaux-50 text-bordeaux-700 rounded-full text-sm font-semibold mb-6 border border-bordeaux-100"
          >
            <Star className="h-4 w-4 mr-2 text-bordeaux-600" />
            Trusted by Wine Professionals Worldwide
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-6 font-serif">
            What Our Customers Say
          </h2>
          
          <p className="text-lg text-warm-taupe-700 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of successful wine clubs who have transformed their business with WineClub Pro
          </p>
        </div>

        <div 
          ref={testimonialsReveal.ref}
          className="relative max-w-4xl mx-auto"
        >
          {/* Testimonial Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-bordeaux-100 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-bordeaux-200">
              <Quote className="h-12 w-12" />
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-lg md:text-xl text-bordeaux-900 leading-relaxed mb-8 italic">
              "{currentTestimonial.content}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-full flex items-center justify-center text-xl mr-4">
                {currentTestimonial.avatar}
              </div>
              <div>
                <div className="font-semibold text-bordeaux-900">
                  {currentTestimonial.name}
                </div>
                <div className="text-sm text-warm-taupe-600">
                  {currentTestimonial.role}
                </div>
                <div className="text-sm text-bordeaux-600 font-medium">
                  {currentTestimonial.company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-bordeaux-200 hover:bg-bordeaux-50 hover:border-bordeaux-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-bordeaux-700" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-bordeaux-600 scale-125' 
                      : 'bg-bordeaux-200 hover:bg-bordeaux-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-bordeaux-200 hover:bg-bordeaux-50 hover:border-bordeaux-300 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 text-bordeaux-700" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-bordeaux-900 mb-2">98%</div>
            <div className="text-warm-taupe-600">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-bordeaux-900 mb-2">24/7</div>
            <div className="text-warm-taupe-600">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-bordeaux-900 mb-2">500+</div>
            <div className="text-warm-taupe-600">Happy Wine Clubs</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 