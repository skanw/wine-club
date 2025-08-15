import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { Wine, Menu, X, ArrowRight } from 'lucide-react';
import EnhancedButton from '../ui/EnhancedButton';
import { routes } from 'wasp/client/router';

export default function ModernNavbar() {
  const { data: user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug logging
  console.log('ModernNavbar rendering, user:', user);
  console.log('Available routes:', routes);

  const navigationItems = [
    { name: 'Features', href: routes.HowItWorksRoute.to },
    { name: 'Pricing', href: routes.PricingPageRoute.to },
    { name: 'About', href: routes.AboutRoute.to },
    { name: 'Blog', href: routes.BlogRoute.to },
    { name: 'Contact', href: routes.ContactRoute.to },
  ];

  console.log('Navigation items:', navigationItems);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Rounded container navbar */}
      <div className="mx-4 mt-4">
        <div className="bg-shell/95 backdrop-blur-md shadow-wc rounded-card border border-porcelain">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-champagne/50 rounded-lg p-1 transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-champagne to-chablis rounded-lg flex items-center justify-center shadow-md">
                  <Wine className="h-5 w-5 text-grape-seed" />
                </div>
                <span className="text-xl font-bold text-cave">WineClub</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-grape-seed hover:text-cave font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-champagne transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                ))}
                
                {user ? (
                  <Link 
                    to="/member-portal" 
                    className="text-grape-seed hover:text-cave font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-grape-seed hover:text-cave font-medium transition-colors duration-200"
                  >
                    Log in
                  </Link>
                )}
                
                {/* Pill CTA Button */}
                <Link 
                  to={routes.SignupRoute.to}
                  className="bg-champagne hover:bg-chablis text-cave font-semibold px-6 py-2.5 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-grape-seed hover:text-cave transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-porcelain space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-grape-seed hover:text-cave font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <Link 
                    to="/member-portal" 
                    className="block text-grape-seed hover:text-cave font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="block text-grape-seed hover:text-cave font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                )}
                
                <div className="pt-3">
                  <Link 
                    to={routes.SignupRoute.to}
                    className="block text-center bg-champagne hover:bg-chablis text-cave font-semibold px-6 py-3 rounded-full transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 