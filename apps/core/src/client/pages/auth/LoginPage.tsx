import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LoginForm } from 'wasp/client/auth'
import { Wine, Eye, EyeOff, ArrowLeft, Shield, Users, Zap } from 'lucide-react'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-shell to-porcelain">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-champagne rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chablis rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-grape-seed rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-champagne to-chablis rounded-xl shadow-wc group-hover:shadow-xl transition-all duration-200">
              <Wine className="h-6 w-6 text-cave" />
            </div>
            <span className="text-xl font-bold text-cave">WineClub Pro</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-grape-seed hover:text-champagne transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-5xl font-serif font-bold text-cave mb-6 leading-tight">
                Welcome Back to Your
                <span className="block bg-gradient-to-r from-champagne to-chablis bg-clip-text text-transparent">
                  Wine Empire
                </span>
              </h1>
              <p className="text-xl text-grape-seed leading-relaxed">
                Manage your wine cave subscriptions, track member growth, and curate exceptional wine experiences for your customers.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-champagne/20 to-chablis/20 rounded-xl">
                  <Users className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">Member Management</h3>
                  <p className="text-grape-seed">Track subscriptions, analyze preferences, and grow your wine community.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-chablis/20 to-champagne/20 rounded-xl">
                  <Zap className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">Automated Operations</h3>
                  <p className="text-grape-seed">Streamline billing, inventory, and shipping with smart automation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-champagne/20 to-chablis/20 rounded-xl">
                  <Shield className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">Secure & Compliant</h3>
                  <p className="text-grape-seed">Bank-level security with GDPR compliance and PCI certification.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-porcelain">
              <div className="text-center">
                <div className="text-2xl font-bold text-cave">500+</div>
                <div className="text-sm text-grape-seed">Wine Caves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cave">50K+</div>
                <div className="text-sm text-grape-seed">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cave">98%</div>
                <div className="text-sm text-grape-seed">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-shell/80 backdrop-blur-xl rounded-card shadow-wc border border-porcelain p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne/20 rounded-full mb-4">
                  <div className="w-2 h-2 bg-champagne rounded-full animate-pulse"></div>
                  <span className="text-champagne text-sm font-medium uppercase tracking-wider">Welcome Back</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-cave mb-2">
                  Sign In to Your Account
                </h2>
                <p className="text-grape-seed">
                  Access your wine cave dashboard and manage your business
                </p>
              </div>

              {/* Login Form */}
              <div className="auth-form">
                <LoginForm
                  appearance={{
                    colors: {
                      brand: '#E9D9A6',
                      brandAccent: '#DCCB8A',
                    },
                  }}
                />
              </div>

              {/* Alternative Actions */}
              <div className="mt-8 pt-6 border-t border-porcelain">
                <div className="text-center space-y-4">
                  <p className="text-sm text-grape-seed">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="font-semibold text-champagne hover:text-chablis transition-colors"
                    >
                      Create your wine cave account
                    </Link>
                  </p>
                  <p className="text-sm">
                    <Link
                      to="/request-password-reset"
                      className="text-grape-seed hover:text-champagne transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </p>
                </div>
              </div>

              {/* Demo Access */}
              <div className="mt-6 p-4 bg-gradient-to-r from-champagne/20 to-chablis/20 rounded-xl border border-champagne/30">
                <div className="text-center">
                  <p className="text-sm text-cave font-medium mb-2">
                    Want to explore first?
                  </p>
                  <Link
                    to="/demo-wine-cave"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-champagne hover:bg-chablis text-cave rounded-lg transition-colors text-sm font-medium shadow-wc"
                  >
                    <Eye className="h-4 w-4" />
                    View Platform Demo
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-shell/60 backdrop-blur-sm rounded-full border border-porcelain">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-grape-seed">Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-grape-seed">
            <div className="flex items-center gap-4">
              <span>© 2024 WineClub Pro. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-champagne transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-champagne transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-champagne transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}