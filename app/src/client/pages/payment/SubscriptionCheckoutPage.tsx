import React, { useState } from 'react'
import { useTranslation as _useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Phone, Wine } from 'lucide-react';

export default function SubscriptionCheckoutPage() {
  const { subscriptionTierId: _subscriptionTierId, wineCaveId } = useParams<{ subscriptionTierId: string; wineCaveId: string }>();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryInstructions: '',
    phoneNumber: '',
  });

  // Temporary stub data
  const subscriptionTier = {
    name: 'Premium Wine Subscription',
    description: 'Curated selection of premium wines',
    price: 89.99,
    currency: 'EUR',
    billingCycle: 'monthly',
    winesPerShipment: 3,
    shippingIncluded: true
  };
  const loadingTier = false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Integrate with createCheckoutSessionFn when ready
      // const result = await createCheckoutSessionFn({
      //   subscriptionTierId,
      //   wineCaveId,
      //   successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      //   cancelUrl: `${window.location.origin}/wine-cave/${wineCaveId}`,
      // });

      // Redirect to Stripe Checkout
      // const stripe = await stripePromise;
      // if (stripe && result?.sessionId) {
      //   const { error } = await stripe.redirectToCheckout({
      //     sessionId: result.sessionId,
      //   });
      //   if (error) {
      //     console.error('Stripe checkout error:', error);
      //   }
      // }
      
      // Temporary redirect
      alert('Checkout functionality coming soon!');
    } catch (error) {
      // TODO: Show user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingTier) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!subscriptionTier) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Subscription Not Found</h2>
          <p className="text-gray-600 mb-6">The subscription tier you're looking for doesn't exist.</p>
          <button
            onClick={() => history(`/wine-cave/${wineCaveId}`)}
            className="btn-primary"
          >
            Back to Wine Cave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-bordeaux-900 mb-2">Complete Your Subscription</h1>
            <p className="text-gray-600">Join our exclusive wine club and start your journey</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Wine className="text-bordeaux-600" size={24} />
              <h2 className="text-xl font-semibold text-bordeaux-900">{subscriptionTier?.name || 'Subscription Tier'}</h2>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-700">{subscriptionTier?.description || 'Premium wine subscription'}</p>
              
              <div className="flex justify-between items-center py-3 border-t border-gray-100">
                <span className="font-medium">Price:</span>
                <span className="text-2xl font-bold text-bordeaux-600">
                  {subscriptionTier?.price || 0} {subscriptionTier?.currency || 'EUR'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Billing Cycle:</span>
                <span className="text-gray-600 capitalize">{subscriptionTier?.billingCycle || 'monthly'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Wines per Shipment:</span>
                <span className="text-gray-600">{subscriptionTier?.winesPerShipment || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Shipping:</span>
                <span className="text-gray-600">
                  {subscriptionTier?.shippingIncluded ? 'Included' : 'Additional'}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="card">
            <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">What's Included</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                <span>Curated selection of premium wines</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                <span>Expert sommelier recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                <span>Detailed tasting notes and food pairings</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                <span>Flexible delivery scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                <span>Exclusive member events and tastings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-bordeaux-900 mb-6">Delivery Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-1" size={16} />
                Delivery Address *
              </label>
              <textarea
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                rows={3}
                placeholder="Enter your complete delivery address"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-1" size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="+33 1 23 45 67 89"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions
              </label>
              <textarea
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({...formData, deliveryInstructions: e.target.value})}
                rows={2}
                placeholder="Any special delivery instructions (optional)"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="mr-2" size={20} />
                  Complete Subscription - €{subscriptionTier?.price || 0}
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 