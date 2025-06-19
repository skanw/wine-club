import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getWineCaves } from 'wasp/client/operations';

const AnalyticsDashboardPage = () => {
  const { data: wineCaves, isLoading, error } = useQuery(getWineCaves);

  // Calculate analytics across all wine caves
  const analytics = React.useMemo(() => {
    if (!wineCaves) return null;

    const totalSubscribers = wineCaves.reduce((sum, cave: any) => sum + (cave._count?.subscriptions || 0), 0);
    const totalWineCaves = wineCaves.length;
    const totalWines = wineCaves.reduce((sum, cave: any) => sum + (cave.wines?.length || 0), 0);
    const totalTiers = wineCaves.reduce((sum, cave: any) => sum + (cave.subscriptionTiers?.length || 0), 0);

    // Calculate estimated monthly revenue
    const monthlyRevenue = wineCaves.reduce((sum, cave: any) => {
      return sum + (cave.subscriptionTiers?.reduce((tierSum: number, tier: any) => {
        // Estimate subscriptions per tier (simplified calculation)
        const subscribersPerTier = Math.floor((cave._count?.subscriptions || 0) / (cave.subscriptionTiers?.length || 1));
        return tierSum + (tier.price * subscribersPerTier);
      }, 0) || 0);
    }, 0);

    return {
      totalSubscribers,
      totalWineCaves,
      totalWines,
      totalTiers,
      monthlyRevenue
    };
  }, [wineCaves]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading analytics: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">Wine Cave Analytics</h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalSubscribers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                €{analytics?.monthlyRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">🍷</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Wine Caves</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalWineCaves || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🍾</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Wines</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalWines || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wine Caves Performance */}
      {wineCaves && wineCaves.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wine Caves List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Wine Cave Performance</h2>
            <div className="space-y-4">
                           {wineCaves.map((cave: any) => (
               <div key={cave.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                 <div>
                   <h3 className="font-medium text-gray-900 dark:text-white">{cave.name}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-300">
                     {cave.subscriptionTiers?.length || 0} tiers • {cave.wines?.length || 0} wines
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-lg font-bold text-gray-900 dark:text-white">
                     {cave._count?.subscriptions || 0}
                   </p>
                   <p className="text-sm text-gray-600 dark:text-gray-300">subscribers</p>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Top Subscription Tiers */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Popular Subscription Tiers</h2>
           <div className="space-y-4">
             {wineCaves.flatMap((cave: any) => 
               cave.subscriptionTiers?.map((tier: any) => ({
                 ...tier,
                 caveName: cave.name,
                 subscriberCount: Math.floor((cave._count?.subscriptions || 0) / (cave.subscriptionTiers?.length || 1))
               })) || []
             )
                .sort((a, b) => b.subscriberCount - a.subscriberCount)
                .slice(0, 5)
                .map((tier, index) => (
                  <div key={tier.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {tier.name} - {tier.caveName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        €{tier.price}/month • {tier.bottlesPerMonth} bottles
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        ~{tier.subscriberCount} subs
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {wineCaves && wineCaves.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No Data Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create your first wine cave to start seeing analytics and insights.
          </p>
          <a 
            href="/wine-caves/create"
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Wine Cave
          </a>
        </div>
      )}

      {/* Quick Stats Summary */}
      {analytics && analytics.totalWineCaves > 0 && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Business Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.totalSubscribers > 0 ? (analytics.monthlyRevenue / analytics.totalSubscribers).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Revenue per Subscriber</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.totalWineCaves > 0 ? (analytics.totalWines / analytics.totalWineCaves).toFixed(1) : '0'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Wines per Cave</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.totalWineCaves > 0 ? (analytics.totalSubscribers / analytics.totalWineCaves).toFixed(1) : '0'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Subscribers per Cave</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPage; 