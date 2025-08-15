import React from 'react';
import { useParams } from 'react-router-dom';
// import { useQuery } from 'wasp/client/operations';
// import { getWineCave } from '@src/wine-cave/operations';
import { 
  MapPin, 
  // Remove unused imports Calendar, Package, Users
  Globe,
  Star as _Star,
  Wine as _Wine,
  Phone as _Phone
} from 'lucide-react'

export default function PublicWineCavePage() {
  const { wineCaveId } = useParams();

  // Stub data
  const wineCave = {
    id: wineCaveId,
    name: 'Château Bordeaux Premium',
    location: 'Bordeaux, France',
    description: 'Discover exceptional wines from the heart of Bordeaux, curated by expert sommeliers for the discerning wine enthusiast.',
    logoUrl: '/images/wine-logo.svg',
    contactEmail: 'contact@chateaubordeaux.com',
    website: 'https://chateaubordeaux.com',
    subscriptionTiers: [
      {
        id: '1',
        name: 'Discovery',
        description: 'Perfect for wine enthusiasts starting their journey',
        price: 49.99,
        billingCycle: 'monthly',
        winesPerShipment: 2,
        shippingIncluded: true
      },
      {
        id: '2',
        name: 'Connoisseur',
        description: 'For the serious wine collector',
        price: 89.99,
        billingCycle: 'monthly',
        winesPerShipment: 3,
        shippingIncluded: true
      },
      {
        id: '3',
        name: 'Collector',
        description: 'Ultimate wine experience with rare finds',
        price: 149.99,
        billingCycle: 'monthly',
        winesPerShipment: 4,
        shippingIncluded: true
      }
    ],
    wines: [
      {
        id: '1',
        name: 'Château Margaux 2018',
        vintage: '2018',
        varietal: 'Cabernet Sauvignon',
        region: 'Bordeaux',
        country: 'France',
        price: 899.99,
        stockQuantity: 5,
        imageUrl: '/images/wine-bottle-red.svg'
      },
      {
        id: '2',
        name: 'Château Lafite Rothschild 2019',
        vintage: '2019',
        varietal: 'Cabernet Sauvignon',
        region: 'Bordeaux',
        country: 'France',
        price: 1299.99,
        stockQuantity: 3,
        imageUrl: '/images/wine-bottle-red.svg'
      }
    ]
  };

  // const { data: wineCave, isLoading, error } = useQuery(getWineCave, { wineCaveId });

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600"></div>
  //     </div>
  //   );
  // }

  // if (error || !wineCave) {
  //   return (
  //     <div className="max-w-4xl mx-auto p-6">
  //       <div className="text-center py-12">
  //         <h2 className="text-2xl font-bold text-red-600 mb-4">Wine Cave Not Found</h2>
  //         <p className="text-gray-600">The wine cave you're looking for doesn't exist.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-champagne-50">
      {/* Header */}
      <div className="relative h-96 bg-gradient-to-br from-bordeaux-900 to-bordeaux-800">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            {wineCave?.logoUrl && (
              <img 
                src={wineCave.logoUrl} 
                alt={`${wineCave?.name || 'Wine Cave'} logo`}
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
              />
            )}
            <h1 className="text-4xl font-bold mb-2">{wineCave?.name || 'Wine Cave'}</h1>
            <p className="text-xl text-champagne-200 mb-4">
              {wineCave?.location || 'Location not specified'}
            </p>
            <p className="text-lg text-champagne-300 max-w-2xl mx-auto">
              {wineCave?.description || 'Premium wine selection'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subscription Tiers */}
        {wineCave?.subscriptionTiers && wineCave.subscriptionTiers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-bordeaux-900 mb-8 text-center">Subscription Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(wineCave.subscriptionTiers) && wineCave.subscriptionTiers.map((tier: any) => (
                <div key={tier.id} className="card hover:shadow-lg transition-shadow">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-semibold text-bordeaux-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-4">{tier.description}</p>
                    <div className="text-3xl font-bold text-bordeaux-600 mb-4">
                      €{tier.price}
                      <span className="text-sm font-normal text-gray-500">/{tier.billingCycle}</span>
                    </div>
                    <ul className="text-sm text-gray-600 mb-6 space-y-2">
                      <li>• {tier.winesPerShipment} wines per shipment</li>
                      <li>• {tier.shippingIncluded ? 'Free shipping' : 'Shipping included'}</li>
                      <li>• Expert curation</li>
                      <li>• Tasting notes included</li>
                    </ul>
                    <button className="btn-primary w-full">
                      Subscribe Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Wine Collection */}
        {wineCave?.wines && wineCave.wines.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-bordeaux-900 mb-8 text-center">Our Wine Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(wineCave.wines) && wineCave.wines.map((wine: any) => (
                <div key={wine.id} className="card hover:shadow-lg transition-shadow">
                  {wine.imageUrl && (
                    <img 
                      src={wine.imageUrl} 
                      alt={wine.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-bordeaux-900 mb-1">{wine.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{wine.vintage} • {wine.varietal}</p>
                    <p className="text-sm text-gray-600 mb-3">{wine.region}, {wine.country}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-bordeaux-600">€{wine.price}</span>
                      <span className="text-sm text-gray-500">
                        {wine.stockQuantity > 0 ? `${wine.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-bordeaux-900 mb-6 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-bordeaux-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-bordeaux-600" />
              </div>
              <h3 className="font-semibold text-bordeaux-900 mb-2">Email</h3>
              <p className="text-gray-600">{wineCave?.contactEmail || 'contact@winecave.com'}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-bordeaux-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-bordeaux-600" />
              </div>
              <h3 className="font-semibold text-bordeaux-900 mb-2">Location</h3>
              <p className="text-gray-600">{wineCave?.location || 'Location not specified'}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-bordeaux-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-bordeaux-600" />
              </div>
              <h3 className="font-semibold text-bordeaux-900 mb-2">Website</h3>
              <a 
                href={wineCave?.website || '#'} 
                className="text-bordeaux-600 hover:text-bordeaux-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {wineCave?.website || 'Visit our website'}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 