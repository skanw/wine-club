import React, { useState } from 'react'
import { useTranslation as _useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { 
  Search,
  Filter as _Filter,
  MapPin as _MapPin,
  Wine
} from 'lucide-react'

export default function WineCaveDiscoveryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');

  // Placeholder data - in production this would come from a query
  const wineCaves: any[] = [];
  const isLoading = false;
  const error = null;

  const filteredWineCaves = Array.isArray(wineCaves) ? wineCaves.filter(wineCave => {
    const matchesSearch = wineCave?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wineCave?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) : [];

  const regions: string[] = [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bordeaux-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="card">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mt-4">Error Loading Wine Caves</h3>
            <p className="text-gray-600 mt-2">An error occurred while loading wine caves.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-champagne-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-bordeaux-900 to-bordeaux-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Exceptional Wine Caves
          </h1>
          <p className="text-xl text-champagne-200 mb-8 max-w-3xl mx-auto">
            Explore curated wine collections from the finest wine caves across France and beyond. 
            Each cave offers unique selections, expert curation, and premium subscription experiences.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search wine caves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {Array.isArray(filteredWineCaves) && filteredWineCaves.length > 0 
              ? `Found ${filteredWineCaves.length} wine cave${filteredWineCaves.length === 1 ? '' : 's'}`
              : 'No wine caves found'
            }
          </p>
        </div>

        {/* Wine Caves Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredWineCaves) && filteredWineCaves.length > 0 ? (
            filteredWineCaves.map((wineCave: any) => (
              <div key={wineCave.id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => navigate(`/wine-cave/${wineCave.id}`)}>
                <div className="flex items-start space-x-4">
                  {wineCave.logoUrl && (
                    <img 
                      src={wineCave.logoUrl} 
                      alt={wineCave.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-bordeaux-900 mb-1">{wineCave.name}</h3>
                    <p className="text-gray-600 mb-2">{wineCave.location}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{wineCave.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <Wine size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No wine caves found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">Be the first to create a wine cave!</p>
              <button 
                onClick={() => navigate('/onboarding')}
                className="mt-4 btn-primary"
              >
                Create Your Wine Cave
              </button>
            </div>
          )}
        </div>

        {/* Featured Wine Caves */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-bordeaux-900 mb-6">Featured Wine Caves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-br from-bordeaux-50 to-champagne-50 border-bordeaux-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-bordeaux-100 rounded-full flex items-center justify-center">
                  <Wine className="w-6 h-6 text-bordeaux-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-bordeaux-900">Bordeaux Classics</h3>
                  <p className="text-sm text-gray-600">Discover the finest wines from Bordeaux</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-champagne-50 to-bordeaux-50 border-champagne-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-champagne-100 rounded-full flex items-center justify-center">
                  <Wine className="w-6 h-6 text-champagne-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-bordeaux-900">Burgundy Treasures</h3>
                  <p className="text-sm text-gray-600">Explore exceptional Burgundy wines</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 