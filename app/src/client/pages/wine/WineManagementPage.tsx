import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getWineCave } from 'wasp/client/operations';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  BarChart3,
  Wine,
  AlertTriangle
} from 'lucide-react';

interface WineFormData {
  name: string;
  varietal: string;
  vintage: string;
  region: string;
  country: string;
  description: string;
  tastingNotes: string;
  alcoholContent: number;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export default function WineManagementPage() {
  const { wineCaveId } = useParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWine, setSelectedWine] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVarietal, setFilterVarietal] = useState('');
  const [filterInStock, setFilterInStock] = useState(false);
  const [formData, setFormData] = useState<WineFormData>({
    name: '',
    varietal: '',
    vintage: new Date().getFullYear().toString(),
    region: '',
    country: '',
    description: '',
    tastingNotes: '',
    alcoholContent: 0,
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
  });

  const { data: wineCave, isLoading: loadingWines, error: winesError } = useQuery(getWineCave, { 
    id: wineCaveId! 
  });

  // Placeholder wines data
  const wines = wineCave?.wines || [];

  const handleCreateWine = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - would call createWine operation
    alert('Wine creation functionality coming soon!');
    setIsCreateModalOpen(false);
  };

  const handleUpdateWine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWine) return;
    
    // Placeholder - would call updateWine operation
    alert('Wine update functionality coming soon!');
    setIsEditModalOpen(false);
  };

  const handleDeleteWine = async (wineId: string) => {
    if (confirm('Are you sure you want to delete this wine?')) {
      // Placeholder - would call deleteWine operation
      alert('Wine deletion functionality coming soon!');
    }
  };

  const handleStockUpdate = async (wineId: string, newStock: number) => {
    // Placeholder - would call updateWineStock operation
    alert('Stock update functionality coming soon!');
  };

  const filteredWines = wines.filter((wine: any) => {
    const matchesSearch = wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wine.varietal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVarietal = !filterVarietal || wine.varietal === filterVarietal;
    const matchesStock = !filterInStock || wine.stockQuantity > 0;
    
    return matchesSearch && matchesVarietal && matchesStock;
  });

  if (loadingWines) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600"></div>
      </div>
    );
  }

  if (winesError || !wineCave) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Wine Cave Not Found</h2>
          <p className="text-gray-600">The wine cave you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-bordeaux-900">Wine Management</h1>
          <p className="text-gray-600">Manage your wine inventory for {wineCave.name}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Wine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-bordeaux-100 rounded-lg">
              <Wine className="w-6 h-6 text-bordeaux-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Wines</p>
              <p className="text-2xl font-bold text-bordeaux-900">{wines.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {wines.filter((w: any) => w.stockQuantity > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {wines.filter((w: any) => w.stockQuantity <= 10 && w.stockQuantity > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {wines.filter((w: any) => w.stockQuantity === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search wines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterVarietal}
            onChange={(e) => setFilterVarietal(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
          >
            <option value="">All Varietals</option>
            {Array.from(new Set(wines.map((w: any) => w.varietal))).map((varietal: any) => (
              <option key={varietal} value={varietal}>{varietal}</option>
            ))}
          </select>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={(e) => setFilterInStock(e.target.checked)}
              className="mr-2"
            />
            In Stock Only
          </label>
        </div>
      </div>

      {/* Wines Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Wine</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Varietal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vintage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWines.length > 0 ? (
                filteredWines.map((wine: any) => (
                  <tr key={wine.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{wine.name}</p>
                        <p className="text-sm text-gray-500">{wine.region}, {wine.country}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{wine.varietal}</td>
                    <td className="py-3 px-4 text-gray-700">{wine.vintage}</td>
                    <td className="py-3 px-4 text-gray-700">€{wine.price}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wine.stockQuantity === 0 
                          ? 'bg-red-100 text-red-800'
                          : wine.stockQuantity <= 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {wine.stockQuantity} bottles
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedWine(wine);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-bordeaux-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteWine(wine.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No wines found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Wine Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Wine</h2>
            <form onSubmit={handleCreateWine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Varietal *</label>
                  <input
                    type="text"
                    required
                    value={formData.varietal}
                    onChange={(e) => setFormData({ ...formData, varietal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vintage *</label>
                  <input
                    type="number"
                    required
                    value={formData.vintage}
                    onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (€) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Wine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Wine Modal */}
      {isEditModalOpen && selectedWine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Wine</h2>
            <p className="text-sm text-gray-600 mb-4">Edit functionality coming soon!</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 