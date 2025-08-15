import React from 'react'
import AppNavbar from './AppNavbar'

interface LayoutShellProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

function LayoutShell({ 
  children, 
  title = 'Wine Club SaaS', 
  description = 'Premium wine subscription service',
  className = ''
}: LayoutShellProps) {
  return (
    <div className={`min-h-screen bg-champagne-50 ${className}`}>
      {/* Meta tags */}
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>

      {/* Navigation */}
      <AppNavbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container container-xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-auto">
        <div className="container container-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-heading-4 text-white mb-4">Wine Club SaaS</h3>
              <p className="text-body text-gray-400 mb-4">
                Premium wine subscription service delivering exceptional wines 
                to your doorstep with personalized recommendations and expert curation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-champagne-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-champagne-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-champagne-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-body font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-champagne-400 transition-colors">Home</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-champagne-400 transition-colors">Pricing</a></li>
                <li><a href="/wine-subscriptions" className="text-gray-400 hover:text-champagne-400 transition-colors">Subscriptions</a></li>
                <li><a href="/wine-cave" className="text-gray-400 hover:text-champagne-400 transition-colors">Wine Cave</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-champagne-400 transition-colors">About</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-body font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-400 hover:text-champagne-400 transition-colors">Contact</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-champagne-400 transition-colors">Help Center</a></li>
                <li><a href="/shipping" className="text-gray-400 hover:text-champagne-400 transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-400 hover:text-champagne-400 transition-colors">Returns</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-champagne-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 Wine Club SaaS. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-sm text-gray-400 hover:text-champagne-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-sm text-gray-400 hover:text-champagne-400 transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-sm text-gray-400 hover:text-champagne-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LayoutShell 