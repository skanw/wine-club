import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../client/hooks/useScrollAnimation';
import './premium-subscription.css';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  frequency: 'monthly' | 'quarterly';
  bottles: number;
  description: string;
  features: string[];
}

interface FeaturedBottle {
  id: string;
  name: string;
  vineyard: string;
  year: number;
  price: number;
  image: string;
  tastingNotes: string[];
  description: string;
}

const PremiumSubscriptionPage: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<'red' | 'white'>('red');
  const [activeTab, setActiveTab] = useState<'red' | 'white'>('red');

  const heroAnimation = useScrollAnimation({ animationClass: 'animate-wine-reveal' });
  const whyJoinAnimation = useScrollAnimation({ animationClass: 'animate-fade-in-up', delay: 200 });
  const bottlesAnimation = useScrollAnimation({ animationClass: 'animate-wine-pour', delay: 400 });
  const plansAnimation = useScrollAnimation({ animationClass: 'animate-fade-in-up', delay: 600 });

  useEffect(() => {
    document.body.className = `theme-${activeTheme}`;
  }, [activeTheme]);

  const redWinePlans: SubscriptionPlan[] = [
    {
      id: 'red-monthly',
      name: 'Bordeaux Monthly',
      price: 89,
      frequency: 'monthly',
      bottles: 3,
      description: 'Curated selection of premium red wines',
      features: ['3 Premium Bottles', 'Tasting Notes', 'Sommelier Selection', 'Free Shipping']
    },
    {
      id: 'red-quarterly',
      name: 'Vintage Quarterly',
      price: 249,
      frequency: 'quarterly',
      bottles: 9,
      description: 'Exclusive vintage collection every season',
      features: ['9 Vintage Bottles', 'Collector\'s Notes', 'Rare Selections', 'Priority Access']
    }
  ];

  const whiteWinePlans: SubscriptionPlan[] = [
    {
      id: 'white-monthly',
      name: 'Chardonnay Monthly',
      price: 79,
      frequency: 'monthly',
      bottles: 3,
      description: 'Elegant white wines from premier regions',
      features: ['3 Premium Bottles', 'Tasting Notes', 'Sommelier Selection', 'Free Shipping']
    },
    {
      id: 'white-quarterly',
      name: 'Champagne Quarterly',
      price: 329,
      frequency: 'quarterly',
      bottles: 6,
      description: 'Luxury sparkling wines and champagnes',
      features: ['6 Luxury Bottles', 'Vintage Selection', 'Limited Editions', 'White Glove Service']
    }
  ];

  const featuredBottles: { red: FeaturedBottle[], white: FeaturedBottle[] } = {
    red: [
      {
        id: 'red-1',
        name: 'Château Margaux',
        vineyard: 'Bordeaux, France',
        year: 2018,
        price: 125,
        image: '/wine-bottle-red.svg',
        tastingNotes: ['Dark Cherry', 'Tobacco', 'Cedar', 'Vanilla'],
        description: 'An exceptional vintage with complex layers of fruit and earth, showcasing the elegance of Margaux terroir.'
      },
      {
        id: 'red-2',
        name: 'Opus One',
        vineyard: 'Napa Valley, California',
        year: 2019,
        price: 185,
        image: '/wine-bottle-red.svg',
        tastingNotes: ['Blackcurrant', 'Graphite', 'Espresso', 'Dark Chocolate'],
        description: 'A masterful blend that represents the pinnacle of Napa Valley winemaking excellence.'
      }
    ],
    white: [
      {
        id: 'white-1',
        name: 'Dom Pérignon',
        vineyard: 'Champagne, France',
        year: 2012,
        price: 195,
        image: '/wine-bottle-white.svg',
        tastingNotes: ['Citrus Zest', 'Brioche', 'Almond', 'Mineral'],
        description: 'The epitome of champagne craftsmanship, with delicate bubbles and extraordinary depth.'
      },
      {
        id: 'white-2',
        name: 'Chablis Grand Cru',
        vineyard: 'Burgundy, France',
        year: 2020,
        price: 89,
        image: '/wine-bottle-white.svg',
        tastingNotes: ['Green Apple', 'Oyster Shell', 'Lemon', 'Flint'],
        description: 'Pure expression of Chablis terroir with crystalline precision and mineral complexity.'
      }
    ]
  };

  const currentPlans = activeTab === 'red' ? redWinePlans : whiteWinePlans;
  const currentBottles = featuredBottles[activeTab];

  return (
    <div className="premium-subscription">
      {/* Theme Toggle */}
      <div className="theme-toggle-bar">
        <div className="theme-toggle">
          <button
            className={`theme-btn ${activeTheme === 'red' ? 'active' : ''}`}
            onClick={() => setActiveTheme('red')}
          >
            Red Wine
          </button>
          <button
            className={`theme-btn ${activeTheme === 'white' ? 'active' : ''}`}
            onClick={() => setActiveTheme('white')}
          >
            White Wine
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroAnimation.elementRef}
        className={`hero-section ${heroAnimation.className}`}
      >
        <div className="hero-image">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Curated Excellence
            <span className="hero-subtitle">Delivered to Your Door</span>
          </h1>
          <p className="hero-description">
            Experience the world's finest wines through our sommelier-curated subscription service. 
            Each bottle tells a story of terroir, tradition, and exceptional craftsmanship.
          </p>
          <button className="hero-cta">Subscribe Now</button>
        </div>
      </section>

      {/* Why Join Section */}
      <section 
        ref={whyJoinAnimation.elementRef}
        className={`why-join-section ${whyJoinAnimation.className}`}
      >
        <div className="container">
          <h2 className="section-title">Why Join Our Cellar</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🍷</div>
              <h3>Expert Curation</h3>
              <p>Our master sommeliers select only the finest bottles from premier vineyards worldwide.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📦</div>
              <h3>Perfect Delivery</h3>
              <p>Temperature-controlled shipping ensures every bottle arrives in pristine condition.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📚</div>
              <h3>Learn & Discover</h3>
              <p>Detailed tasting notes and stories behind each selection enhance your wine journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bottles */}
      <section 
        ref={bottlesAnimation.elementRef}
        className={`featured-bottles-section ${bottlesAnimation.className}`}
      >
        <div className="container">
          <h2 className="section-title">This Month's Selection</h2>
          <div className="bottle-tabs">
            <button
              className={`tab-btn ${activeTab === 'red' ? 'active' : ''}`}
              onClick={() => setActiveTab('red')}
            >
              Red Collection
            </button>
            <button
              className={`tab-btn ${activeTab === 'white' ? 'active' : ''}`}
              onClick={() => setActiveTab('white')}
            >
              White Collection
            </button>
          </div>
          
          <div className="bottles-grid">
            {currentBottles.map((bottle, index) => (
              <div key={bottle.id} className={`bottle-card ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className="bottle-image">
                  <img src={bottle.image} alt={bottle.name} />
                </div>
                <div className="bottle-info">
                  <div className="bottle-header">
                    <h3 className="bottle-name">{bottle.name}</h3>
                    <p className="bottle-vineyard">{bottle.vineyard} • {bottle.year}</p>
                    <div className="bottle-price">${bottle.price}</div>
                  </div>
                  <div className="tasting-notes">
                    <h4>Tasting Notes</h4>
                    <div className="notes-tags">
                      {bottle.tastingNotes.map(note => (
                        <span key={note} className="note-tag">{note}</span>
                      ))}
                    </div>
                  </div>
                  <p className="bottle-description">{bottle.description}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section 
        ref={plansAnimation.elementRef}
        className={`plans-section ${plansAnimation.className}`}
      >
        <div className="container">
          <h2 className="section-title">Choose Your Journey</h2>
          <div className="plans-grid">
            {currentPlans.map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${plan.price}</span>
                    <span className="price-period">/{plan.frequency}</span>
                  </div>
                </div>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-bottles">{plan.bottles} bottles per shipment</div>
                <ul className="plan-features">
                  {plan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className="plan-cta">Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Footer */}
      <footer className="premium-footer">
        <div className="container">
          <div className="footer-content">
            <h3>Stay Connected</h3>
            <p>Receive exclusive offers and wine insights</p>
            <div className="newsletter-signup">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumSubscriptionPage; 