import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { 
  Wine, 
  Star, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Filter,
  Search,
  Sparkles,
  ChefHat,
  BookOpen
} from 'lucide-react';
import Button from '../../components/ui/Button';

interface WineRecommendation {
  id: string;
  wineId: string;
  name: string;
  region: string;
  grapeVarieties: string[];
  vintage?: number;
  price: number;
  rating?: number;
  description?: string;
  sommelierNotes: string;
  pairingSuggestions: string[];
  confidence: number;
}

interface WineInsight {
  type: string;
  title: string;
  data: any;
  description: string;
}

const AISommelierPage: React.FC = () => {
  const [selectedWine, setSelectedWine] = useState<string | null>(null);
  const [showTastingNotes, setShowTastingNotes] = useState(false);
  const [tastingNotes, setTastingNotes] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'insights' | 'pairings'>('recommendations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState<number>(1000);

  // Mock data - replace with actual queries when operations are implemented
  const recommendations: WineRecommendation[] = [
    {
      id: '1',
      wineId: 'wine1',
      name: 'Château Margaux 2018',
      region: 'Bordeaux, France',
      grapeVarieties: ['Cabernet Sauvignon', 'Merlot'],
      vintage: 2018,
      price: 899.99,
      rating: 4.8,
      description: 'A legendary Bordeaux with exceptional complexity and aging potential.',
      sommelierNotes: 'This exceptional Margaux showcases the perfect balance of power and elegance. The nose reveals layers of black fruits, tobacco, and subtle oak. On the palate, you\'ll find structured tannins supporting rich dark fruit flavors with hints of cedar and leather. The finish is remarkably long and complex.',
      pairingSuggestions: ['Beef tenderloin', 'Aged cheeses', 'Dark chocolate', 'Roasted lamb'],
      confidence: 0.95
    },
    {
      id: '2',
      wineId: 'wine2',
      name: 'Dom Pérignon 2012',
      region: 'Champagne, France',
      grapeVarieties: ['Chardonnay', 'Pinot Noir'],
      vintage: 2012,
      price: 299.99,
      rating: 4.9,
      description: 'A vintage champagne of extraordinary finesse and complexity.',
      sommelierNotes: 'This vintage Dom Pérignon is a masterpiece of precision and elegance. Fine bubbles carry aromas of white flowers, citrus zest, and brioche. The palate is creamy yet crisp, with notes of green apple, lemon, and subtle minerality. Perfect for celebrations or as an aperitif.',
      pairingSuggestions: ['Oysters', 'Caviar', 'Light seafood', 'Fresh fruit'],
      confidence: 0.92
    },
    {
      id: '3',
      wineId: 'wine3',
      name: 'Barolo Riserva 2015',
      region: 'Piedmont, Italy',
      grapeVarieties: ['Nebbiolo'],
      vintage: 2015,
      price: 189.99,
      rating: 4.7,
      description: 'A powerful and structured Barolo with exceptional aging potential.',
      sommelierNotes: 'This Barolo Riserva displays the classic Nebbiolo characteristics with remarkable intensity. Aromas of roses, tar, and red fruits dominate the nose. The palate is full-bodied with firm tannins, flavors of cherry, leather, and truffle. Decant for 2-3 hours before serving.',
      pairingSuggestions: ['Braised beef', 'Truffle pasta', 'Aged Parmigiano', 'Game meats'],
      confidence: 0.88
    }
  ];

  const insights: WineInsight[] = [
    {
      type: 'varietal_preference',
      title: 'Your Favorite Varietals',
      data: [
        { varietal: 'Cabernet Sauvignon', averageRating: 4.6, count: 12 },
        { varietal: 'Pinot Noir', averageRating: 4.4, count: 8 },
        { varietal: 'Chardonnay', averageRating: 4.2, count: 6 }
      ],
      description: 'You consistently enjoy Cabernet Sauvignon wines with an average rating of 4.6/5.'
    },
    {
      type: 'price_preference',
      title: 'Price Range Preference',
      data: { budget: 3, mid: 15, premium: 8 },
      description: 'You tend to prefer mid-range wines (€50-€200).'
    }
  ];

  const handleGenerateTastingNotes = async (wineId: string) => {
    setIsGeneratingNotes(true);
    setSelectedWine(wineId);
    
    // Simulate API call
    setTimeout(() => {
      const wine = recommendations.find(r => r.wineId === wineId);
      if (wine) {
        setTastingNotes(wine.sommelierNotes);
      }
      setShowTastingNotes(true);
      setIsGeneratingNotes(false);
    }, 2000);
  };

  const filteredRecommendations = recommendations.filter(wine =>
    wine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    wine.price <= filterPrice
  );

  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-bordeaux-600" size={32} />
            <h1 className="text-4xl font-bold text-bordeaux-900">AI Sommelier</h1>
          </div>
          <p className="text-xl text-taupe-700 max-w-2xl mx-auto">
            Your personal wine expert powered by AI. Discover new favorites, get personalized recommendations, 
            and learn about wine pairing with expert guidance.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-bordeaux-600 text-white shadow-md'
                  : 'text-taupe-600 hover:text-bordeaux-600'
              }`}
            >
              <Wine className="inline mr-2" size={20} />
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-bordeaux-600 text-white shadow-md'
                  : 'text-taupe-600 hover:text-bordeaux-600'
              }`}
            >
              <TrendingUp className="inline mr-2" size={20} />
              Your Insights
            </button>
            <button
              onClick={() => setActiveTab('pairings')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'pairings'
                  ? 'bg-bordeaux-600 text-white shadow-md'
                  : 'text-taupe-600 hover:text-bordeaux-600'
              }`}
            >
              <ChefHat className="inline mr-2" size={20} />
              Food Pairings
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-taupe-700 mb-2">
                    Search Wines
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-taupe-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, region, or varietal..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-taupe-200 rounded-lg focus:ring-2 focus:ring-bordeaux-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <label className="block text-sm font-medium text-taupe-700 mb-2">
                    Max Price: €{filterPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filterPrice}
                    onChange={(e) => setFilterPrice(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((wine) => (
                <div key={wine.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-bordeaux-900 mb-1">{wine.name}</h3>
                        <p className="text-sm text-taupe-600">{wine.region}</p>
                        <p className="text-xs text-taupe-500">{wine.grapeVarieties.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="text-yellow-400" size={16} fill="currentColor" />
                          <span className="text-sm font-medium">{wine.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-bordeaux-600">€{wine.price}</span>
                      </div>
                    </div>

                    <p className="text-sm text-taupe-700 mb-4 line-clamp-2">{wine.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-taupe-600">
                          {Math.round(wine.confidence * 100)}% match
                        </span>
                      </div>
                                             <Button
                         size="sm"
                         variant="secondary"
                         onClick={() => handleGenerateTastingNotes(wine.wineId)}
                         disabled={isGeneratingNotes}
                       >
                        {isGeneratingNotes && selectedWine === wine.wineId ? (
                          'Generating...'
                        ) : (
                          <>
                            <BookOpen className="mr-1" size={14} />
                            Tasting Notes
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Pairing Suggestions */}
                    <div className="border-t border-taupe-100 pt-4">
                      <h4 className="text-sm font-medium text-taupe-700 mb-2">Perfect with:</h4>
                      <div className="flex flex-wrap gap-1">
                        {wine.pairingSuggestions.slice(0, 3).map((pairing, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-champagne-100 text-taupe-700 text-xs rounded-full"
                          >
                            {pairing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecommendations.length === 0 && (
              <div className="text-center py-12">
                <Wine className="mx-auto text-taupe-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-taupe-700 mb-2">No wines found</h3>
                <p className="text-taupe-600">Try adjusting your search criteria or price range.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">{insight.title}</h3>
                  <p className="text-taupe-700 mb-4">{insight.description}</p>
                  
                  {insight.type === 'varietal_preference' && (
                    <div className="space-y-3">
                      {insight.data.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-taupe-600">{item.varietal}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-400" size={14} fill="currentColor" />
                              <span className="text-sm font-medium">{item.averageRating}</span>
                            </div>
                            <span className="text-xs text-taupe-500">({item.count} wines)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.type === 'price_preference' && (
                    <div className="space-y-3">
                      {Object.entries(insight.data).map(([range, count]: [string, any]) => (
                        <div key={range} className="flex items-center justify-between">
                          <span className="text-sm text-taupe-600 capitalize">{range}</span>
                          <span className="text-sm font-medium text-bordeaux-600">{count} wines</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Your Wine Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-600 mb-2">26</div>
                  <div className="text-sm text-taupe-600">Wines Rated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-600 mb-2">4.3</div>
                  <div className="text-sm text-taupe-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-600 mb-2">8</div>
                  <div className="text-sm text-taupe-600">Favorites</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pairings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Food & Wine Pairing Guide</h3>
              <p className="text-taupe-700 mb-6">
                Discover the perfect wine for your meal. Our AI sommelier considers your preferences, 
                the dish's flavors, and cooking methods to suggest ideal pairings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { dish: 'Beef Tenderloin', cuisine: 'French', wine: 'Cabernet Sauvignon' },
                  { dish: 'Grilled Salmon', cuisine: 'Mediterranean', wine: 'Chardonnay' },
                  { dish: 'Pasta Carbonara', cuisine: 'Italian', wine: 'Pinot Grigio' },
                  { dish: 'Lamb Chops', cuisine: 'Mediterranean', wine: 'Syrah' },
                  { dish: 'Oysters', cuisine: 'Seafood', wine: 'Champagne' },
                  { dish: 'Dark Chocolate', cuisine: 'Dessert', wine: 'Port' },
                ].map((pairing, index) => (
                  <div key={index} className="border border-taupe-200 rounded-lg p-4 hover:border-bordeaux-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-bordeaux-900">{pairing.dish}</h4>
                      <span className="text-xs text-taupe-500">{pairing.cuisine}</span>
                    </div>
                    <p className="text-sm text-taupe-600">Perfect with: <span className="font-medium text-bordeaux-600">{pairing.wine}</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Pairing Tips</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-bordeaux-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-bordeaux-900">Match Intensity</h4>
                    <p className="text-sm text-taupe-600">Light dishes pair with light wines, heavy dishes with full-bodied wines.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-bordeaux-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-bordeaux-900">Consider Acidity</h4>
                    <p className="text-sm text-taupe-600">High-acid wines cut through rich, fatty foods beautifully.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-bordeaux-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-bordeaux-900">Regional Pairings</h4>
                    <p className="text-sm text-taupe-600">Wines often pair well with foods from the same region.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasting Notes Modal */}
        {showTastingNotes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-bordeaux-900">Sommelier Tasting Notes</h3>
                  <button
                    onClick={() => setShowTastingNotes(false)}
                    className="text-taupe-400 hover:text-taupe-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-taupe-700 leading-relaxed">{tastingNotes}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setShowTastingNotes(false)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISommelierPage; 