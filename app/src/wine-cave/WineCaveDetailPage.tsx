import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useAction } from 'wasp/client/operations';
import { getWineCaves, updateWineCave, deleteWineCave } from 'wasp/client/operations';

const WineCaveDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const updateWineCaveAction = useAction(updateWineCave);
  const deleteWineCaveAction = useAction(deleteWineCave);
  
  const { data: wineCaves, isLoading, error } = useQuery(getWineCaves);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    contactEmail: '',
    logoUrl: '',
  });

  // Find the specific wine cave
  const wineCave = wineCaves?.find(cave => cave.id === id);

  // Initialize form data when wine cave is loaded
  React.useEffect(() => {
    if (wineCave && !isEditing) {
      setEditFormData({
        name: wineCave.name || '',
        description: wineCave.description || '',
        location: wineCave.location || '',
        website: wineCave.website || '',
        contactEmail: wineCave.contactEmail || '',
        logoUrl: wineCave.logoUrl || '',
      });
    }
  }, [wineCave, isEditing]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wineCave) return;

    try {
      await updateWineCaveAction({
        id: wineCave.id,
        name: editFormData.name.trim(),
        description: editFormData.description.trim() || undefined,
        location: editFormData.location.trim() || undefined,
        website: editFormData.website.trim() || undefined,
        contactEmail: editFormData.contactEmail.trim(),
        logoUrl: editFormData.logoUrl.trim() || undefined,
      });

      setIsEditing(false);
      alert('Wine cave updated successfully! 🍷');
    } catch (error: any) {
      alert(`Failed to update wine cave: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!wineCave) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${wineCave.name}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteWineCaveAction({ id: wineCave.id });
      alert('Wine cave deleted successfully');
      navigate('/wine-caves');
    } catch (error: any) {
      alert(`Failed to delete wine cave: ${error.message}`);
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading wine cave details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error loading wine caves: {error.message}</p>
          <button 
            onClick={() => navigate('/wine-caves')}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400"
          >
            Back to Wine Caves
          </button>
        </div>
      </div>
    );
  }

  if (!wineCave) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Wine Cave Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The wine cave you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button 
            onClick={() => navigate('/wine-caves')}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400"
          >
            Back to Wine Caves
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/wine-caves')}
            className="text-yellow-600 hover:text-yellow-700"
          >
            ← Back to Wine Caves
          </button>
          
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Wine Cave Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            {wineCave.logoUrl && (
              <img
                src={wineCave.logoUrl}
                alt={`${wineCave.name} logo`}
                className="w-16 h-16 rounded-full object-cover bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{wineCave.name}</h1>
              {wineCave.location && (
                <p className="text-yellow-100 mt-1">📍 {wineCave.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wine Cave Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={editFormData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={editFormData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-400"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Display Mode */
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Wine Cave Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Contact Email
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      <a href={`mailto:${wineCave.contactEmail}`} className="text-yellow-600 hover:text-yellow-700">
                        {wineCave.contactEmail}
                      </a>
                    </p>
                  </div>
                  
                  {wineCave.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                        Website
                      </label>
                      <p className="mt-1">
                        <a 
                          href={wineCave.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          {wineCave.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {wineCave.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    About This Wine Cave
                  </label>
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    {wineCave.description}
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(wineCave as any)?.subscriptions?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Active Subscriptions
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(wineCave as any)?.subscriptionTiers?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Subscription Tiers
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(wineCave as any)?.wines?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Wine Inventory
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-center">
                    <div className="text-2xl mb-2">🍷</div>
                    <div className="text-sm font-medium">Manage Wines</div>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <div className="text-sm font-medium">Subscription Tiers</div>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium">View Members</div>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">Analytics</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WineCaveDetailPage; 