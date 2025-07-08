import { useAuth } from 'wasp/client/auth';
import { generateCheckoutSession, getCustomerPortalUrl, useQuery } from 'wasp/client/operations';
import { PaymentPlanId, paymentPlans, prettyPaymentPlanName, SubscriptionStatus } from '../../shared/plans';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../cn';

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

interface PaymentPlanCard {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: 'Vineyard Starter',
    price: '$29.99',
    description: 'Perfect for small wine caves getting started',
    features: ['Up to 50 subscribers', 'Basic wine cave management', 'Email support', 'Standard shipping integration'],
  },
  [PaymentPlanId.Pro]: {
    name: 'Wine Master',
    price: '$79.99',
    description: 'Ideal for growing wine subscription businesses',
    features: ['Unlimited subscribers', 'Advanced analytics & insights', 'Loyalty program & referrals', 'Priority support', 'AI wine recommendations', 'Multi-tier subscriptions'],
  },
  [PaymentPlanId.Credits10]: {
    name: 'Shipping Credits',
    price: '$24.99',
    description: 'Additional shipping credits for high-volume periods',
    features: ['10 premium shipping labels', 'Express delivery options', 'International shipping', 'No expiration date'],
  },
};

const PricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const isUserSubscribed =
    !!user && !!user.subscriptionStatus && user.subscriptionStatus !== SubscriptionStatus.Deleted;

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  const navigate = useNavigate();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsPaymentLoading(true);

      const checkoutResults = await generateCheckoutSession(paymentPlanId);

      if (checkoutResults?.sessionUrl) {
        window.open(checkoutResults.sessionUrl, '_self');
      } else {
        throw new Error('Error generating checkout session URL');
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error processing payment. Please try again later.');
      }
      setIsPaymentLoading(false); // We only set this to false here and not in the try block because we redirect to the checkout url within the same window
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (customerPortalUrlError) {
      setErrorMessage('Error fetching Customer Portal URL');
      return;
    }

    if (!customerPortalUrl) {
      setErrorMessage(`Customer Portal does not exist for user ${user.id}`);
      return;
    }

    window.open(customerPortalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-bordeaux-900 mb-6">
            Choose Your Wine Journey
          </h1>
          <p className="text-xl text-bordeaux-700 max-w-3xl mx-auto mb-8">
            Discover the perfect wine subscription plan that matches your taste and lifestyle
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container-xl">
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(PaymentPlanId).map((planId) => (
              <div
                key={planId}
                className={`relative bg-white rounded-2xl p-8 shadow-xl ${
                  planId === bestDealPaymentPlanId ? 'ring-2 ring-bordeaux-600 scale-105' : ''
                }`}
              >
                {planId === bestDealPaymentPlanId && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-bordeaux-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-bordeaux-900 mb-2">
                    {paymentPlanCards[planId].name}
                  </h3>
                  <p className="text-bordeaux-700 mb-6">
                    {paymentPlanCards[planId].description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-bordeaux-900">
                      {paymentPlanCards[planId].price}
                    </span>
                    <span className="text-bordeaux-600">
                      {paymentPlans[planId].effect.kind === 'subscription' && '/month'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {paymentPlanCards[planId].features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-bordeaux-600 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-bordeaux-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isUserSubscribed ? (
                  <button
                    onClick={handleCustomerPortalClick}
                    disabled={isCustomerPortalUrlLoading}
                    aria-describedby='manage-subscription'
                    className={cn(
                      'w-full bg-bordeaux-600 text-white py-3 px-6 rounded-lg hover:bg-bordeaux-700 transition-colors duration-300 font-medium',
                      {
                        'ring-2': planId === bestDealPaymentPlanId,
                        'ring-1': planId !== bestDealPaymentPlanId,
                      }
                    )}
                  >
                    Manage Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyNowClick(planId)}
                    aria-describedby={planId}
                    className={cn(
                      {
                        'bg-bordeaux-600 text-white hover:bg-bordeaux-700':
                          planId === bestDealPaymentPlanId,
                        'text-gray-600  ring-1 ring-inset ring-purple-200 hover:ring-purple-400':
                          planId !== bestDealPaymentPlanId,
                      },
                      {
                        'opacity-50 cursor-wait': isPaymentLoading,
                      },
                      'w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400'
                    )}
                    disabled={isPaymentLoading}
                  >
                    {user ? 'Buy plan' : 'Log in to buy plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-bordeaux-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-bordeaux-900 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-bordeaux-700">
                  Yes, you can cancel your subscription at any time through your account dashboard. No long-term commitments required.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-bordeaux-900 mb-2">
                  Do you ship to all states?
                </h3>
                <p className="text-bordeaux-700">
                  We ship to most US states. Some restrictions apply due to local alcohol laws. Contact us to check availability in your area.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-bordeaux-900 mb-2">
                  Can I skip a month?
                </h3>
                <p className="text-bordeaux-700">
                  Premium members can skip up to 2 months per year. Basic members can pause their subscription for up to 3 months.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-bordeaux-900 mb-2">
                  What if I don't like a wine?
                </h3>
                <p className="text-bordeaux-700">
                  We stand behind our selections. If you're not satisfied with any wine, we'll replace it or credit your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bordeaux-900">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-champagne-100 mb-4">
            Ready to Start Your Wine Journey?
          </h2>
          <p className="text-champagne-200 mb-8 max-w-2xl mx-auto">
            Join thousands of wine enthusiasts who have discovered their perfect wines through our curated selections.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-champagne-500 text-bordeaux-900 px-8 py-4 rounded-lg hover:bg-champagne-400 transition-colors duration-300 font-medium text-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
