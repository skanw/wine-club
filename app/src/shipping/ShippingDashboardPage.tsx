import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getWineCaves, createShipment, generateShippingLabel, updateShipment } from 'wasp/client/operations';

const ShippingDashboardPage = () => {
  const { data: wineCaves, isLoading } = useQuery(getWineCaves);
  const createShipmentAction = useAction(createShipment);
  const generateLabelAction = useAction(generateShippingLabel);
  const updateShipmentAction = useAction(updateShipment);
  
  const [selectedCave, setSelectedCave] = useState<string>('');
  const [selectedCarrier, setSelectedCarrier] = useState<'FedEx' | 'UPS'>('FedEx');
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  const handleCreateShipment = async (subscriptionId: string) => {
    try {
      setIsCreatingShipment(true);
      await createShipmentAction({
        subscriptionId,
        carrier: selectedCarrier,
        wineSelections: [] // Would be populated based on subscription tier
      });
      alert('Shipment created successfully!');
    } catch (error: any) {
      alert('Failed to create shipment: ' + error.message);
    } finally {
      setIsCreatingShipment(false);
    }
  };

  const handleGenerateLabel = async (shipmentId: string) => {
    try {
      await generateLabelAction({ shipmentId });
      alert('Shipping label generated!');
    } catch (error: any) {
      alert('Failed to generate label: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading shipping dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">Shipping Management</h1>

      {/* Carrier Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Shipping Settings</h2>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="FedEx"
              checked={selectedCarrier === 'FedEx'}
              onChange={(e) => setSelectedCarrier(e.target.value as 'FedEx')}
              className="mr-2"
            />
            FedEx
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="UPS"
              checked={selectedCarrier === 'UPS'}
              onChange={(e) => setSelectedCarrier(e.target.value as 'UPS')}
              className="mr-2"
            />
            UPS
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Selected carrier: {selectedCarrier}
        </p>
      </div>

      {/* Wine Caves and Subscriptions */}
      {wineCaves && wineCaves.length > 0 ? (
        <div className="space-y-6">
          {wineCaves.map((cave: any) => (
            <div key={cave.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
                {cave.name} - Shipping Management
              </h3>
              
              {cave.subscriptions && cave.subscriptions.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Active Subscriptions:</h4>
                  {cave.subscriptions.map((subscription: any) => (
                    <div key={subscription.id} className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subscription.member?.email || 'Unknown Member'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {subscription.subscriptionTier.name} - Next shipment: {
                              subscription.nextShipmentDate 
                                ? new Date(subscription.nextShipmentDate).toLocaleDateString()
                                : 'Not scheduled'
                            }
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Delivery: {subscription.deliveryAddress}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCreateShipment(subscription.id)}
                            disabled={isCreatingShipment}
                            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            {isCreatingShipment ? 'Creating...' : 'Create Shipment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No active subscriptions for this wine cave.</p>
              )}

              {/* Recent Shipments */}
              {cave.shipments && cave.shipments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Shipments:</h4>
                  <div className="space-y-2">
                    {cave.shipments.slice(0, 5).map((shipment: any) => (
                      <div key={shipment.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Shipment #{shipment.id.slice(-8)} - {shipment.carrier}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              Status: {shipment.status} | 
                              {shipment.trackingNumber && ` Tracking: ${shipment.trackingNumber}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {shipment.status === 'pending' && (
                              <button
                                onClick={() => handleGenerateLabel(shipment.id)}
                                className="bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded text-xs"
                              >
                                Generate Label
                              </button>
                            )}
                            <button
                              onClick={() => updateShipmentAction({ 
                                shipmentId: shipment.id, 
                                status: shipment.status === 'pending' ? 'shipped' : 'delivered' 
                              })}
                              className="bg-yellow-500 hover:bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                            >
                              Update Status
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No Wine Caves</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create a wine cave first to manage shipments.
          </p>
          <a 
            href="/wine-caves/create"
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Wine Cave
          </a>
        </div>
      )}

      {/* Shipping Integration Status */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Shipping Integration Status</h3>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p>✅ FedEx Integration: Ready (Sandbox Mode)</p>
          <p>✅ UPS Integration: Ready (Sandbox Mode)</p>
          <p>🔧 Automatic label generation: Enabled</p>
          <p>📧 Customer notifications: Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingDashboardPage; 