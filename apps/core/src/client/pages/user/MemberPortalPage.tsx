import { useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery } from 'wasp/client/operations';
import { getUserSubscriptions, getSubscriptionDetails, getSubscriptionAnalytics } from 'wasp/client/operations';
import { getUserLoyaltyHistory, getReferralHistory, getLoyaltyRewards } from 'wasp/client/operations';
import { generateWineRecommendations } from 'wasp/client/operations';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import SubscriptionDetailsModal from '../../components/subscription/SubscriptionDetailsModal';
import ShipmentTracking from '../../components/subscription/ShipmentTracking';
import { 
  Wine, 
  Star, 
  Gift, 
  Users, 
  CreditCard, 
  Settings, 
  Heart,
  Calendar,
  Package,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';

export default function MemberPortalPage() {
  const { data: user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: subscriptions, isLoading: subscriptionsLoading, refetch: refetchSubscriptions } = useQuery(getUserSubscriptions);
  const { data: loyaltyHistory, isLoading: loyaltyLoading } = useQuery(getUserLoyaltyHistory, { userId: user?.id || '' });
  const { data: referralHistory, isLoading: referralLoading } = useQuery(getReferralHistory, { userId: user?.id || '' });
  const { data: loyaltyRewards, isLoading: rewardsLoading } = useQuery(getLoyaltyRewards, { userId: user?.id || '' });
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery(generateWineRecommendations, { 
    memberId: user?.id || '', 
    limit: 5 
  });

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleSubscriptionUpdate = () => {
    refetchSubscriptions();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bordeaux-900">Please log in to access your member portal</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bordeaux-50 via-champagne-50 to-bordeaux-100">
      {/* Background Blurred Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bordeaux-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-champagne-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bordeaux-300 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-bordeaux-900 mb-2">Welcome back, {user.username || user.email}!</h1>
          <p className="text-xl text-bordeaux-700">Manage your wine subscriptions and preferences</p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Wine className="h-4 w-4 text-bordeaux-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bordeaux-900">
                  {subscriptions?.filter(sub => sub.status === 'active').length || 0}
                </div>
                <p className="text-xs text-bordeaux-600">Wine clubs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                <Star className="h-4 w-4 text-bordeaux-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bordeaux-900">
                  {user.loyaltyPoints || 0}
                </div>
                <p className="text-xs text-bordeaux-600">Available points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Package className="h-4 w-4 text-bordeaux-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bordeaux-900">
                  {subscriptions?.reduce((total, sub) => total + (sub.shipments?.length || 0), 0) || 0}
                </div>
                <p className="text-xs text-bordeaux-600">Wines received</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <Users className="h-4 w-4 text-bordeaux-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-bordeaux-900">
                  {referralHistory?.filter(ref => ref.status === 'completed').length || 0}
                </div>
                <p className="text-xs text-bordeaux-600">Successful referrals</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest wine club activity</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions?.slice(0, 3).map((subscription) => (
                  <div key={subscription.id} className="flex items-center space-x-4 py-2">
                    <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{subscription.wineCave.name}</p>
                      <p className="text-xs text-bordeaux-600">
                        {subscription.subscriptionTier.name} • {subscription.status}
                      </p>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem Rewards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {subscriptionsLoading ? (
              <div className="text-center py-8">Loading subscriptions...</div>
            ) : subscriptions?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Wine className="mx-auto h-12 w-12 text-bordeaux-300 mb-4" />
                  <h3 className="text-lg font-medium text-bordeaux-900 mb-2">No subscriptions yet</h3>
                  <p className="text-bordeaux-600 mb-4">Start exploring wine clubs to find your perfect match</p>
                  <Button>Discover Wine Clubs</Button>
                </CardContent>
              </Card>
            ) : (
              subscriptions?.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{subscription.wineCave.name}</CardTitle>
                        <CardDescription>
                          {subscription.subscriptionTier.name} • {subscription.subscriptionTier.bottlesPerMonth} bottles/month
                        </CardDescription>
                      </div>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-bordeaux-600" />
                        <span className="text-sm">
                          Next shipment: {subscription.nextShipmentDate ? 
                            new Date(subscription.nextShipmentDate).toLocaleDateString() : 
                            'Not scheduled'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-bordeaux-600" />
                        <span className="text-sm">
                          Total shipments: {subscription.shipments?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-bordeaux-600" />
                        <span className="text-sm">
                          Member since: {new Date(subscription.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(subscription)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setIsDetailsModalOpen(true);
                          // Set modal to preferences tab
                          setTimeout(() => {
                            const preferencesTab = document.querySelector('[data-tab="preferences"]') as HTMLElement;
                            if (preferencesTab) preferencesTab.click();
                          }, 100);
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          {subscriptionsLoading ? (
            <div className="text-center py-8">Loading shipments...</div>
          ) : subscriptions?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-bordeaux-300 mb-4" />
                <h3 className="text-lg font-medium text-bordeaux-900 mb-2">No shipments yet</h3>
                <p className="text-bordeaux-600 mb-4">Your shipments will appear here once you have active subscriptions</p>
                <Button>Discover Wine Clubs</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {subscriptions?.map((subscription) => (
                <div key={subscription.id}>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-bordeaux-900">
                      {subscription.wineCave.name} - Shipments
                    </h3>
                    <p className="text-sm text-bordeaux-600">
                      {subscription.subscriptionTier.name} • {subscription.status}
                    </p>
                  </div>
                  <ShipmentTracking 
                    shipments={subscription.shipments || []} 
                    subscriptionId={subscription.id} 
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wine Preferences</CardTitle>
              <CardDescription>Customize your wine experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Preferred Wine Types</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'].map((type) => (
                      <Badge key={type} variant="outline" className="cursor-pointer">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <input type="range" min="10" max="100" className="flex-1" />
                    <span className="text-sm text-bordeaux-600">€10 - €100</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery Frequency</label>
                  <select className="w-full mt-2 p-2 border border-bordeaux-200 rounded-md">
                    <option>Monthly</option>
                    <option>Bimonthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Points</CardTitle>
                <CardDescription>Earn points with every purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-bordeaux-900 mb-2">
                    {user.loyaltyPoints || 0}
                  </div>
                  <p className="text-bordeaux-600">Available Points</p>
                </div>
                <div className="space-y-2">
                  {loyaltyHistory?.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-b border-bordeaux-100">
                      <div>
                        <p className="text-sm font-medium">{entry.description}</p>
                        <p className="text-xs text-bordeaux-600">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.points > 0 ? '+' : ''}{entry.points}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem your points for exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loyaltyRewards?.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 border border-bordeaux-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{reward.name}</h4>
                        <p className="text-sm text-bordeaux-600">{reward.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{reward.pointsRequired} points</p>
                        <Button 
                          size="sm" 
                          disabled={!reward.canRedeem}
                          variant={reward.canRedeem ? "default" : "outline"}
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Earn points by inviting friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Your Referrals</h4>
                  <div className="space-y-2">
                    {referralHistory?.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">{referral.refereeEmail}</p>
                          <p className="text-xs text-bordeaux-600">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                          {referral.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Invite Friends</h4>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Friend's email address"
                      className="w-full p-2 border border-bordeaux-200 rounded-md"
                    />
                    <Button className="w-full">Send Invitation</Button>
                    <p className="text-xs text-bordeaux-600">
                      Earn 500 points when your friend joins and 250 points for them!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Wines curated just for you</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendationsLoading ? (
                <div className="text-center py-8">Loading recommendations...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations?.map((wine) => (
                    <Card key={wine.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center">
                            <Wine className="h-6 w-6 text-bordeaux-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{wine.name}</h4>
                            <p className="text-xs text-bordeaux-600">{wine.varietal} • {wine.vintage}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs">{wine.averageRating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">€{wine.price}</p>
                            <Button size="sm" variant="outline">Add to Cart</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
              </Tabs>

      {/* Subscription Details Modal */}
      {selectedSubscription && (
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          onUpdate={handleSubscriptionUpdate}
        />
      )}
      </div>
    </div>
  );
} 