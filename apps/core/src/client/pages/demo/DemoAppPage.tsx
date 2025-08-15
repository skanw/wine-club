import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// CSS imports are now handled in Main.css

export default function DemoAppPage() {
  const { t: _t } = useTranslation();
  const [activeDemo, setActiveDemo] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 wine-transition-slow">
      {/* Demo Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Interactive Platform Demo
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Demo Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Demo Features
              </h2>
              <ul className="space-y-2">
                {[
                  { id: 'overview', label: 'Platform Overview', icon: '🏠' },
                  { id: 'theme', label: 'Theme System', icon: '🎨' },
                  { id: 'i18n', label: 'Internationalization', icon: '🌍' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveDemo(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeDemo === item.id
                          ? 'bg-wine-100 text-wine-800 dark:bg-wine-900 dark:text-wine-200'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Demo Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {activeDemo === 'overview' && <OverviewDemo />}
              {activeDemo === 'theme' && <ThemeDemo />}
              {activeDemo === 'i18n' && <I18nDemo />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewDemo() {
  const { t: _t } = useTranslation();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Wine Club SaaS Platform
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg">
          <div className="text-red-600 dark:text-red-400 text-2xl mb-2">🍷</div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Wine Cave Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage multiple wine caves with subscription tiers
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">📦</div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Subscription Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Automated billing and member portal for subscribers
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
          <div className="text-green-600 dark:text-green-400 text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Analytics & Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track revenue, subscribers, and business growth
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Platform Highlights
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Multi-tenant architecture for wine cave owners</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Integrated shipping with FedEx and UPS</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>AI-powered wine recommendations</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Loyalty program and referral system</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Responsive design with elegant champagne theme</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ThemeDemo() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Wine Theme System
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Red Wine Theme
          </h3>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-full"></div>
              <span className="font-medium text-red-800 dark:text-red-200">Rich & Bold</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              Inspired by deep reds and burgundy wines, perfect for premium experiences.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            White Wine Theme
          </h3>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full"></div>
              <span className="font-medium text-amber-800 dark:text-amber-200">Light & Elegant</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Inspired by golden whites and champagne, offering a refined aesthetic.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme Controls
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Single-click toggle between red and white wine themes
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Preferences saved in localStorage with cookie fallback
            </p>
          </div>
          <span>Demo Controls</span>
        </div>
      </div>
    </div>
  );
}

function I18nDemo() {
  const { t: _t, i18n } = useTranslation();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Internationalization
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        The platform supports multiple languages. Use the language switcher in the navbar to try it out.
      </p>
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 rounded bg-bordeaux-600 text-white hover:bg-bordeaux-700"
          onClick={() => i18n.changeLanguage('en')}
        >
          English
        </button>
        <button
          className="px-4 py-2 rounded bg-champagne-600 text-white hover:bg-champagne-700"
          onClick={() => i18n.changeLanguage('fr')}
        >
          Français
        </button>
      </div>
    </div>
  );
} 