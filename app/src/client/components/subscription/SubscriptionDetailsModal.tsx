import { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { 
  updateWineSubscription, 
  cancelWineSubscription, 
  reactivateWineSubscription,
  updateMemberPreferences,
  getBillingPortalUrl
} from 'wasp/client/operations';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '../ui/Dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Calendar, 
  Package, 
  CreditCard, 
  Settings, 
  Pause, 
  Play, 
  X,
  Wine,
  MapPin,
  Phone,
  Star
} from 'lucide-react';

interface SubscriptionDetailsModalProps {
  subscription: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function SubscriptionDetailsModal({ 
  subscription, 
  isOpen, 
  onClose, 
  onUpdate 
}: SubscriptionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdating, setIsUpdating] = useState(false);
  const [preferences, setPreferences] = useState({
    wineTypes: subscription?.preferences?.wineTypes || [],
    priceRange: subscription?.preferences?.priceRange || { min: 10, max: 100 },
    deliveryFrequency: subscription?.preferences?.deliveryFrequency || 'monthly',
    excludeVarietals: subscription?.preferences?.excludeVarietals || [],
    includeVarietals: subscription?.preferences?.includeVarietals || [],
    specialRequests: subscription?.preferences?.specialRequests || ''
  });

  const updateSubscriptionFn = useAction(updateWineSubscription);
  const cancelSubscriptionFn = useAction(cancelWineSubscription);
  const reactivateSubscriptionFn = useAction(reactivateWineSubscription);
  const updatePreferencesFn = useAction(updateMemberPreferences);
  const getBillingPortalFn = useAction(getBillingPortalUrl);

