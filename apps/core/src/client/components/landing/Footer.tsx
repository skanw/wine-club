import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cave text-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-champagne to-chablis rounded-lg flex items-center justify-center">
                <Wine className="h-5 w-5 text-cave" />
              </div>
              <span className="text-xl font-bold">WineClub</span>
            </div>
            <p className="text-porcelain mb-6">
              Curating exceptional white wines and champagnes from France's finest cellars since 1987.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-porcelain hover:text-champagne transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-porcelain hover:text-champagne transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-porcelain hover:text-champagne transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-champagne font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-porcelain hover:text-champagne transition-colors duration-200">About Us</Link></li>
                <li><Link to="/careers" className="text-porcelain hover:text-champagne transition-colors duration-200">Careers</Link></li>
                <li><Link to="/press" className="text-porcelain hover:text-champagne transition-colors duration-200">Press</Link></li>
                <li><Link to="/contact" className="text-porcelain hover:text-champagne transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            
            {/* Wine Club */}
            <div>
              <h3 className="text-champagne font-semibold mb-4">Wine Club</h3>
              <ul className="space-y-3">
                <li><Link to="/how-it-works" className="text-porcelain hover:text-champagne transition-colors duration-200">How It Works</Link></li>
                <li><Link to="/pricing" className="text-porcelain hover:text-champagne transition-colors duration-200">Membership</Link></li>
                <li><Link to="/wine-cave" className="text-porcelain hover:text-champagne transition-colors duration-200">Wine Caves</Link></li>
                <li><Link to="/sommeliers" className="text-porcelain hover:text-champagne transition-colors duration-200">Sommeliers</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-champagne font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-porcelain hover:text-champagne transition-colors duration-200">Help Center</Link></li>
                <li><Link to="/shipping" className="text-porcelain hover:text-champagne transition-colors duration-200">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-porcelain hover:text-champagne transition-colors duration-200">Returns</Link></li>
                <li><Link to="/privacy" className="text-porcelain hover:text-champagne transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-grape-seed/20 flex flex-col md:flex-row justify-between items-center">
          <div className="text-porcelain text-sm">
            © {currentYear} WineClub. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 text-porcelain text-sm">
            Crafted with passion in France 🇫🇷
          </div>
        </div>
      </div>
    </footer>
  );
}
