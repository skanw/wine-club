import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'wasp/client/router';

export default function NavbarTestPage() {
  console.log('NavbarTestPage rendering');
  console.log('Available routes:', routes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bordeaux-50 via-champagne-50 to-bordeaux-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-bordeaux-900 mb-8">Navbar Test Page</h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-bordeaux-900 mb-4">Route Testing</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              to="/" 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Home (/)
            </Link>
            
            <Link 
              to={routes.HowItWorksRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Features ({routes.HowItWorksRoute.to})
            </Link>
            
            <Link 
              to={routes.PricingPageRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Pricing ({routes.PricingPageRoute.to})
            </Link>
            
            <Link 
              to={routes.AboutRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              About ({routes.AboutRoute.to})
            </Link>
            
            <Link 
              to={routes.BlogRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Blog ({routes.BlogRoute.to})
            </Link>
            
            <Link 
              to={routes.ContactRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Contact ({routes.ContactRoute.to})
            </Link>
            
            <Link 
              to={routes.SignupRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Signup ({routes.SignupRoute.to})
            </Link>
            
            <Link 
              to={routes.LoginRoute.to} 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Login ({routes.LoginRoute.to})
            </Link>
            
            <Link 
              to="/member-portal" 
              className="p-4 bg-bordeaux-100 rounded-lg text-bordeaux-900 hover:bg-bordeaux-200 transition-colors"
            >
              Member Portal (/member-portal)
            </Link>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-bordeaux-900 mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(routes, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 