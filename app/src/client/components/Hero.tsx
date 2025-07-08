import { Link } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useScrollReveal } from '../../client/hooks/useScrollReveal';
import Button from './ui/Button';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

const Hero = () => {
  const { data: user } = useAuth();
  
  // Use scroll reveals for hero elements
  const titleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 0
  });

  const subtitleReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 150
  });

  const ctaReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 300
  });

  const statsReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 450
  });

  const featuresReveal = useScrollReveal({ 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    delay: 600
  });

  return (
    <section className="hero-responsive full-bleed relative overflow-hidden gpu-accelerated">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="responsive-image absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, var(--champagne-50) 0%, var(--champagne-100) 100%)',
            width: '100vw',
            height: '100vh',
            willChange: 'transform'
          }}
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Defensive container wrapper for main content */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="relative z-20 responsive-container-narrow flex items-center justify-center h-full">
          <div className="space-responsive-xl text-center">
            {/* Main Content Card */}
            <div 
              ref={titleReveal.ref} 
              className="hero-reveal p-responsive-md"
              style={{ 
                borderRadius: '16px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-bordeaux-50 text-bordeaux-700 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                Trusted by 500+ Wine Clubs
              </div>

              {/* Main Headline */}
              <h1 
                className="responsive-heading-1 font-luxury text-text-primary leading-tight mb-6"
                style={{
                  maxWidth: '64ch',
                  margin: '0 auto 1.5rem auto'
                }}
              >
                The Complete Platform for
                <span className="text-bordeaux-600"> Professional Wine Clubs</span>
              </h1>

              {/* Subtitle */}
              <div 
                ref={subtitleReveal.ref}
                className="hero-subtitle-reveal text-text-secondary mb-8 responsive-text leading-relaxed"
                style={{
                  maxWidth: '64ch',
                  margin: '0 auto 2rem auto'
                }}
              >
                Streamline your wine club operations with our all-in-one platform. 
                Manage members, inventory, shipping, and analytics in one place. 
                Scale your business with enterprise-grade tools designed for wine professionals.
              </div>

              {/* CTA Buttons */}
              <div 
                ref={ctaReveal.ref}
                className="cta-bar-reveal flex-responsive justify-center items-center space-x-4"
              >
                <Button
                  to={user ? "/dashboard" : "/signup"}
                  variant="primary"
                  size="lg"
                  leftIcon={<Zap className="w-5 h-5" />}
                  className="group touch-optimized"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </Button>
                
                <Button
                  to="/pricing"
                  variant="secondary"
                  size="lg"
                  leftIcon={<BarChart3 className="w-5 h-5" />}
                  className="group touch-optimized"
                >
                  View Pricing
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No setup fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div ref={statsReveal.ref} className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-900 mb-2">500+</div>
                  <div className="text-gray-600">Wine Clubs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-900 mb-2">50K+</div>
                  <div className="text-gray-600">Members Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bordeaux-900 mb-2">$2M+</div>
                  <div className="text-gray-600">Revenue Generated</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div ref={featuresReveal.ref} className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need to succeed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Member Management</h3>
                  <p className="text-gray-600 text-sm">
                    Complete member profiles, subscription management, and automated communications.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600 text-sm">
                    Powerful analytics to understand member behavior and optimize your business.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                  <p className="text-gray-600 text-sm">
                    Bank-level security with SOC 2 compliance and data encryption.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Inventory Management</h3>
                  <p className="text-gray-600 text-sm">
                    Track wine inventory, manage suppliers, and automate reordering.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Automated Shipping</h3>
                  <p className="text-gray-600 text-sm">
                    Automated shipping labels, tracking, and delivery notifications.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-bordeaux-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">
                    Dedicated support team with phone, email, and live chat options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;