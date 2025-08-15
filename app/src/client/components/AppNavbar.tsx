import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import DropdownUser from '../../user/DropdownUser';
import { Menu, X, ChevronDown } from 'lucide-react';

export interface NavigationItem {
  name: string;
  to: string;
}

export default function AppNavbar() {
  const { data: user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'shadow-xl bg-white/95 backdrop-blur-md border-b border-bordeaux-100' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <nav className="h-16 lg:h-20 flex flex-col justify-center px-6">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-bordeaux-600 to-bordeaux-700 rounded-xl flex justify-center items-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
              🍷
            </div>
            <span className="text-xl lg:text-2xl font-bold text-bordeaux-900 group-hover:text-bordeaux-700 transition-colors duration-300">
              WineClub Pro
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
            <Link
              to="/discover"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/discover') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              Discover Wines
              {isActive('/discover') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                    isActive('/dashboard') ? 'text-bordeaux-700 font-semibold' : ''
                  }`}
                >
                  Dashboard
                  {isActive('/dashboard') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
                  )}
                </Link>
                <Link
                  to="/member-portal"
                  className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                    isActive('/member-portal') ? 'text-bordeaux-700 font-semibold' : ''
                  }`}
                >
                  My Subscriptions
                  {isActive('/member-portal') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
                  )}
                </Link>
                <Link
                  to="/wine-cave"
                  className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                    isActive('/wine-cave') ? 'text-bordeaux-700 font-semibold' : ''
                  }`}
                >
                  My Wine Cave
                  {isActive('/wine-cave') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
                  )}
                </Link>
              </>
            )}
            <Link
              to="/demo-wine-cave"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/demo-wine-cave') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              Demo Platform
              {isActive('/demo-wine-cave') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
            <Link
              to="/pricing"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/pricing') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              Pricing
              {isActive('/pricing') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
            <Link
              to="/about"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/about') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              About
              {isActive('/about') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
            <Link
              to="/contact"
              className={`relative flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                isActive('/contact') ? 'text-bordeaux-700 font-semibold' : ''
              }`}
            >
              Contact
              {isActive('/contact') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full" />
              )}
            </Link>
          </div>

          {/* Enhanced User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/account"
                  className="text-bordeaux-900 hover:text-bordeaux-700 font-medium transition-colors duration-300"
                >
                  Account
                </Link>
                <DropdownUser user={user} />
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-bordeaux-900 hover:text-bordeaux-700 font-medium transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 text-white px-6 py-2.5 rounded-lg hover:from-bordeaux-700 hover:to-bordeaux-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold"
                >
                  Start Free Trial
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-bordeaux-50 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-bordeaux-900" />
              ) : (
                <Menu className="h-6 w-6 text-bordeaux-900" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-bordeaux-100 shadow-xl">
            <div className="px-6 py-4 space-y-4">
              <Link
                to="/"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/discover"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/discover') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Discover Wines
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                      isActive('/dashboard') ? 'text-bordeaux-700 font-semibold' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/member-portal"
                    className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                      isActive('/member-portal') ? 'text-bordeaux-700 font-semibold' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Subscriptions
                  </Link>
                  <Link
                    to="/wine-cave"
                    className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                      isActive('/wine-cave') ? 'text-bordeaux-700 font-semibold' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Wine Cave
                  </Link>
                </>
              )}
              <Link
                to="/demo-wine-cave"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/demo-wine-cave') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo Platform
              </Link>
              <Link
                to="/pricing"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/pricing') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/about') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`block py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium ${
                  isActive('/contact') ? 'text-bordeaux-700 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="pt-4 border-t border-bordeaux-100 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2 text-bordeaux-900 hover:text-bordeaux-700 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 text-white py-2.5 rounded-lg hover:from-bordeaux-700 hover:to-bordeaux-800 transition-all duration-300 font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 