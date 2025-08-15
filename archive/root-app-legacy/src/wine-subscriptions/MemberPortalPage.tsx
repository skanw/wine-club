import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getMyWineSubscriptions, updateWineSubscription } from 'wasp/client/operations';

const MemberPortalPage = () => {
  const { data: subscriptions, isLoading, error } = useQuery(getMyWineSubscriptions);
  const updateSubscriptionAction = useAction(updateWineSubscription);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      setUpdatingId(subscriptionId);
      await updateSubscriptionAction({ id: subscriptionId, status: newStatus });
      setMessage({ type: 'success', text: `Subscription ${newStatus} successfully` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update subscription' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your subscriptions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading subscriptions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">My Wine Subscriptions</h1>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
          <button 
            onClick={() => setMessage(null)}
            className="ml-4 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-6">
          {subscriptions.map((subscription: any) => (
            <div key={subscription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Subscription Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {subscription.wineCave.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {subscription.subscriptionTier.name} Plan - €{subscription.subscriptionTier.price}/month
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : subscription.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.status}
                </span>
              </div>

              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Subscription Details</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>📦 {subscription.subscriptionTier.bottlesPerMonth} bottles per month</li>
                    <li>📅 Started: {new Date(subscription.startDate).toLocaleDateString()}</li>
                    {subscription.nextShipmentDate && (
                      <li>🚚 Next shipment: {new Date(subscription.nextShipmentDate).toLocaleDateString()}</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Delivery Address</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>{subscription.deliveryAddress}</p>
                    {subscription.phoneNumber && (
                      <p className="mt-1">📞 {subscription.phoneNumber}</p>
                    )}
                    {subscription.deliveryInstructions && (
                      <p className="mt-1 italic">Note: {subscription.deliveryInstructions}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Shipments */}
              {subscription.shipments && subscription.shipments.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Recent Shipments</h3>
                  <div className="space-y-2">
                    {subscription.shipments.slice(0, 3).map((shipment: any) => (
                      <div key={shipment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(shipment.shipmentDate).toLocaleDateString()}
                          </p>
                          {shipment.items && shipment.items.length > 0 && (
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {shipment.items.map((item: any) => item.wine.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            shipment.status === 'delivered' 
                              ? 'bg-green-100 text-green-700'
                              : shipment.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {shipment.status}
                          </span>
                          {shipment.trackingNumber && (
                            <p className="text-xs text-gray-500 mt-1">
                              Tracking: {shipment.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {subscription.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(subscription.id, 'paused')}
                    disabled={updatingId === subscription.id}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                  >
                    {updatingId === subscription.id ? 'Updating...' : 'Pause Subscription'}
                  </button>
                )}
                
                {subscription.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(subscription.id, 'active')}
                    disabled={updatingId === subscription.id}
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                  >
                    {updatingId === subscription.id ? 'Updating...' : 'Resume Subscription'}
                  </button>
                )}
                
                <button
                  onClick={() => handleStatusChange(subscription.id, 'cancelled')}
                  disabled={updatingId === subscription.id}
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                >
                  {updatingId === subscription.id ? 'Updating...' : 'Cancel Subscription'}
                </button>
                
                <button className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded text-sm">
                  Update Delivery Info
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍷</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No Active Subscriptions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have any wine subscriptions yet. Discover amazing wine caves and start your wine journey!
          </p>
          <a 
            href="/subscriptions"
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Wine Caves
          </a>
        </div>
      )}
    </div>
  );
};

export default MemberPortalPage; 