import React from 'react';
import { Check, X, Star, Zap, Crown, Users } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Button from './ui/Button';

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    description: "Perfect for small wine clubs just getting started",
    icon: <Users className="h-6 w-6" />,
    features: [
      "Up to 100 members",
      "Basic member management",
      "Email notifications",
      "Standard shipping labels",
      "Basic analytics",
      "Email support"
    ],
    notIncluded: [
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "API access",
      "White-label options"
    ],
    popular: false,
    cta: "Start Free Trial",
    ctaVariant: "secondary" as const
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Ideal for growing wine clubs with advanced needs",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Up to 500 members",
      "Advanced member management",
      "Automated workflows",
      "Priority shipping",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "API access"
    ],
    notIncluded: [
      "White-label options",
      "Dedicated account manager"
    ],
    popular: true,
    cta: "Start Free Trial",
    ctaVariant: "primary" as const
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "For large wine clubs with enterprise requirements",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Unlimited members",
      "Enterprise member management",
      "Custom workflows",
      "Express shipping",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "API access",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations"
    ],
    notIncluded: [],
    popular: false,
    cta: "Contact Sales",
    ctaVariant: "secondary" as const
  }
];

const PricingSection = () => {
  const titleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 0
  });

  const plansReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 200
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div 
            ref={titleReveal.ref}
            className="inline-flex items-center px-4 py-2 bg-bordeaux-50 text-bordeaux-700 rounded-full text-sm font-semibold mb-6 border border-bordeaux-100"
          >
            <Star className="h-4 w-4 mr-2 text-bordeaux-600" />
            Simple, Transparent Pricing
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-6 font-serif">
            Choose Your Perfect Plan
          </h2>
          
          <p className="text-lg text-warm-taupe-700 max-w-2xl mx-auto leading-relaxed">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div 
          ref={plansReveal.ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-bordeaux-500 shadow-lg scale-105' 
                  : 'border-bordeaux-100 hover:border-bordeaux-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-xl flex items-center justify-center mx-auto mb-4 text-bordeaux-600">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-bordeaux-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-warm-taupe-600 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-bordeaux-900">
                    {plan.price}
                  </span>
                  <span className="text-warm-taupe-600 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-bordeaux-900 mb-4">What's included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-warm-taupe-700">{feature}</span>
                  </div>
                ))}
                
                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="font-semibold text-bordeaux-900 mb-4 mt-6">Not included:</h4>
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-warm-taupe-500 line-through">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button
                  to={plan.cta === "Contact Sales" ? "/contact" : "/signup"}
                  variant={plan.ctaVariant}
                  size="lg"
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 hover:from-bordeaux-700 hover:to-bordeaux-800' 
                      : ''
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-champagne-50 to-bordeaux-50 rounded-2xl p-8 border border-bordeaux-100">
            <h3 className="text-2xl font-bold text-bordeaux-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 