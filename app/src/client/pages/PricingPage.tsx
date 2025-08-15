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
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-bordeaux-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Wine Club Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scale your wine club business with our comprehensive platform. 
              Start free and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-bordeaux-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual
                  ? 'bg-bordeaux-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
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
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? 'border-bordeaux-500 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-bordeaux-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-bordeaux-100">
                    <plan.icon className="h-8 w-8 text-bordeaux-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-gray-500 mt-1">
                      Billed annually (${plan.price * 12})
                    </p>
                  )}
                </div>

                {/* The original code had Link components here, but Link is not imported.
                    Assuming the intent was to use a regular anchor tag or a placeholder
                    for a future import, or that the user intended to remove the Link
                    components as they are not used. For now, I'm removing the Link
                    components as they are not imported. */}
                <a
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-bordeaux-600 text-white hover:bg-bordeaux-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mt-6">Not included:</h4>
                    <ul className="space-y-3">
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-500">{feature}</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
            <p className="text-gray-600 mt-2">Compare all features across our plans</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-gray-900">Starter</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-gray-900">Professional</th>
                  <th className="px-8 py-4 text-center text-sm font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-8 py-3">
                        <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      </td>
                    </tr>
                    {category.items.map((item) => (
                      <tr key={item.name} className="hover:bg-gray-50">
                        <td className="px-8 py-4 text-sm text-gray-900">{item.name}</td>
                        <td className="px-8 py-4 text-center">
                          {item.starter ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-8 py-4 text-center">
                          {item.pro ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-8 py-4 text-center">
                          {item.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer custom pricing?
              </h3>
              <p className="text-gray-600">
                Yes, we offer custom pricing for enterprise customers with specific requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Wine Club?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of wine clubs already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-white text-bordeaux-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-bordeaux-600 transition-colors"
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
