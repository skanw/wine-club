import React from 'react'
import { Link } from 'react-router-dom'
import { SignupForm } from 'wasp/client/auth'
import { Wine, ArrowLeft, Shield, Users, Zap, CheckCircle, Star } from 'lucide-react'

export function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-bordeaux-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-bordeaux-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-champagne-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-bordeaux-400 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-bordeaux-600 to-bordeaux-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
              <Wine className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-bordeaux-900">WineClub Pro</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-bordeaux-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-bordeaux-50 rounded-full mb-4">
                  <div className="w-2 h-2 bg-bordeaux-600 rounded-full animate-pulse"></div>
                  <span className="text-bordeaux-700 text-sm font-medium uppercase tracking-wider">Join Us</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-bordeaux-900 mb-2">
                  Launch Your Wine Cave
                </h2>
                <p className="text-gray-600">
                  Start your 60-day free trial and transform your wine business
                </p>
              </div>

              {/* Signup Form */}
              <div className="auth-form">
                <SignupForm
                  appearance={{
                    colors: {
                      brand: '#8B2635',
                      brandAccent: '#A33B4A',
                    },
                  }}
                />
              </div>

              {/* Terms & Privacy */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-bordeaux-600 hover:text-bordeaux-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-bordeaux-600 hover:text-bordeaux-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Alternative Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-bordeaux-600 hover:text-bordeaux-700 transition-colors"
                    >
                      Sign in to your dashboard
                    </Link>
                  </p>
                </div>
              </div>

              {/* Demo Access */}
              <div className="mt-6 p-4 bg-gradient-to-r from-champagne-50 to-bordeaux-50 rounded-xl border border-champagne-200">
                <div className="text-center">
                  <p className="text-sm text-bordeaux-700 font-medium mb-2">
                    Want to see it in action first?
                  </p>
                  <Link
                    to="/demo-wine-cave"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-200 hover:bg-champagne-300 text-bordeaux-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Star className="h-4 w-4" />
                    Explore Platform Demo
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits & Features */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h1 className="text-5xl font-serif font-bold text-bordeaux-900 mb-6 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-bordeaux-600 to-bordeaux-800 bg-clip-text text-transparent">
                  Wine Business
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Join hundreds of wine caves already growing their subscription business with our all-in-one platform.
              </p>

              {/* Free Trial Highlight */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 mb-8">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-semibold">60-Day Free Trial • No Credit Card Required</span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-bordeaux-100 to-bordeaux-200 rounded-xl flex-shrink-0">
                  <Users className="h-6 w-6 text-bordeaux-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-bordeaux-900 mb-1">Subscription Management</h3>
                  <p className="text-gray-600">Automated billing, member onboarding, and retention tools that grow your revenue.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-champagne-200 to-champagne-300 rounded-xl flex-shrink-0">
                  <Zap className="h-6 w-6 text-bordeaux-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-bordeaux-900 mb-1">Smart Automation</h3>
                  <p className="text-gray-600">POS integration, inventory tracking, and shipping labels generated automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-bordeaux-100 to-champagne-200 rounded-xl flex-shrink-0">
                  <Shield className="h-6 w-6 text-bordeaux-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-bordeaux-900 mb-1">Enterprise Security</h3>
                  <p className="text-gray-600">Bank-level security, GDPR compliance, and data protection you can trust.</p>
                </div>
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h4 className="font-semibold text-bordeaux-900 mb-4">Simple, Transparent Pricing</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Basic Plan (≤100 members)</span>
                  <span className="font-semibold text-bordeaux-900">€49/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Premium Plan (≤500 members)</span>
                  <span className="font-semibold text-bordeaux-900">€99/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction Fee</span>
                  <span className="font-semibold text-bordeaux-900">0.8% above €5k</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  ✨ Start free for 60 days, then pay only as you grow
                </p>
              </div>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-bordeaux-900">500+</div>
                <div className="text-sm text-gray-600">Wine Caves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bordeaux-900">€2M+</div>
                <div className="text-sm text-gray-600">Revenue Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bordeaux-900">94%</div>
                <div className="text-sm text-gray-600">Retention Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>© 2024 WineClub Pro. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-bordeaux-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-bordeaux-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-bordeaux-600 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}