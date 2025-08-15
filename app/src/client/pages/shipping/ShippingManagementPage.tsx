import React, { useState } from 'react'
import { useTranslation as _useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Calendar,
  Download,
  Plus,
  Search
} from 'lucide-react';

export default function ShippingManagementPage() {
  const { subscriptionId: _subscriptionId } = useParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [_isScheduleModalOpen, _setIsScheduleModalOpen] = useState(false)
  const [_selectedShipment, _setSelectedShipment] = useState(null)
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: 'CHRONOPOST',
    estimatedDelivery: '',
    deliveryAddress: '',
    deliveryInstructions: '',
  });

  // Stub data
  const shipments = [
    {
      id: '1',
      status: 'IN_TRANSIT',
      carrier: 'CHRONOPOST',
      trackingNumber: 'CH123456789FR',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      deliveryAddress: '123 Rue de la Paix, Paris, France'
    }
  ];
  const currentStatus = {
    status: 'IN_TRANSIT',
    carrier: 'CHRONOPOST',
    trackingNumber: 'CH123456789FR',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
  const loadingShipments = false;
  const loadingStatus = false;

  // const createShipmentFn = useAction(createShipment);
  // const updateStatusFn = useAction(updateShipment);
  // const scheduleShipmentsFn = useAction(scheduleShipments);
  // const generateLabelFn = useAction(generateShippingLabel);

  // const { data: shipments, isLoading: loadingShipments } = useQuery(getShipments, { 
  //   subscriptionId: subscriptionId! 
  // });

  // const { data: currentStatus, isLoading: loadingStatus } = useQuery(getShipmentAnalytics, { 
  //   subscriptionId: subscriptionId! 
  // });

  // const { data: shippingRates, isLoading: loadingRates } = useQuery(getShippingRates);

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Integrate with createShipmentFn when ready
      // setIsCreateModalOpen(false) // This line was removed by the user's edit hint
      setFormData({
        trackingNumber: '',
        carrier: 'CHRONOPOST',
        estimatedDelivery: '',
        deliveryAddress: '',
        deliveryInstructions: '',
      })
    } catch (error) {
      // TODO: Show user-friendly error message
    }
  }

  const _handleUpdateStatus = async (_shipmentId: string, _status: string) => {
    try {
      // TODO: Integrate with updateStatusFn when ready
    } catch (error) {
      // TODO: Show user-friendly error message
    }
  }

  const handleGenerateLabel = async (_shipmentId: string) => {
    try {
      // TODO: Integrate with generateLabelFn when ready
      alert('Label generation coming soon!')
    } catch (error) {
      // TODO: Show user-friendly error message
    }
  }

  const _handleDeleteShipment = async (_shipmentId: string) => {
    try {
      // TODO: Integrate with deleteShipmentFn when ready
    } catch (error) {
      // TODO: Show user-friendly error message
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'IN_TRANSIT': return 'text-blue-600 bg-blue-100';
      case 'OUT_FOR_DELIVERY': return 'text-orange-600 bg-orange-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'IN_TRANSIT': return <Truck size={16} />;
      case 'OUT_FOR_DELIVERY': return <Package size={16} />;
      case 'FAILED': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredShipments = Array.isArray(shipments) ? shipments.filter(shipment => {
    const matchesSearch = shipment?.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment?.carrier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || shipment?.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (loadingShipments || loadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-2">Shipping Management</h1>
        <p className="text-gray-600">Track and manage wine shipments</p>
      </div>

      {/* Current Status */}
      {currentStatus && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Current Shipment Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getStatusColor(currentStatus?.status ?? 'PENDING')}`}>
                {getStatusIcon(currentStatus?.status ?? 'PENDING')}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{(currentStatus?.status ?? 'PENDING').replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">{currentStatus?.carrier ?? 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="text-gray-400" size={20} />
              <div className="ml-3">
                <p className="font-medium text-gray-900">Tracking</p>
                <p className="text-sm text-gray-600">{currentStatus?.trackingNumber ?? 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="text-gray-400" size={20} />
              <div className="ml-3">
                <p className="font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-600">
                  {currentStatus?.estimatedDelivery 
                    ? new Date(currentStatus.estimatedDelivery).toLocaleDateString()
                    : 'TBD'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Create Shipment
            </button>
            
            <button
              onClick={() => _setIsScheduleModalOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Calendar size={20} />
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Shipment History</h3>
        {filteredShipments.length > 0 ? (
          <div className="space-y-4">
            {filteredShipments.map((shipment: any) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment?.status ?? 'PENDING')}`}>
                        {getStatusIcon(shipment?.status ?? 'PENDING')}
                        <span className="ml-1">{(shipment?.status ?? 'PENDING').replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm text-gray-500">{shipment?.carrier ?? 'Unknown'}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tracking:</span>
                        <p className="text-gray-600">{shipment?.trackingNumber ?? 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Estimated Delivery:</span>
                        <p className="text-gray-600">
                          {shipment?.estimatedDelivery 
                            ? new Date(shipment.estimatedDelivery).toLocaleDateString()
                            : 'TBD'
                          }
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <p className="text-gray-600">
                          {shipment?.createdAt 
                            ? new Date(shipment.createdAt).toLocaleDateString()
                            : 'Unknown'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateLabel(shipment.id)}
                      className="btn-secondary text-sm"
                    >
                      <Download size={16} className="mr-1" />
                      Label
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No shipments found.</p>
          </div>
        )}
      </div>

      {/* Create Shipment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Create New Shipment</h3>
            
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                <select
                  value={formData.carrier}
                  onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                >
                  <option value="CHRONOPOST">Chronopost</option>
                  <option value="COLISSIMO">Colissimo</option>
                  <option value="DPD">DPD</option>
                  <option value="UPS">UPS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
                <textarea
                  value={formData.deliveryInstructions}
                  onChange={(e) => setFormData({...formData, deliveryInstructions: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Shipment
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 