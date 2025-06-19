import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useAction } from 'wasp/client/operations';
import { getPublicWineCaves, createWineSubscription } from 'wasp/client/operations';

const SubscribeToWineCavePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: wineCaves, isLoading } = useQuery(getPublicWineCaves);
  const createSubscriptionAction = useAction(createWineSubscription);
  
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Find the specific wine cave
  const wineCave = wineCaves?.find(cave => cave.id === id);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTierId || !deliveryAddress.trim()) {
      setError('Please select a subscription tier and provide a delivery address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await createSubscriptionAction({
        wineCaveId: id!,
        subscriptionTierId: selectedTierId,
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      });

      alert('Successfully subscribed to wine cave! 🍷');
      navigate('/subscriptions');
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!wineCave) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Wine Cave Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The wine cave you're looking for doesn't exist or is no longer available.
          </p>
          <button 
            onClick={() => navigate('/subscriptions')}
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded"
          >
            Browse Other Wine Caves
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Wine Cave Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/subscriptions')}
            className="text-yellow-600 hover:text-yellow-700 mr-4"
          >
            ← Back to Browse
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            {wineCave.logoUrl && (
              <img 
                src={wineCave.logoUrl} 
                alt={wineCave.name} 
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
                Subscribe to {wineCave.name}
              </h1>
              {wineCave.location && (
                <p className="text-gray-600 dark:text-gray-300 mb-2">📍 {wineCave.location}</p>
              )}
              <p className="text-gray-600 dark:text-gray-300">
                {wineCave.description}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {wineCave._count.subscriptions} members already subscribed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Choose Your Plan</h2>
          
          {wineCave.subscriptionTiers && wineCave.subscriptionTiers.length > 0 ? (
            <div className="space-y-4">
              {wineCave.subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTierId === tier.id
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTierId(tier.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tier.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tier.description}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                        📦 {tier.bottlesPerMonth} bottles per month
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        €{tier.price}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <input
                    type="radio"
                    name="subscriptionTier"
                    value={tier.id}
                    checked={selectedTierId === tier.id}
                    onChange={() => setSelectedTierId(tier.id)}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              No subscription plans available for this wine cave.
            </div>
          )}
        </div>

        {/* Subscription Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Delivery Information</h2>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Address *
              </label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your full delivery address..."
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Your phone number (optional)"
              />
            </div>

            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Instructions
              </label>
              <textarea
                id="deliveryInstructions"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Any special delivery instructions (optional)"
              />
            </div>

            {/* Selected Plan Summary */}
            {selectedTierId && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Selected Plan:</h3>
                {(() => {
                  const selectedTier = wineCave.subscriptionTiers?.find(tier => tier.id === selectedTierId);
                  return selectedTier ? (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedTier.name} - €{selectedTier.price}/month
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedTier.bottlesPerMonth} bottles delivered monthly
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !selectedTierId || !deliveryAddress.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Creating Subscription...' : 'Subscribe Now 🍷'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your first shipment will be scheduled for the beginning of next month. 
              You can manage your subscription anytime from your account.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscribeToWineCavePage; 