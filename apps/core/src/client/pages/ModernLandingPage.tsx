import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { 
  Wine, 
  Star, 
  Users, 
  Package, 
  ArrowRight, 
  Play
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import ModernNavbar from '../components/modern/ModernNavbar';
import AIInterfacePreview from '../components/modern/AIInterfacePreview';

export default function ModernLandingPage() {
  const { data: user } = useAuth();

  const features = [
    {
      icon: <Wine className="h-6 w-6" />,
      title: "Curated Wine Selection",
      description: "AI-powered recommendations based on your taste preferences and budget"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Monthly Deliveries",
      description: "Hand-picked wines delivered to your door with detailed tasting notes"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Expert Sommeliers",
      description: "Access to certified sommeliers for personalized wine guidance"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Wine Community",
      description: "Connect with fellow wine enthusiasts and share experiences"
    }
  ];

  const stats = [
    { number: "500+", label: "Wine Caves" },
    { number: "10K+", label: "Happy Members" },
    { number: "50K+", label: "Wines Delivered" },
    { number: "4.9★", label: "Member Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bordeaux-50 via-champagne-50 to-bordeaux-100">
      {/* Background Blurred Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bordeaux-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-champagne-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bordeaux-300 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Header Navigation */}
      <ModernNavbar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-bordeaux-900 mb-6 leading-tight">
            AI that helps you discover
            <span className="block text-champagne-600">perfect wines</span>
          </h1>
          <p className="text-xl md:text-2xl text-bordeaux-700 mb-8 max-w-3xl mx-auto">
            Always have the perfect wine for every occasion with AI-powered recommendations, 
            expert sommelier guidance, and curated monthly deliveries.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="bg-bordeaux-600 hover:bg-bordeaux-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2">
              <Wine className="h-5 w-5" />
              <span>Start Wine Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-bordeaux-900 border-2 border-bordeaux-200 px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-bordeaux-900 mb-2">{stat.number}</div>
                <div className="text-bordeaux-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Preview Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AIInterfacePreview />
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-bordeaux-900 mb-6">
            Everything you need for the perfect wine experience
          </h2>
          <p className="text-xl text-bordeaux-700 max-w-3xl mx-auto">
            From AI-powered recommendations to expert guidance, we've got everything covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-bordeaux-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center text-bordeaux-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-bordeaux-900 mb-3">{feature.title}</h3>
              <p className="text-bordeaux-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to discover your perfect wines?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of wine enthusiasts who trust our AI-powered recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white hover:bg-gray-100 text-bordeaux-900 px-8 py-4 rounded-xl text-lg font-semibold">
              Start Free Trial
            </Button>
            <Button className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            We use cookies to enhance your experience, analyze our traffic, and provide personalized wine recommendations.{' '}
            <a href="#" className="underline hover:text-champagne-300">Cookie preferences</a>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Reject non-essential
            </Button>
            <Button className="bg-bordeaux-600 hover:bg-bordeaux-700 text-white">
              Accept all cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 