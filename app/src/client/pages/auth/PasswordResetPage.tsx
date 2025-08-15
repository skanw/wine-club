import React from 'react'
import { Link } from 'react-router-dom'
import { ResetPasswordForm } from 'wasp/client/auth'
import { Wine, ArrowLeft, Shield, Lock, CheckCircle, Eye } from 'lucide-react'

export function PasswordResetPage() {
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
            to="/login"
            className="flex items-center gap-2 text-gray-600 hover:text-bordeaux-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Information */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-5xl font-serif font-bold text-bordeaux-900 mb-6 leading-tight">
                Create Your New
                <span className="block bg-gradient-to-r from-bordeaux-600 to-bordeaux-800 bg-clip-text text-transparent">
                  Secure Password
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                You're almost back in! Choose a strong password to keep your wine cave data secure and accessible only to you.
              </p>
            </div>

            {/* Password Requirements */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-bordeaux-900">Password Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">At least 8 characters long</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Include uppercase and lowercase letters</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Include at least one number</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Include a special character (!@#$%^&*)</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-bordeaux-900 mb-2">Your Security is Our Priority</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Passwords are encrypted using industry-standard algorithms</li>
                    <li>• Two-factor authentication available for enhanced security</li>
                    <li>• Regular security audits and monitoring</li>
                    <li>• GDPR compliant data protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-bordeaux-50 rounded-full mb-4">
                  <Lock className="h-4 w-4 text-bordeaux-600" />
                  <span className="text-bordeaux-700 text-sm font-medium uppercase tracking-wider">New Password</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-bordeaux-900 mb-2">
                  Set New Password
                </h2>
                <p className="text-gray-600">
                  Create a strong password for your wine cave account
                </p>
              </div>

              {/* Password Reset Form */}
              <div className="auth-form">
                <ResetPasswordForm
                  appearance={{
                    colors: {
                      brand: '#8B2635',
                      brandAccent: '#A33B4A',
                    },
                  }}
                />
              </div>

              {/* Alternative Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Password reset successful?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-bordeaux-600 hover:text-bordeaux-700 transition-colors"
                    >
                      Sign in with your new password
                    </Link>
                  </p>
                </div>
              </div>

              {/* Demo Access */}
              <div className="mt-6 p-4 bg-gradient-to-r from-champagne-50 to-bordeaux-50 rounded-xl border border-champagne-200">
                <div className="text-center">
                  <p className="text-sm text-bordeaux-700 font-medium mb-2">
                    Want to explore the platform first?
                  </p>
                  <Link
                    to="/demo-wine-cave"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-200 hover:bg-champagne-300 text-bordeaux-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    View Demo Platform
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