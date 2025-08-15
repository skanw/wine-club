import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { createWineCave } from 'wasp/client/operations';
import { Wine, MapPin, Store, CreditCard, Users, BarChart3 } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
}

interface WineCaveFormData {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  business: {
    licenseNumber: string;
    businessType: 'cave' | 'cooperative' | 'grower';
    yearsInBusiness: number;
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    estimatedSubscribers: number;
    averageOrderValue: number;
  };
}

export default function WineCaveOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WineCaveFormData>({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
    contact: {
      email: '',
      phone: '',
      website: '',
    },
    business: {
      licenseNumber: '',
      businessType: 'cave',
      yearsInBusiness: 1,
    },
    subscription: {
      plan: 'basic',
      estimatedSubscribers: 50,
      averageOrderValue: 75,
    },
  });

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Tell us about your wine cave',
      icon: <Store className="h-6 w-6" />,
      isCompleted: false,
    },
    {
      id: 'location',
      title: 'Location & Contact',
      description: 'Where can customers find you?',
      icon: <MapPin className="h-6 w-6" />,
      isCompleted: false,
    },
    {
      id: 'subscription-setup',
      title: 'Subscription Setup',
      description: 'Configure your wine club',
      icon: <Wine className="h-6 w-6" />,
      isCompleted: false,
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      description: 'Set up your payment processing',
      icon: <CreditCard className="h-6 w-6" />,
      isCompleted: false,
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Review your setup and go live',
      icon: <BarChart3 className="h-6 w-6" />,
      isCompleted: false,
    },
  ]);

  const createWineCaveFn = useAction(createWineCave);

  const updateFormData = (section: keyof WineCaveFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Business Info
        return formData.name.length > 0 && formData.description.length > 0;
      case 1: // Location
        return formData.address.street.length > 0 && 
               formData.address.city.length > 0 && 
               formData.address.postalCode.length > 0;
      case 2: // Subscription
        return formData.subscription.estimatedSubscribers > 0;
      case 3: // Payment
        return true; // Will be validated by Stripe
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const updatedSteps = [...steps];
      updatedSteps[currentStep].isCompleted = true;
      setSteps(updatedSteps);
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await createWineCaveFn({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        contact: formData.contact,
        business: formData.business,
        subscription: formData.subscription,
      });
      
      // Mark final step as completed
      const updatedSteps = [...steps];
      updatedSteps[currentStep].isCompleted = true;
      setSteps(updatedSteps);
      
      // Redirect to dashboard or show success message
    } catch (error) {
      console.error('Error creating wine cave:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BusinessInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <LocationStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <SubscriptionStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PaymentStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bordeaux-50 via-champagne-50 to-bordeaux-100">
      {/* Background Blurred Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bordeaux-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-champagne-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bordeaux-300 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-bordeaux-900 mb-4">
            Welcome to WineClub Pro
          </h1>
          <p className="text-xl text-bordeaux-700">
            Launch your wine subscription service in minutes, not months
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  index <= currentStep 
                    ? 'bg-bordeaux-600 border-bordeaux-600 text-white' 
                    : 'bg-white border-bordeaux-200 text-bordeaux-400'
                }`}>
                  {step.isCompleted ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`font-semibold ${
                    index <= currentStep ? 'text-bordeaux-900' : 'text-bordeaux-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    index <= currentStep ? 'text-bordeaux-600' : 'text-bordeaux-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-bordeaux-600' : 'bg-bordeaux-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl border border-bordeaux-100 p-8">
            {renderStepContent()}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-3 border-2 border-bordeaux-200 text-bordeaux-700 rounded-lg hover:border-bordeaux-300 hover:bg-bordeaux-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Previous
              </button>
              
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-bordeaux-600 hover:bg-bordeaux-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Launch Wine Club
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-6 py-3 bg-bordeaux-600 hover:bg-bordeaux-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center text-white">
              <div className="bg-champagne-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Wine className="h-8 w-8 text-bordeaux-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
              <p className="text-champagne-primary">
                AI-powered wine recommendations for your members
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="bg-champagne-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-bordeaux-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Member Management</h3>
              <p className="text-champagne-primary">
                Automated billing, preferences, and loyalty programs
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="bg-champagne-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-bordeaux-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-champagne-primary">
                Data-driven insights to grow your subscription business
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function BusinessInfoStep({ formData, updateFormData }: { 
  formData: WineCaveFormData; 
  updateFormData: (section: keyof WineCaveFormData, field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-bordeaux-primary mb-2">
          Tell us about your wine cave
        </h2>
        <p className="text-neutral-600">
          Help us understand your business to provide the best subscription experience
        </p>
      </div>

      <div>
        <label className="form-label">Wine Cave Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', 'name', e.target.value)}
          className="form-input"
          placeholder="e.g., Cave de Bordeaux, Domaine de la Loire"
        />
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', 'description', e.target.value)}
          className="form-input"
          rows={4}
          placeholder="Tell us about your wine cave, your philosophy, and what makes you unique..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Business Type</label>
          <select
            value={formData.business.businessType}
            onChange={(e) => updateFormData('business', 'businessType', e.target.value)}
            className="form-input"
          >
            <option value="cave">Wine Cave</option>
            <option value="cooperative">Cooperative</option>
            <option value="grower">Grower</option>
          </select>
        </div>

        <div>
          <label className="form-label">Years in Business</label>
          <input
            type="number"
            value={formData.business.yearsInBusiness}
            onChange={(e) => updateFormData('business', 'yearsInBusiness', parseInt(e.target.value))}
            className="form-input"
            min="1"
            max="100"
          />
        </div>
      </div>

      <div>
        <label className="form-label">License Number</label>
        <input
          type="text"
          value={formData.business.licenseNumber}
          onChange={(e) => updateFormData('business', 'licenseNumber', e.target.value)}
          className="form-input"
          placeholder="Your business license number"
        />
      </div>
    </div>
  );
}

function LocationStep({ formData, updateFormData }: { 
  formData: WineCaveFormData; 
  updateFormData: (section: keyof WineCaveFormData, field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-bordeaux-primary mb-2">
          Location & Contact Information
        </h2>
        <p className="text-neutral-600">
          Where can your customers find you and how can they reach you?
        </p>
      </div>

      <div>
        <label className="form-label">Street Address *</label>
        <input
          type="text"
          value={formData.address.street}
          onChange={(e) => updateFormData('address', 'street', e.target.value)}
          className="form-input"
          placeholder="123 Rue du Vin"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">City *</label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => updateFormData('address', 'city', e.target.value)}
            className="form-input"
            placeholder="Bordeaux"
          />
        </div>

        <div>
          <label className="form-label">Postal Code *</label>
          <input
            type="text"
            value={formData.address.postalCode}
            onChange={(e) => updateFormData('address', 'postalCode', e.target.value)}
            className="form-input"
            placeholder="33000"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Country</label>
        <select
          value={formData.address.country}
          onChange={(e) => updateFormData('address', 'country', e.target.value)}
          className="form-input"
        >
          <option value="France">France</option>
          <option value="Belgium">Belgium</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Germany">Germany</option>
          <option value="Spain">Spain</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            value={formData.contact.email}
            onChange={(e) => updateFormData('contact', 'email', e.target.value)}
            className="form-input"
            placeholder="contact@yourcave.com"
          />
        </div>

        <div>
          <label className="form-label">Phone *</label>
          <input
            type="tel"
            value={formData.contact.phone}
            onChange={(e) => updateFormData('contact', 'phone', e.target.value)}
            className="form-input"
            placeholder="+33 1 23 45 67 89"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Website (Optional)</label>
        <input
          type="url"
          value={formData.contact.website}
          onChange={(e) => updateFormData('contact', 'website', e.target.value)}
          className="form-input"
          placeholder="https://yourcave.com"
        />
      </div>
    </div>
  );
}

function SubscriptionStep({ formData, updateFormData }: { 
  formData: WineCaveFormData; 
  updateFormData: (section: keyof WineCaveFormData, field: string, value: any) => void;
}) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '€49',
      features: ['Up to 100 subscribers', 'Basic analytics', 'Email support'],
      description: 'Perfect for small wine caves'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€99',
      features: ['Up to 500 subscribers', 'Advanced analytics', 'Priority support', 'AI recommendations'],
      description: 'Ideal for growing businesses'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited subscribers', 'Custom integrations', 'Dedicated support', 'White-label options'],
      description: 'For large operations'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-bordeaux-primary mb-2">
          Choose Your Subscription Plan
        </h2>
        <p className="text-neutral-600">
          Select the plan that best fits your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card cursor-pointer transition-all ${
              formData.subscription.plan === plan.id
                ? 'ring-2 ring-bordeaux-primary bg-champagne-light'
                : ''
            }`}
            onClick={() => updateFormData('subscription', 'plan', plan.id)}
          >
            <div className="card-header">
              <h3 className="text-xl font-semibold text-bordeaux-primary">{plan.name}</h3>
              <p className="text-2xl font-bold text-bordeaux-primary">{plan.price}</p>
              <p className="text-sm text-neutral-600">{plan.description}</p>
            </div>
            <div className="card-content">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="text-bordeaux-primary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Estimated Subscribers</label>
          <input
            type="number"
            value={formData.subscription.estimatedSubscribers}
            onChange={(e) => updateFormData('subscription', 'estimatedSubscribers', parseInt(e.target.value))}
            className="form-input"
            min="1"
            max="10000"
          />
        </div>

        <div>
          <label className="form-label">Average Order Value (€)</label>
          <input
            type="number"
            value={formData.subscription.averageOrderValue}
            onChange={(e) => updateFormData('subscription', 'averageOrderValue', parseInt(e.target.value))}
            className="form-input"
            min="10"
            max="1000"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ formData, updateFormData }: { 
  formData: WineCaveFormData; 
  updateFormData: (section: keyof WineCaveFormData, field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-bordeaux-primary mb-2">
          Payment & Billing Setup
        </h2>
        <p className="text-neutral-600">
          We'll integrate with Stripe for secure payment processing
        </p>
      </div>

      <div className="bg-champagne-light rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-bordeaux-primary rounded-full p-2 mr-4">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-bordeaux-primary">Stripe Integration</h3>
            <p className="text-sm text-neutral-600">Secure payment processing with SEPA & CB support</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="font-medium">Transaction Fee</span>
            <span className="text-bordeaux-primary font-semibold">2.9% + €0.30</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="font-medium">Payout Schedule</span>
            <span className="text-bordeaux-primary font-semibold">2-3 business days</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="font-medium">Supported Currencies</span>
            <span className="text-bordeaux-primary font-semibold">EUR, USD, GBP</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded border-l-4 border-bordeaux-primary">
          <p className="text-sm text-neutral-600">
            <strong>Note:</strong> You'll be redirected to Stripe to complete your account setup after launching your wine club.
            This ensures compliance with French financial regulations and enables secure payment processing.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData }: { formData: WineCaveFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-bordeaux-primary mb-2">
          Review Your Setup
        </h2>
        <p className="text-neutral-600">
          Everything looks great! Review your information before launching your wine club.
        </p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-bordeaux-primary">Business Information</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-neutral-500">Name</span>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Business Type</span>
                <p className="font-medium capitalize">{formData.business.businessType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-bordeaux-primary">Location</h3>
          </div>
          <div className="card-content">
            <p className="font-medium">{formData.address.street}</p>
            <p className="text-neutral-600">
              {formData.address.city}, {formData.address.postalCode}, {formData.address.country}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-bordeaux-primary">Subscription Plan</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-neutral-500">Plan</span>
                <p className="font-medium capitalize">{formData.subscription.plan}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Estimated Subscribers</span>
                <p className="font-medium">{formData.subscription.estimatedSubscribers}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Average Order Value</span>
                <p className="font-medium">€{formData.subscription.averageOrderValue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-champagne-light rounded-lg p-6">
        <h3 className="text-lg font-semibold text-bordeaux-primary mb-4">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="bg-bordeaux-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm mr-3">1</div>
            <span>Your wine club will be created with a custom URL</span>
          </div>
          <div className="flex items-center">
            <div className="bg-bordeaux-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm mr-3">2</div>
            <span>You'll be guided through Stripe account setup</span>
          </div>
          <div className="flex items-center">
            <div className="bg-bordeaux-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm mr-3">3</div>
            <span>Start adding your wines and inviting members</span>
          </div>
          <div className="flex items-center">
            <div className="bg-bordeaux-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm mr-3">4</div>
            <span>Launch your subscription service in under 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
} 