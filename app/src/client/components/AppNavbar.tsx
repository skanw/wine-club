import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import DropdownUser from '../../user/DropdownUser';

export interface NavigationItem {
  name: string;
  to: string;
}

export default function AppNavbar() {
  const { data: user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <nav className="h-16 flex flex-col justify-center px-6 backdrop-blur-sm bg-white/60 border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-full flex justify-center items-center text-xs tracking-wide text-bordeaux-700 mb-1">
              <span className="font-bold text-lg">🍷</span>
            </div>
            <span className="text-xl font-bold text-bordeaux-900">WineClub Pro</span>
          </Link>

          {/* Spacer to center nav links */}
          <div className="flex-1" />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                isActive('/') ? 'font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                isActive('/discover') ? 'font-semibold' : ''
              }`}
            >
              Discover Wines
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                    isActive('/dashboard') ? 'font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/member-portal"
                  className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                    isActive('/member-portal') ? 'font-semibold' : ''
                  }`}
                >
                  My Subscriptions
                </Link>
                <Link
                  to="/wine-cave"
                  className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                    isActive('/wine-cave') ? 'font-semibold' : ''
                  }`}
                >
                  My Wine Cave
                </Link>
              </>
            )}
            <Link
              to="/pricing"
              className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                isActive('/pricing') ? 'font-semibold' : ''
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                isActive('/about') ? 'font-semibold' : ''
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`flex items-center duration-300 ease-in-out text-bordeaux-900 hover:text-bordeaux-700 ${
                isActive('/contact') ? 'font-semibold' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/account"
                  className="text-bordeaux-900 hover:text-bordeaux-700 font-medium"
                >
                  Account
                </Link>
                <DropdownUser user={user} />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-bordeaux-900 hover:text-bordeaux-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-bordeaux-600 text-white px-4 py-2 rounded-lg hover:bg-bordeaux-700 transition-colors duration-300"
                >
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 