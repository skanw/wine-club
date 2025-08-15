import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getWineCave } from 'wasp/client/operations';

export default function WineCaveDashboardPage() {
  const { wineCaveId } = useParams();
  const { data: wineCave, isLoading, error } = useQuery(getWineCave, { id: wineCaveId! });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600"></div>
      </div>
    );
  }

  if (error || !wineCave) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Wine Cave Not Found</h2>
          <p className="text-gray-600">The wine cave you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Type assertion to handle related entities
  const wineCaveWithRelations = wineCave as any;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        {wineCaveWithRelations?.logoUrl && (
          <img src={wineCaveWithRelations.logoUrl} alt={wineCaveWithRelations?.name || 'Wine Cave'} className="w-16 h-16 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-bordeaux-900">{wineCaveWithRelations?.name || 'Wine Cave'}</h1>
          <p className="text-gray-600">{wineCaveWithRelations?.location || 'Unknown location'}</p>
        </div>
      </div>
      
      <p className="mb-8">{wineCaveWithRelations?.description || 'No description available.'}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Wines ({wineCaveWithRelations?.wines?.length || 0})</h2>
          {Array.isArray(wineCaveWithRelations?.wines) && wineCaveWithRelations.wines.length > 0 ? (
            <ul className="space-y-2">
              {wineCaveWithRelations.wines.map((wine: any) => (
                <li key={wine.id} className="flex justify-between items-center border-b pb-2">
                  <span>{wine?.name || 'Unnamed Wine'}</span>
                  <span className="text-sm text-gray-500">Stock: {wine?.stockQuantity ?? 0}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No wines found.</p>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Subscription Tiers ({wineCaveWithRelations?.subscriptionTiers?.length || 0})</h2>
          {Array.isArray(wineCaveWithRelations?.subscriptionTiers) && wineCaveWithRelations.subscriptionTiers.length > 0 ? (
            <ul className="space-y-2">
              {wineCaveWithRelations.subscriptionTiers.map((tier: any) => (
                <li key={tier.id} className="flex justify-between items-center border-b pb-2">
                  <span>{tier?.name || 'Unnamed Tier'}</span>
                  <span className="text-sm text-gray-500">€{tier?.price || 0}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subscription tiers found.</p>
          )}
        </div>
      </div>
    </div>
  );
} 