  const handlePauseSubscription = async () => {
    try {
      setIsUpdating(true);
      await updateSubscriptionFn({
        subscriptionId: subscription.id,
        pauseUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      onUpdate();
    } catch (error) {
      console.error('Error pausing subscription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      try {
        setIsUpdating(true);
        await cancelSubscriptionFn({ subscriptionId: subscription.id });
        onUpdate();
        onClose();
      } catch (error) {
        console.error('Error canceling subscription:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsUpdating(true);
      await reactivateSubscriptionFn({ subscriptionId: subscription.id });
      onUpdate();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setIsUpdating(true);
      await updatePreferencesFn({
        subscriptionId: subscription.id,
        preferences
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await getBillingPortalFn({ returnUrl: window.location.href });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  const wineTypes = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'];
  const varietals = ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay', 'Sauvignon Blanc', 'Syrah', 'Malbec', 'Zinfandel'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wine className="h-5 w-5 text-bordeaux-600" />
            <span>{subscription?.wineCave?.name} - Subscription Details</span>
          </DialogTitle>
          <DialogDescription>
            Manage your subscription settings, preferences, and billing
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'overview' 
                ? 'bg-bordeaux-100 text-bordeaux-900' 
                : 'text-bordeaux-600 hover:text-bordeaux-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'preferences' 
                ? 'bg-bordeaux-100 text-bordeaux-900' 
                : 'text-bordeaux-600 hover:text-bordeaux-900'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'billing' 
                ? 'bg-bordeaux-100 text-bordeaux-900' 
                : 'text-bordeaux-600 hover:text-bordeaux-900'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'actions' 
                ? 'bg-bordeaux-100 text-bordeaux-900' 
                : 'text-bordeaux-600 hover:text-bordeaux-900'
            }`}
          >
            Actions
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-bordeaux-600">Status:</span>
                    <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
                      {subscription?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-bordeaux-600">Plan:</span>
                    <span className="text-sm font-medium">{subscription?.subscriptionTier?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-bordeaux-600">Bottles per month:</span>
                    <span className="text-sm font-medium">{subscription?.subscriptionTier?.bottlesPerMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-bordeaux-600">Monthly price:</span>
                    <span className="text-sm font-medium">€{subscription?.subscriptionTier?.price}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-bordeaux-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-sm text-bordeaux-600">{subscription?.deliveryAddress || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-bordeaux-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-sm text-bordeaux-600">{subscription?.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Package className="h-4 w-4 text-bordeaux-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Next Shipment</p>
                      <p className="text-sm text-bordeaux-600">
                        {subscription?.nextShipmentDate 
                          ? new Date(subscription.nextShipmentDate).toLocaleDateString()
                          : 'Not scheduled'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription?.shipments?.length > 0 ? (
                  <div className="space-y-3">
                    {subscription.shipments.slice(0, 3).map((shipment: any) => (
                      <div key={shipment.id} className="flex items-center justify-between p-3 border border-bordeaux-100 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">
                            Shipment #{shipment.id.slice(-6)}
                          </p>
                          <p className="text-xs text-bordeaux-600">
                            {new Date(shipment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {shipment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-bordeaux-600">No shipments yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wine Preferences</CardTitle>
                <CardDescription>Customize your wine experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Preferred Wine Types</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {wineTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const newTypes = preferences.wineTypes.includes(type)
                            ? preferences.wineTypes.filter(t => t !== type)
                            : [...preferences.wineTypes, type];
                          setPreferences({ ...preferences, wineTypes: newTypes });
                        }}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          preferences.wineTypes.includes(type)
                            ? 'bg-bordeaux-100 text-bordeaux-900 border-bordeaux-300'
                            : 'bg-white text-bordeaux-600 border-bordeaux-200 hover:border-bordeaux-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Price Range (€)</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <input
                      type="number"
                      min="5"
                      max="200"
                      value={preferences.priceRange.min}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        priceRange: { ...preferences.priceRange, min: parseInt(e.target.value) }
                      })}
                      className="w-20 p-2 border border-bordeaux-200 rounded-md text-sm"
                    />
                    <span className="text-sm text-bordeaux-600">to</span>
                    <input
                      type="number"
                      min="5"
                      max="200"
                      value={preferences.priceRange.max}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        priceRange: { ...preferences.priceRange, max: parseInt(e.target.value) }
                      })}
                      className="w-20 p-2 border border-bordeaux-200 rounded-md text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Delivery Frequency</label>
                  <select
                    value={preferences.deliveryFrequency}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      deliveryFrequency: e.target.value as 'monthly' | 'bimonthly' | 'quarterly'
                    })}
                    className="w-full mt-2 p-2 border border-bordeaux-200 rounded-md"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="bimonthly">Bimonthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Special Requests</label>
                  <textarea
                    value={preferences.specialRequests}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      specialRequests: e.target.value
                    })}
                    placeholder="Any special requests or notes for your wine selections..."
                    className="w-full mt-2 p-2 border border-bordeaux-200 rounded-md h-20 resize-none"
                  />
                </div>

                <Button 
                  onClick={handleUpdatePreferences}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? 'Updating...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your payment methods and billing history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-bordeaux-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-bordeaux-600" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-xs text-bordeaux-600">Manage your payment methods</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleManageBilling}>
                    Manage Billing
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-bordeaux-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-bordeaux-600" />
                    <div>
                      <p className="text-sm font-medium">Next Billing Date</p>
                      <p className="text-xs text-bordeaux-600">
                        {subscription?.nextBillingDate 
                          ? new Date(subscription.nextBillingDate).toLocaleDateString()
                          : 'Not scheduled'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-bordeaux-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-bordeaux-600" />
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-xs text-bordeaux-600">
                        {subscription?.subscriptionTier?.name} - €{subscription?.subscriptionTier?.price}/month
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Actions</CardTitle>
                <CardDescription>Manage your subscription status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription?.status === 'active' ? (
                  <>
                    <div className="flex items-center justify-between p-4 border border-bordeaux-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Pause className="h-5 w-5 text-bordeaux-600" />
                        <div>
                          <p className="text-sm font-medium">Pause Subscription</p>
                          <p className="text-xs text-bordeaux-600">Temporarily pause your subscription for up to 3 months</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handlePauseSubscription}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Pausing...' : 'Pause'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Cancel Subscription</p>
                          <p className="text-xs text-red-600">Permanently cancel your subscription</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelSubscription}
                        disabled={isUpdating}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        {isUpdating ? 'Canceling...' : 'Cancel'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 border border-bordeaux-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="h-5 w-5 text-bordeaux-600" />
                      <div>
                        <p className="text-sm font-medium">Reactivate Subscription</p>
                        <p className="text-xs text-bordeaux-600">Resume your subscription</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleReactivateSubscription}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Reactivating...' : 'Reactivate'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 