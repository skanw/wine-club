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
    <nav 
      className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-bordeaux-100"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Skip Link for Accessibility (Principle 5) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="container-system py-6">
        <div className="align-horizontal-between">
          {/* Logo with Hierarchy (Principle 1) */}
          <Link to="/" className="group-related flex items-center space-x-2 focus-ring rounded-lg">
            <div className="w-8 h-8 bg-bordeaux-600 rounded-lg flex items-center justify-center">
              <Wine className="h-5 w-5 text-white" />
            </div>
            <span className="typography-h3 text-bordeaux-900">WineClub</span>
          </Link>

          {/* Desktop Navigation with Proper Alignment (Principle 7) */}
          <div className="hidden md:flex align-vertical-center group-navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <Link 
                to="/member-portal" 
                className="interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
              >
                Log in
              </Link>
            )}
            
            <EnhancedButton
              as="link"
              to={routes.SignupRoute.to}
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Get Started
            </EnhancedButton>
          </div>

          {/* Mobile Menu Button with Accessibility (Principle 5) */}
          <button
            className="md:hidden p-2 text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu with Progressive Disclosure (Principle 2) */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-4 bg-white/95 backdrop-blur-sm radius-large shadow-xl border border-bordeaux-100 p-6 space-y-4 animate-fade-in-down"
            role="menu"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                role="menuitem"
                className="block interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <Link 
                to="/member-portal" 
                role="menuitem"
                className="block interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                role="menuitem"
                className="block interactive-subtle typography-body-small font-medium text-bordeaux-700 hover:text-bordeaux-900 focus-ring rounded-md px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
            )}
            
            <div className="pt-2 border-t border-bordeaux-200">
              <EnhancedButton
                as="link"
                to={routes.SignupRoute.to}
                variant="primary"
                size="md"
                className="w-full align-horizontal-center"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </EnhancedButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 