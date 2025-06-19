import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getMyWineSubscriptions, getPublicWineCaves } from 'wasp/client/operations';

const WineSubscriptionsPage = () => {
  const { data: mySubscriptions, isLoading: isLoadingMy } = useQuery(getMyWineSubscriptions);
  const { data: publicWineCaves, isLoading: isLoadingPublic } = useQuery(getPublicWineCaves);

  if (isLoadingMy || isLoadingPublic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* My Subscriptions Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">My Wine Subscriptions</h1>
        
        {mySubscriptions && mySubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mySubscriptions.map((subscription: any) => (
              <div key={subscription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {subscription.wineCave.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {subscription.subscriptionTier.name} - €{subscription.subscriptionTier.price}/month
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📦 {subscription.subscriptionTier.bottlesPerMonth} bottles per month
                  </p>
                  {subscription.nextShipmentDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      📅 Next shipment: {new Date(subscription.nextShipmentDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded text-sm">
                    Manage
                  </button>
                  <Link 
                    to={`/wine-caves/${subscription.wineCave.id}`}
                    className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                  >
                    View Cave
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You don't have any active wine subscriptions yet.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Browse wine caves below to start your wine journey! 🍷
            </p>
          </div>
        )}
      </div>

      {/* Browse Wine Caves Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Discover Wine Caves</h2>
        
        {publicWineCaves && publicWineCaves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicWineCaves.map((cave: any) => (
              <div key={cave.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {cave.logoUrl && (
                  <img 
                    src={cave.logoUrl} 
                    alt={cave.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{cave.name}</h3>
                    <span className="text-sm text-gray-500">
                      {cave._count.subscriptions} members
                    </span>
                  </div>
                  
                  {cave.location && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">📍 {cave.location}</p>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {cave.description}
                  </p>

                  {/* Subscription Tiers */}
                  {cave.subscriptionTiers && cave.subscriptionTiers.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subscription Plans:
                      </p>
                      <div className="space-y-1">
                        {cave.subscriptionTiers.slice(0, 2).map((tier: any) => (
                          <div key={tier.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{tier.name}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              €{tier.price}/mo
                            </span>
                          </div>
                        ))}
                        {cave.subscriptionTiers.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{cave.subscriptionTiers.length - 2} more plans
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sample Wines */}
                  {cave.wines && cave.wines.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Featured Wines:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cave.wines.slice(0, 3).map((wine: any) => (
                          <span key={wine.id} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {wine.name} {wine.vintage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link 
                      to={`/wine-caves/${cave.id}/subscribe`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded text-center text-sm font-medium"
                    >
                      Subscribe
                    </Link>
                    <Link 
                      to={`/wine-caves/${cave.id}`}
                      className="flex-1 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded text-center text-sm font-medium"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              No wine caves are currently available for subscription.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WineSubscriptionsPage; 