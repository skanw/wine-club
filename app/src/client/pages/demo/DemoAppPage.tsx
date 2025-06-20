import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'wasp/client/auth';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import WineLogo from '../../components/WineLogo';
import '../../styles/wine-colors.css';
import '../../styles/wine-transitions.css';

export default function DemoAppPage() {
  const { t } = useTranslation();
  const [activeDemo, setActiveDemo] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 wine-transition-slow">
      {/* Demo Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <WineLogo size="lg" showText={true} />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Interactive Platform Demo
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher variant="navbar" showLabels={false} />
              <ThemeToggle />
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
                  { id: 'subscription', label: 'Subscription Flow', icon: '🍷' },
                  { id: 'analytics', label: 'Analytics Dashboard', icon: '📊' },
                  { id: 'features', label: 'Core Features', icon: '⚡' }
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
              {activeDemo === 'subscription' && <SubscriptionDemo />}
              {activeDemo === 'analytics' && <AnalyticsDemo />}
              {activeDemo === 'features' && <FeaturesDemo />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewDemo() {
  const { t } = useTranslation();
  
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
            <span>Responsive design with dark/light themes</span>
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
          <ThemeToggle className="ml-4" />
        </div>
      </div>
    </div>
  );
}

function I18nDemo() {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Internationalization (i18n)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Language: {i18n.language === 'en-US' ? 'English' : 'Français'}
          </h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              {t('hero.title')}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('hero.description')}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              {t('subscription.title')}
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('subscription.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Language Switcher
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <LanguageSwitcher variant="inline" showLabels={true} />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>• Complete translation coverage for all UI elements</p>
            <p>• React-i18next integration with namespace support</p>
            <p>• Automatic language detection and persistence</p>
            <p>• Easy to add new languages and translations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionDemo() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Subscription Flow Demo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Subscription Tiers
          </h3>
          
          {[
            { id: 'basic', name: 'Basic', price: '$29', bottles: 2 },
            { id: 'premium', name: 'Premium', price: '$59', bottles: 4 },
            { id: 'collector', name: 'Collector', price: '$99', bottles: 6 }
          ].map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-wine-500 bg-wine-50 dark:bg-wine-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-wine-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.bottles} bottles per month
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-wine-600 dark:text-wine-400">
                    {plan.price}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mock Subscription Form
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('common.email')}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Wine Preferences
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>Red wines preferred</option>
                  <option>White wines preferred</option>
                  <option>Mixed selection</option>
                </select>
              </div>
              
              <button
                type="button"
                className="w-full bg-wine-600 hover:bg-wine-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {t('subscription.subscribeButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsDemo() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Analytics Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Active Subscribers</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">$47,230</div>
          <div className="text-sm text-green-700 dark:text-green-300">Monthly Revenue</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">23</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Active Wine Caves</div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Growth Chart (Mock)
        </h3>
        <div className="h-32 bg-gradient-to-r from-wine-100 to-wine-200 dark:from-wine-900 dark:to-wine-800 rounded-lg flex items-end justify-around p-4">
          {[30, 45, 60, 40, 75, 90, 85, 95, 70, 80, 100, 90].map((height, index) => (
            <div 
              key={index}
              className="bg-wine-600 dark:bg-wine-400 rounded-t-sm transition-all duration-1000 ease-out"
              style={{ height: `${height}%`, width: '8px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturesDemo() {
  const features = [
    { icon: '🍷', title: 'Wine Cave Management', desc: 'Create and manage multiple wine caves with custom branding' },
    { icon: '📦', title: 'Subscription Automation', desc: 'Automated billing, shipping, and member management' },
    { icon: '🚚', title: 'Shipping Integration', desc: 'FedEx and UPS integration with label printing' },
    { icon: '⭐', title: 'Loyalty Program', desc: 'Points system and referral rewards for members' },
    { icon: '🤖', title: 'AI Recommendations', desc: 'Machine learning powered wine suggestions' },
    { icon: '📊', title: 'Analytics & Reporting', desc: 'Comprehensive business intelligence dashboard' }
  ];
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Core Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 