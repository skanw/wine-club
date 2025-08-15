import { useState } from 'react'
import { 
  Wine, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Package, 
  CreditCard,
  Gift,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Eye,
  ShoppingCart,
  Heart,
  Share2
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

interface DemoSubscriptionTier {
  id: string
  name: string
  price: number
  bottlesPerMonth: number
  features: string[]
  popular?: boolean
}

interface DemoWine {
  id: string
  name: string
  varietal: string
  vintage: number
  price: number
  rating: number
  description: string
  imageUrl: string
  inStock: boolean
  featured?: boolean
}

interface DemoMember {
  id: string
  name: string
  email: string
  joinDate: string
  subscriptionTier: string
  status: 'active' | 'paused' | 'cancelled'
  totalOrders: number
  lifetimeValue: number
}

export default function DemoWineCavePage() {
  const [activeView, setActiveView] = useState<'storefront' | 'dashboard' | 'members'>('storefront')
  const [selectedTier, setSelectedTier] = useState<string>('')
  
  // Demo interaction handlers with visual feedback
  const handleTierSelection = (tierId: string) => {
    setSelectedTier(tierId)
    // Show feedback message
    if (typeof window !== 'undefined') {
      const tierName = subscriptionTiers.find(t => t.id === tierId)?.name || 'subscription plan'
      alert(`✨ Demo Action: Selected ${tierName}!\n\nIn the real platform, this would navigate to checkout.`)
    }
  }
  
  const handleWineAction = (action: string, wineId: string) => {
    // Show feedback for wine actions
    if (typeof window !== 'undefined') {
      const wine = featuredWines.find(w => w.id === wineId)
      const actionText = action === 'add-to-cart' ? 'Added to cart' : 
                        action === 'add-to-wishlist' ? 'Added to wishlist' : 
                        action === 'share' ? 'Shared' : action
      alert(`🍷 Demo Action: ${actionText}${wine ? ` - ${wine.name}` : ''}!\n\nIn the real platform, this would update your cart/wishlist.`)
    }
  }
  
  const handleDashboardAction = (action: string) => {
    // Show feedback for dashboard actions
    if (typeof window !== 'undefined') {
      const actionTexts: Record<string, string> = {
        'add-wines': '📦 Add Wines - Opens inventory management',
        'send-newsletter': '📧 Send Newsletter - Opens email composer',
        'create-promotion': '🎁 Create Promotion - Opens promotion builder',
        'schedule-event': '📅 Schedule Event - Opens event calendar',
        'export-members': '📊 Export Members - Downloads member data',
        'settings': '⚙️ Settings - Opens platform configuration',
        'start-trial': '🚀 Start Free Trial - Begins registration process',
        'schedule-demo': '📞 Schedule Demo - Books consultation call'
      }
      
      const message = actionTexts[action] || `Demo Action: ${action}`
      alert(`${message}\n\nIn the real platform, this would navigate to the actual feature.`)
    }
  }

  // Demo data
  const demoCave = {
    name: "Maison Dubois Wine Cave",
    description: "Family-owned wine cave in the heart of Bordeaux, curating exceptional wines since 1887.",
    location: "Bordeaux, France",
    rating: 4.8,
    memberCount: 347,
    yearEstablished: 1887,
    ownerName: "Pierre Dubois",
    specialty: "Bordeaux Reds & Vintage Selections"
  }

  const subscriptionTiers: DemoSubscriptionTier[] = [
    {
      id: 'essential',
      name: 'Essential Selection',
      price: 45,
      bottlesPerMonth: 2,
      features: [
        '2 carefully curated bottles',
        'Tasting notes by Pierre',
        'Monthly newsletter',
        'Member discount: 10%'
      ]
    },
    {
      id: 'premium',
      name: 'Connoisseur Collection',
      price: 89,
      bottlesPerMonth: 3,
      popular: true,
      features: [
        '3 premium bottles',
        'Rare vintage access',
        'Virtual tasting sessions',
        'Member discount: 15%',
        'Free shipping',
        'Gift wrap included'
      ]
    },
    {
      id: 'cellar',
      name: 'Cellar Master Reserve',
      price: 159,
      bottlesPerMonth: 5,
      features: [
        '5 exclusive bottles',
        'Limited edition wines',
        'Personal sommelier calls',
        'Member discount: 20%',
        'Priority access to events',
        'Cellar storage recommendations'
      ]
    }
  ]

  const featuredWines: DemoWine[] = [
    {
      id: '1',
      name: 'Château Margaux',
      varietal: 'Cabernet Sauvignon Blend',
      vintage: 2018,
      price: 125,
      rating: 4.9,
      description: 'An exceptional vintage from one of Bordeaux\'s most prestigious châteaux.',
      imageUrl: '/wine-bottle-red.svg',
      inStock: true,
      featured: true
    },
    {
      id: '2', 
      name: 'Domaine Chanson Beaune',
      varietal: 'Pinot Noir',
      vintage: 2020,
      price: 45,
      rating: 4.6,
      description: 'Elegant Burgundy with notes of cherry and earth.',
      imageUrl: '/wine-bottle-red.svg',
      inStock: true
    },
    {
      id: '3',
      name: 'Sancerre Les Romains',
      varietal: 'Sauvignon Blanc',
      vintage: 2021,
      price: 32,
      rating: 4.7,
      description: 'Crisp Loire Valley white with mineral complexity.',
      imageUrl: '/wine-bottle-red.svg',
      inStock: false
    }
  ]

  const demoMembers: DemoMember[] = [
    {
      id: '1',
      name: 'Marie Laurent',
      email: 'marie.laurent@email.com',
      joinDate: '2023-03-15',
      subscriptionTier: 'Connoisseur Collection',
      status: 'active',
      totalOrders: 12,
      lifetimeValue: 1068
    },
    {
      id: '2',
      name: 'Jean-Claude Martin',
      email: 'jc.martin@email.com', 
      joinDate: '2023-01-22',
      subscriptionTier: 'Cellar Master Reserve',
      status: 'active',
      totalOrders: 15,
      lifetimeValue: 2385
    },
    {
      id: '3',
      name: 'Sophie Moreau',
      email: 'sophie.m@email.com',
      joinDate: '2023-07-08',
      subscriptionTier: 'Essential Selection',
      status: 'paused',
      totalOrders: 6,
      lifetimeValue: 270
    }
  ]

  const renderStorefront = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-bordeaux-900 via-bordeaux-800 to-bordeaux-700 text-white rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-champagne-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-bordeaux-300/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-champagne-600/20 rounded-xl backdrop-blur-sm">
              <Wine className="h-8 w-8 text-champagne-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold bg-gradient-to-r from-white to-champagne-200 bg-clip-text text-transparent">
                {demoCave.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-champagne-400 rounded-full animate-pulse"></div>
                <span className="text-champagne-300 text-sm uppercase tracking-wider">Premium Wine Cave</span>
              </div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-champagne-100 mb-8 max-w-3xl leading-relaxed font-light">
            {demoCave.description}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
              <div className="p-2 bg-champagne-600/20 rounded-lg">
                <MapPin className="h-5 w-5 text-champagne-300" />
              </div>
              <div>
                <div className="text-xs text-champagne-400 uppercase tracking-wide">Location</div>
                <div className="text-white font-medium">{demoCave.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
              <div className="p-2 bg-champagne-600/20 rounded-lg">
                <Star className="h-5 w-5 fill-current text-champagne-300" />
              </div>
              <div>
                <div className="text-xs text-champagne-400 uppercase tracking-wide">Rating</div>
                <div className="text-white font-medium">{demoCave.rating}/5.0</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
              <div className="p-2 bg-champagne-600/20 rounded-lg">
                <Users className="h-5 w-5 text-champagne-300" />
              </div>
              <div>
                <div className="text-xs text-champagne-400 uppercase tracking-wide">Members</div>
                <div className="text-white font-medium">{demoCave.memberCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors">
              <div className="p-2 bg-champagne-600/20 rounded-lg">
                <Clock className="h-5 w-5 text-champagne-300" />
              </div>
              <div>
                <div className="text-xs text-champagne-400 uppercase tracking-wide">Est.</div>
                <div className="text-white font-medium">{demoCave.yearEstablished}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bordeaux-50 rounded-full mb-4">
            <div className="w-2 h-2 bg-bordeaux-600 rounded-full"></div>
            <span className="text-bordeaux-700 text-sm font-medium uppercase tracking-wider">Subscription Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-bordeaux-900 mb-4">
            Choose Your Wine Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover carefully curated wines delivered to your door, with expert tasting notes and exclusive access.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => (
            <Card key={tier.id} className={`relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              tier.popular 
                ? 'border-bordeaux-500 bg-gradient-to-br from-bordeaux-50 to-champagne-50 shadow-xl scale-105 ring-2 ring-bordeaux-200' 
                : 'border-gray-200 hover:border-bordeaux-300 bg-white'
            }`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 text-white px-4 py-2 shadow-lg">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-bordeaux-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-4xl font-bold text-bordeaux-700">€{tier.price}</span>
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-champagne-100 rounded-full">
                  <Wine className="h-4 w-4 text-bordeaux-600" />
                  <span className="text-bordeaux-800 font-medium">{tier.bottlesPerMonth} bottles/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-bordeaux-500 to-bordeaux-600 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={tier.popular ? 'primary' : 'outline'}
                className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 hover:from-bordeaux-700 hover:to-bordeaux-800 shadow-lg' 
                    : 'hover:bg-bordeaux-50 hover:border-bordeaux-400'
                } ${selectedTier === tier.id ? 'ring-2 ring-bordeaux-300' : ''}`}
                onClick={() => handleTierSelection(tier.id)}
              >
                {selectedTier === tier.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Selected
                  </span>
                ) : (
                  'Choose Plan'
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Wines */}
      <div className="relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-100 rounded-full mb-4">
            <Wine className="h-4 w-4 text-bordeaux-600" />
            <span className="text-bordeaux-700 text-sm font-medium uppercase tracking-wider">Featured Selection</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-bordeaux-900 mb-4">
            Curated Wine Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked by our sommelier Pierre Dubois, each wine tells a story of terroir and tradition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredWines.map((wine, index) => (
            <Card key={wine.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
              <div className="relative overflow-hidden">
                <img 
                  src={wine.imageUrl} 
                  alt={wine.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {wine.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 text-white px-3 py-1 shadow-lg">
                      ⭐ Featured
                    </Badge>
                  </div>
                )}
                {!wine.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/90 rounded-full backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">{wine.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-serif font-bold text-bordeaux-900 mb-2 group-hover:text-bordeaux-700 transition-colors">
                    {wine.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="font-medium">{wine.varietal}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{wine.vintage}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {wine.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-bordeaux-700">
                    €{wine.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    per bottle
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 group-hover:border-bordeaux-400 transition-colors" 
                    disabled={!wine.inStock}
                    onClick={() => handleWineAction('add-to-cart', wine.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="px-3 hover:bg-bordeaux-50 transition-colors"
                    onClick={() => handleWineAction('add-to-wishlist', wine.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-bordeaux-900 via-bordeaux-800 to-bordeaux-700 border-0 p-12 text-center shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-champagne-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-bordeaux-300/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-600/20 rounded-full mb-6 backdrop-blur-sm">
            <Wine className="h-5 w-5 text-champagne-300" />
            <span className="text-champagne-200 text-sm font-medium uppercase tracking-wider">Join Our Community</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Begin Your Wine Journey
          </h3>
          <p className="text-xl text-champagne-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the finest wines from {demoCave.name}, carefully selected by master sommelier {demoCave.ownerName} 
            and delivered to your door every month. Join {demoCave.memberCount} wine enthusiasts already on this journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button 
              size="lg" 
              className="bg-champagne-600 hover:bg-champagne-500 text-champagne-900 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto"
              onClick={() => handleTierSelection('premium')}
            >
              Start Your Subscription
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-champagne-300 text-champagne-200 hover:bg-champagne-900/20 px-8 py-4 text-lg backdrop-blur-sm w-full sm:w-auto"
              onClick={() => handleWineAction('share', 'wine-cave')}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share with Friends
            </Button>
          </div>
          <div className="mt-8 flex justify-center items-center gap-8 text-champagne-300">
            <div className="text-center">
              <div className="text-2xl font-bold">{demoCave.memberCount}</div>
              <div className="text-sm uppercase tracking-wide">Happy Members</div>
            </div>
            <div className="w-px h-12 bg-champagne-400/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{demoCave.rating}</div>
              <div className="text-sm uppercase tracking-wide">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-champagne-400/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{new Date().getFullYear() - demoCave.yearEstablished}+</div>
              <div className="text-sm uppercase tracking-wide">Years Experience</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-bordeaux-900">Wine Cave Dashboard</h1>
          <p className="text-gray-600">Manage your membership platform</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline"
            onClick={() => setActiveView('storefront')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Storefront
          </Button>
          <Button onClick={() => handleDashboardAction('settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group p-6 bg-gradient-to-br from-white to-bordeaux-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Members</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-bordeaux-900 mb-2">347</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">+12%</span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </Card>
        
        <Card className="group p-6 bg-gradient-to-br from-white to-bordeaux-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-bordeaux-500 to-bordeaux-600 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Revenue</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-bordeaux-900 mb-2">€24,680</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">+18%</span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </Card>
        
        <Card className="group p-6 bg-gradient-to-br from-white to-bordeaux-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending Orders</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-bordeaux-900 mb-2">89</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
              <Clock className="h-3 w-3 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700">2 days</span>
            </div>
            <span className="text-xs text-gray-500">to ship</span>
          </div>
        </Card>
        
        <Card className="group p-6 bg-gradient-to-br from-white to-bordeaux-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Retention Rate</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-bordeaux-900 mb-2">94%</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Excellent</span>
            </div>
            <span className="text-xs text-gray-500">industry avg: 85%</span>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">New member joined: Marie Laurent</span>
              <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Order shipped: #W-2024-0234</span>
              <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Low stock alert: Château Margaux 2018</span>
              <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Payment received: €159 (Premium plan)</span>
              <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-bordeaux-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleDashboardAction('add-wines')}
            >
              <Package className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add Wines</div>
                <div className="text-xs text-gray-500">Update inventory</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleDashboardAction('send-newsletter')}
            >
              <Bell className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Send Newsletter</div>
                <div className="text-xs text-gray-500">Notify members</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleDashboardAction('create-promotion')}
            >
              <Gift className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create Promotion</div>
                <div className="text-xs text-gray-500">Special offers</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleDashboardAction('schedule-event')}
            >
              <Calendar className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Schedule Event</div>
                <div className="text-xs text-gray-500">Wine tastings</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold text-bordeaux-900">Members Management</h2>
        <Button onClick={() => handleDashboardAction('export-members')}>
          <Users className="h-4 w-4 mr-2" />
          Export Members
        </Button>
      </div>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-bordeaux-900">Active Members ({demoMembers.length})</h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Member</th>
                <th className="text-left p-4 font-medium text-gray-700">Subscription</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Join Date</th>
                <th className="text-left p-4 font-medium text-gray-700">Orders</th>
                <th className="text-left p-4 font-medium text-gray-700">LTV</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-bordeaux-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{member.subscriptionTier}</td>
                  <td className="p-4">
                    <Badge 
                      variant={member.status === 'active' ? 'default' : 'secondary'}
                      className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">{member.totalOrders}</td>
                  <td className="p-4 text-sm font-medium">€{member.lifetimeValue}</td>
                  <td className="p-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDashboardAction(`view-member-${member.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 p-6">
          {demoMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-bordeaux-900">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.email}</div>
                </div>
                <Badge 
                  variant={member.status === 'active' ? 'default' : 'secondary'}
                  className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {member.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Subscription:</span>
                  <div className="font-medium">{member.subscriptionTier}</div>
                </div>
                <div>
                  <span className="text-gray-500">Joined:</span>
                  <div className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Orders:</span>
                  <div className="font-medium">{member.totalOrders}</div>
                </div>
                <div>
                  <span className="text-gray-500">LTV:</span>
                  <div className="font-medium">€{member.lifetimeValue}</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full"
                onClick={() => handleDashboardAction(`view-member-${member.id}`)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-white">
      {/* Demo Header */}
      <div className="bg-bordeaux-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Wine className="h-6 w-6 animate-pulse" />
            <span className="font-semibold text-lg">Wine Cave Demo Platform</span>
          </div>
          <Badge className="bg-champagne-600 text-champagne-900 animate-bounce">
            🎭 Demo Preview
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/95 backdrop-blur-md border-b border-bordeaux-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              onClick={() => setActiveView('storefront')}
              className={`relative py-4 px-6 font-medium text-sm transition-all duration-200 rounded-t-lg sm:rounded-lg ${
                activeView === 'storefront'
                  ? 'bg-bordeaux-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-bordeaux-600 hover:bg-bordeaux-50'
              }`}
            >
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Eye className="h-4 w-4" />
                <span>Storefront View</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`relative py-4 px-6 font-medium text-sm transition-all duration-200 rounded-t-lg sm:rounded-lg ${
                activeView === 'dashboard'
                  ? 'bg-bordeaux-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-bordeaux-600 hover:bg-bordeaux-50'
              }`}
            >
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <BarChart3 className="h-4 w-4" />
                <span>Owner Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveView('members')}
              className={`relative py-4 px-6 font-medium text-sm transition-all duration-200 rounded-t-lg sm:rounded-lg ${
                activeView === 'members'
                  ? 'bg-bordeaux-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-bordeaux-600 hover:bg-bordeaux-50'
              }`}
            >
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Users className="h-4 w-4" />
                <span>Members Management</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="transition-all duration-500 ease-in-out">
          {activeView === 'storefront' && renderStorefront()}
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'members' && renderMembers()}
        </div>
      </div>

      {/* Demo Footer */}
      <div className="bg-bordeaux-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xl font-serif font-bold mb-2">Ready to Launch Your Wine Cave Platform?</h3>
          <p className="text-champagne-200 mb-6">
            Join hundreds of wine caves already growing their membership with our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              size="lg" 
              className="bg-champagne-600 text-champagne-900 hover:bg-champagne-500 w-full sm:w-auto"
              onClick={() => handleDashboardAction('start-trial')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-champagne-400 text-champagne-200 hover:bg-champagne-900 w-full sm:w-auto"
              onClick={() => handleDashboardAction('schedule-demo')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
