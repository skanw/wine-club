import React, { useState, useEffect, useRef } from 'react';
import './SubscriptionPage.css';

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

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'red' | 'white'>('red');

  // Simple animation triggers
  const [animationsTriggered, setAnimationsTriggered] = useState({
    hero: false,
    whyJoin: false,
    bottles: false,
    plans: false,
  });

  const heroRef = useRef<HTMLElement>(null);
  const whyJoinRef = useRef<HTMLElement>(null);
  const bottlesRef = useRef<HTMLElement>(null);
  const plansRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) {
              setAnimationsTriggered(prev => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    [heroRef, whyJoinRef, bottlesRef, plansRef].forEach((ref, index) => {
      if (ref.current) {
        ref.current.setAttribute('data-section', ['hero', 'whyJoin', 'bottles', 'plans'][index]);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Sample data
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
    <div className="subscription-page">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`hero-section ${animationsTriggered.hero ? 'animate-fadeInUp' : ''}`}
      >
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">
              Curated Excellence
              <span className="hero-subtitle">Delivered to Your Door</span>
            </h1>
            <p className="hero-description">
              Experience the world's finest wines through our sommelier-curated subscription service. 
              Each bottle tells a story of terroir, tradition, and exceptional craftsmanship.
            </p>
            <button className="btn-primary hero-cta">Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section 
        ref={whyJoinRef}
        className={`why-join-section ${animationsTriggered.whyJoin ? 'animate-slideInUp' : ''}`}
      >
        <div className="container">
          <h2 className="section-title">Why Join Our Cellar</h2>
          <div className="benefits-grid">
            <div className="benefit-card hover-lift">
              <div className="benefit-icon">🍷</div>
              <h3>Expert Curation</h3>
              <p>Our master sommeliers select only the finest bottles from premier vineyards worldwide.</p>
            </div>
            <div className="benefit-card hover-lift">
              <div className="benefit-icon">📦</div>
              <h3>Perfect Delivery</h3>
              <p>Temperature-controlled shipping ensures every bottle arrives in pristine condition.</p>
            </div>
            <div className="benefit-card hover-lift">
              <div className="benefit-icon">📚</div>
              <h3>Learn & Discover</h3>
              <p>Detailed tasting notes and stories behind each selection enhance your wine journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bottles */}
      <section 
        ref={bottlesRef}
        className={`featured-bottles-section ${animationsTriggered.bottles ? 'animate-zoom' : ''}`}
      >
        <div className="container">
          <h2 className="section-title">This Month's Selection</h2>
          <div className="bottle-tabs">
            <button
              className={`tab-btn ${activeTab === 'red' ? 'active' : ''}`}
              onClick={() => setActiveTab('red')}
            >
              Red
            </button>
            <button
              className={`tab-btn ${activeTab === 'white' ? 'active' : ''}`}
              onClick={() => setActiveTab('white')}
            >
              White
            </button>
          </div>
          
          <div className="bottles-grid">
            {currentBottles.map((bottle, index) => (
              <div key={bottle.id} className={`bottle-card ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className="bottle-image hover-zoom">
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
                  <button className="btn-outline add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section 
        ref={plansRef}
        className={`plans-section ${animationsTriggered.plans ? 'animate-fadeInUp' : ''}`}
      >
        <div className="container">
          <h2 className="section-title">Choose Your Journey</h2>
          <div className="plans-grid">
            {currentPlans.map(plan => (
              <div key={plan.id} className="plan-card hover-lift">
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
                <button className="btn-primary plan-cta">Select Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="subscription-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
            <div className="social-icons">
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="m16 11.37-8 0"/>
                  <path d="m12 15.37 0-8"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
            </div>
            <div className="newsletter-signup">
              <input type="email" placeholder="Your email address" />
              <button className="btn-outline">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPage; 