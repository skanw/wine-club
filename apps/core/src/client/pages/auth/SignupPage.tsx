import React from 'react'
import { Link } from 'react-router-dom'
import { SignupForm } from 'wasp/client/auth'
import { Wine, ArrowLeft, Shield, Users, Zap, CheckCircle, Star } from 'lucide-react'

export function Signup() {
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
          
          {/* Left Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1">
            <div className="bg-shell/80 backdrop-blur-xl rounded-card shadow-wc border border-porcelain p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne/20 rounded-full mb-4">
                  <div className="w-2 h-2 bg-champagne rounded-full animate-pulse"></div>
                  <span className="text-champagne text-sm font-medium uppercase tracking-wider">Join Us</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-cave mb-2">
                  Launch Your Wine Cave
                </h2>
                <p className="text-grape-seed">
                  Start your 60-day free trial and transform your wine business
                </p>
              </div>

              {/* Signup Form */}
              <div className="auth-form">
                <SignupForm
                  appearance={{
                    colors: {
                      brand: '#E9D9A6',
                      brandAccent: '#DCCB8A',
                    },
                  }}
                />
              </div>

              {/* Terms & Privacy */}
              <div className="mt-6 text-center">
                <p className="text-xs text-grape-seed">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-champagne hover:text-chablis">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-champagne hover:text-chablis">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Alternative Actions */}
              <div className="mt-8 pt-6 border-t border-porcelain">
                <div className="text-center">
                  <p className="text-sm text-grape-seed">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-champagne hover:text-chablis transition-colors"
                    >
                      Sign in to your dashboard
                    </Link>
                  </p>
                </div>
              </div>

              {/* Demo Access */}
              <div className="mt-6 p-4 bg-gradient-to-r from-champagne/20 to-chablis/20 rounded-xl border border-champagne/30">
                <div className="text-center">
                  <p className="text-sm text-cave font-medium mb-2">
                    Want to see it in action first?
                  </p>
                  <Link
                    to="/demo-wine-cave"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-champagne hover:bg-chablis text-cave rounded-lg transition-colors text-sm font-medium shadow-wc"
                  >
                    <Star className="h-4 w-4" />
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

          {/* Right Side - Benefits & Features */}
          <div className="hidden lg:block space-y-8 order-1 lg:order-2">
            <div>
              <h1 className="text-5xl font-serif font-bold text-cave mb-6 leading-tight">
                Build Your
                <span className="block bg-gradient-to-r from-champagne to-chablis bg-clip-text text-transparent">
                  Wine Empire
                </span>
              </h1>
              <p className="text-xl text-grape-seed leading-relaxed">
                Join the elite community of wine cave owners who trust our platform to scale their business and delight their members.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-champagne/20 to-chablis/20 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">60-Day Free Trial</h3>
                  <p className="text-grape-seed">No credit card required. Start building your wine cave immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-chablis/20 to-champagne/20 rounded-xl">
                  <Zap className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">Instant Setup</h3>
                  <p className="text-grape-seed">Get your wine cave live in minutes with our guided onboarding.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-champagne/20 to-chablis/20 rounded-xl">
                  <Users className="h-6 w-6 text-champagne" />
                </div>
                <div>
                  <h3 className="font-semibold text-cave mb-1">Member Growth</h3>
                  <p className="text-grape-seed">Built-in marketing tools to attract and retain wine enthusiasts.</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-porcelain">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-champagne rounded-full border-2 border-shell"></div>
                  <div className="w-8 h-8 bg-chablis rounded-full border-2 border-shell"></div>
                  <div className="w-8 h-8 bg-grape-seed rounded-full border-2 border-shell"></div>
                </div>
                <div className="text-sm text-grape-seed">
                  <span className="font-semibold text-cave">500+ wine caves</span> trust our platform
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-champagne">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-grape-seed">4.9/5 from 2,000+ reviews</span>
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