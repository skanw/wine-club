import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ShipmentTrackingProps {
  shipments: any[];
  subscriptionId: string;
}

const getShipmentStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'in_transit':
      return <Truck className="h-5 w-5 text-blue-600" />;
    case 'processing':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case 'shipped':
      return <Package className="h-5 w-5 text-bordeaux-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
  }
};

const getShipmentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_transit':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'shipped':
      return 'bg-bordeaux-100 text-bordeaux-800 border-bordeaux-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ShipmentTracking({ shipments, subscriptionId }: ShipmentTrackingProps) {
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  if (!shipments || shipments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-bordeaux-600" />
            <span>Shipment Tracking</span>
          </CardTitle>
          <CardDescription>Track your wine shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-bordeaux-300 mb-4" />
            <h3 className="text-lg font-medium text-bordeaux-900 mb-2">No shipments yet</h3>
            <p className="text-bordeaux-600">Your first shipment will appear here once it's processed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-bordeaux-600" />
            <span>Shipment Tracking</span>
          </CardTitle>
          <CardDescription>Track your wine shipments and delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedShipment?.id === shipment.id
                    ? 'border-bordeaux-300 bg-bordeaux-50'
                    : 'border-bordeaux-200 hover:border-bordeaux-300'
                }`}
                onClick={() => setSelectedShipment(selectedShipment?.id === shipment.id ? null : shipment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getShipmentStatusIcon(shipment.status)}
                    <div>
                      <h4 className="font-medium text-sm">
                        Shipment #{shipment.id.slice(-6)}
                      </h4>
                      <p className="text-xs text-bordeaux-600">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={getShipmentStatusColor(shipment.status)}
                    >
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-bordeaux-600">
                      {shipment.items?.length || 0} items
                    </span>
                  </div>
                </div>

                {selectedShipment?.id === shipment.id && (
                  <div className="mt-4 pt-4 border-t border-bordeaux-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Shipment Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-bordeaux-600">Tracking Number:</span>
                            <span className="font-medium">
                              {shipment.trackingNumber || 'Not available'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-bordeaux-600">Carrier:</span>
                            <span className="font-medium">
                              {shipment.carrier || 'Standard Shipping'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-bordeaux-600">Estimated Delivery:</span>
                            <span className="font-medium">
                              {shipment.estimatedDeliveryDate 
                                ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                                : 'TBD'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Wines Included</h5>
                        <div className="space-y-2">
                          {shipment.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
                              <span>{item.wine?.name || 'Unknown Wine'}</span>
                              <span className="text-bordeaux-600">
                                ({item.quantity} bottle{item.quantity > 1 ? 's' : ''})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {shipment.status === 'in_transit' && shipment.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-bordeaux-100">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-bordeaux-600" />
                          <span className="text-sm font-medium">Tracking Updates</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          {shipment.trackingUpdates?.map((update: any, index: number) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <div className="w-2 h-2 bg-bordeaux-600 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium">{update.status}</p>
                                <p className="text-bordeaux-600">{update.location}</p>
                                <p className="text-xs text-bordeaux-500">
                                  {new Date(update.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {shipment.deliveryAddress && (
                      <div className="mt-4 pt-4 border-t border-bordeaux-100">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-bordeaux-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Delivery Address</p>
                            <p className="text-sm text-bordeaux-600">{shipment.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Shipment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-bordeaux-600" />
            <span>Next Shipment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Estimated Shipment Date</p>
              <p className="text-sm text-bordeaux-600">
                {shipments[0]?.nextShipmentDate 
                  ? new Date(shipments[0].nextShipmentDate).toLocaleDateString()
                  : 'Not scheduled yet'
                }
              </p>
            </div>
            <Badge variant="outline" className="bg-bordeaux-50 text-bordeaux-700 border-bordeaux-200">
              Processing
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 