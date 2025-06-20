import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useAction } from 'wasp/client/operations';
import { getWineCaves, deleteWineCave } from 'wasp/client/operations';

const WineCaveDashboardPage = () => {
  const { data: wineCaves, isLoading, error } = useQuery(getWineCaves);
  const deleteWineCaveAction = useAction(deleteWineCave);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDeleteWineCave = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteWineCaveAction({ id });
      setMessage({ type: 'success', text: 'Wine cave deleted successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete wine cave' });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading wine caves: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">My Wine Caves</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your wine subscription businesses</p>
        </div>
        <Link 
          to="/wine-caves/create"
          className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
        >
          + Create Wine Cave
        </Link>
      </div>

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

      {/* Empty State */}
      {wineCaves && wineCaves.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🍷</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No Wine Caves Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto dark:text-gray-300">
            Create your first wine cave to start building your subscription business. Set up tiers, add wines, and start attracting members.
          </p>
          <Link 
            to="/wine-caves/create"
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Your First Wine Cave
          </Link>
        </div>
      )}

      {/* Wine Caves Grid */}
      {wineCaves && wineCaves.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wineCaves.map((cave: any) => (
            <div key={cave.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {cave.logoUrl ? (
                    <img
                      src={cave.logoUrl}
                      alt={cave.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🍷</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cave.name}</h3>
                    {cave.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        📍 {cave.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Link 
                    to={`/wine-caves/${cave.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    👁️
                  </Link>
                  <button
                    onClick={() => handleDeleteWineCave(cave.id, cave.name)}
                    disabled={deletingId === cave.id}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
                  >
                    {deletingId === cave.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {cave.description || 'No description provided'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{cave._count?.subscriptions || 0}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{cave.subscriptionTiers?.length || 0}</div>
                  <div className="text-xs text-gray-500">Tiers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{cave.wines?.length || 0}</div>
                  <div className="text-xs text-gray-500">Wines</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  ✉️ {cave.contactEmail}
                </div>
                {cave.website && (
                  <div className="flex items-center">
                    🌐 <a
                      href={cave.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:underline ml-1"
                    >
                      {cave.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Subscription Tiers Preview */}
              {cave.subscriptionTiers && cave.subscriptionTiers.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subscription Tiers</div>
                  <div className="flex flex-wrap gap-1">
                    {cave.subscriptionTiers.slice(0, 3).map((tier: any) => (
                      <span key={tier.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                        {tier.name} - €{tier.price}/mo
                      </span>
                    ))}
                    {cave.subscriptionTiers.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded">
                        +{cave.subscriptionTiers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WineCaveDashboardPage; 