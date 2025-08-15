import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Shield, Users, BarChart3 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [_billingCycle, _setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isAnnual, setIsAnnual] = useState(false);
  const { t: _t } = useTranslation();

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small wine clubs just getting started',
      price: isAnnual ? 29 : 39,
      originalPrice: isAnnual ? 39 : 39,
      features: [
        'Up to 50 members',
        'Basic inventory management',
        'Email support',
        'Standard reporting',
        'Mobile app access',
        'Basic integrations'
      ],
      notIncluded: [
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: false,
      icon: Users
    },
    {
      name: 'Professional',
      description: 'Ideal for growing wine clubs with advanced needs',
      price: isAnnual ? 79 : 99,
      originalPrice: isAnnual ? 99 : 99,
      features: [
        'Up to 500 members',
        'Advanced inventory management',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Automated shipping',
        'Member portal'
      ],
      notIncluded: [
        'White-label solution',
        'Dedicated account manager',
        'Custom integrations'
      ],
      cta: 'Start Free Trial',
      popular: true,
      icon: BarChart3
    },
    {
      name: 'Enterprise',
      description: 'For large wine clubs with complex requirements',
      price: isAnnual ? 199 : 249,
      originalPrice: isAnnual ? 249 : 249,
      features: [
        'Unlimited members',
        'White-label solution',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee',
        'Custom reporting',
        'Multi-location support'
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
      icon: Shield
    }
  ];

  const features = [
    {
      category: 'Member Management',
      items: [
        { name: 'Member profiles', starter: true, pro: true, enterprise: true },
        { name: 'Subscription management', starter: true, pro: true, enterprise: true },
        { name: 'Member portal', starter: false, pro: true, enterprise: true },
        { name: 'Advanced segmentation', starter: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Inventory & Operations',
      items: [
        { name: 'Wine inventory tracking', starter: true, pro: true, enterprise: true },
        { name: 'Automated shipping', starter: false, pro: true, enterprise: true },
        { name: 'Multi-location support', starter: false, pro: false, enterprise: true },
        { name: 'Supplier management', starter: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Analytics & Reporting',
      items: [
        { name: 'Basic reports', starter: true, pro: true, enterprise: true },
        { name: 'Advanced analytics', starter: false, pro: true, enterprise: true },
        { name: 'Custom dashboards', starter: false, pro: true, enterprise: true },
        { name: 'Predictive insights', starter: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'Email support', starter: true, pro: true, enterprise: true },
        { name: 'Priority support', starter: false, pro: true, enterprise: true },
        { name: 'Dedicated manager', starter: false, pro: false, enterprise: true },
        { name: 'SLA guarantee', starter: false, pro: false, enterprise: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-shell to-porcelain">
      {/* Header */}
      <div className="bg-shell shadow-wc border-b border-porcelain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cave mb-4">
              Choose Your Wine Club Plan
            </h1>
            <p className="text-xl text-grape-seed max-w-3xl mx-auto">
              Scale your wine club business with our comprehensive platform. 
              Start free and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-shell rounded-card p-1 shadow-wc border border-porcelain">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-champagne text-cave'
                  : 'text-grape-seed hover:text-cave'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual
                  ? 'bg-champagne text-cave'
                  : 'text-grape-seed hover:text-cave'
              }`}
            >
              Annual
              <span className="ml-1 bg-chablis text-cave text-xs px-2 py-1 rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-shell rounded-card shadow-wc border-2 p-8 ${
                plan.popular
                  ? 'border-champagne scale-105'
                  : 'border-porcelain hover:border-champagne'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-champagne text-cave px-4 py-1 rounded-full text-sm font-medium shadow-wc">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-champagne/20">
                    <plan.icon className="h-8 w-8 text-champagne" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-cave mb-2">{plan.name}</h3>
                <p className="text-grape-seed mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-cave">${plan.price}</span>
                    <span className="text-grape-seed ml-2">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-grape-seed mt-1">
                      Billed annually (${plan.price * 12})
                    </p>
                  )}
                </div>

                <a
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-champagne text-cave hover:bg-chablis'
                      : 'bg-ivory text-cave hover:bg-champagne hover:text-cave'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-cave">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-champagne mr-3 flex-shrink-0" />
                      <span className="text-grape-seed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="font-semibold text-cave mt-6">Not included:</h4>
                    <ul className="space-y-3">
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <X className="h-5 w-5 text-porcelain mr-3 flex-shrink-0" />
                          <span className="text-grape-seed opacity-60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-shell rounded-card shadow-wc border border-porcelain overflow-hidden">
          <div className="px-8 py-6 border-b border-porcelain">
            <h2 className="text-2xl font-bold text-cave">Feature Comparison</h2>
            <p className="text-grape-seed mt-2">Compare all features across our plans</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-medium text-cave">Feature</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-cave">Starter</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-cave">Professional</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-cave">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-porcelain">
                {features.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-ivory">
                      <td colSpan={4} className="px-8 py-3">
                        <h3 className="font-semibold text-cave">{category.category}</h3>
                      </td>
                    </tr>
                    {category.items.map((item) => (
                      <tr key={item.name} className="hover:bg-ivory/50">
                        <td className="px-8 py-4 text-sm text-cave">{item.name}</td>
                        <td className="px-8 py-4 text-center">
                          {item.starter ? (
                            <Check className="h-5 w-5 text-champagne mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-porcelain mx-auto" />
                          )}
                        </td>
                        <td className="px-8 py-4 text-center">
                          {item.pro ? (
                            <Check className="h-5 w-5 text-champagne mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-porcelain mx-auto" />
                          )}
                        </td>
                        <td className="px-8 py-4 text-center">
                          {item.enterprise ? (
                            <Check className="h-5 w-5 text-champagne mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-porcelain mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-cave text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cave mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-grape-seed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cave mb-2">
                Is there a free trial?
              </h3>
              <p className="text-grape-seed">
                All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cave mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-grape-seed">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cave mb-2">
                Do you offer custom pricing?
              </h3>
              <p className="text-grape-seed">
                Yes, we offer custom pricing for enterprise customers with specific requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cave to-grape-seed rounded-card p-12 text-ivory shadow-wc">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Wine Club?</h2>
            <p className="text-xl mb-8 text-champagne">
              Join thousands of wine clubs already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-champagne text-cave px-8 py-3 rounded-lg font-semibold hover:bg-chablis transition-colors shadow-wc"
              >
                Start Free Trial
              </a>
              <a
                href="/contact"
                className="border-2 border-champagne text-champagne px-8 py-3 rounded-lg font-semibold hover:bg-champagne hover:text-cave transition-colors"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
