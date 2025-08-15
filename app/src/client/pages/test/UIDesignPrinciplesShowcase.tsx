import React, { useState } from 'react';
import { 
  Wine, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share, 
  Award, 
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Check
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/EnhancedCard';
import EnhancedButton from '../components/ui/EnhancedButton';
import { ProgressiveStepper, ExpandableSection, Accordion } from '../components/ui/ProgressiveDisclosure';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, FormGroup, FormActions } from '../components/ui/AccessibleForm';

export default function UIDesignPrinciplesShowcase() {
  const [activeSection, setActiveSection] = useState('overview');
  const [subscriptionStep, setSubscriptionStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    preferences: '',
    plan: ''
  });

  // Demo data for wine catalog
  const featuredWines = [
    {
      id: 1,
      name: "Château Margaux 2018",
      region: "Bordeaux, France",
      price: 125,
      rating: 4.8,
      vintage: 2018,
      type: "Red Wine",
      description: "An exceptional Bordeaux with complex notes of blackcurrant, cedar, and tobacco.",
      inStock: true,
      image: "/wine-bottle-red.svg"
    },
    {
      id: 2,
      name: "Domaine Chanson Beaune 2020",
      region: "Burgundy, France", 
      price: 45,
      rating: 4.5,
      vintage: 2020,
      type: "Red Wine",
      description: "Elegant Burgundy with bright cherry flavors and silky tannins.",
      inStock: true,
      image: "/wine-bottle-red.svg"
    },
    {
      id: 3,
      name: "Sancerre Les Romains 2021",
      region: "Loire Valley, France",
      price: 32,
      rating: 4.3,
      vintage: 2021,
      type: "White Wine",
      description: "Crisp Sauvignon Blanc with citrus notes and mineral finish.",
      inStock: false,
      image: "/wine-bottle-white.svg"
    }
  ];

  // Subscription form steps (Principle 2: Progressive Disclosure)
  const subscriptionSteps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: <Users className="h-5 w-5" />,
      content: (
        <FormGroup title="Your Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
            />
            <AccessibleInput
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
            />
          </div>
          <AccessibleInput
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
          />
        </FormGroup>
      ),
      validation: () => formData.firstName && formData.lastName && formData.email
    },
    {
      id: 'preferences',
      title: 'Wine Preferences',
      description: 'Help us personalize your experience',
      icon: <Wine className="h-5 w-5" />,
      content: (
        <FormGroup title="Your Wine Profile">
          <AccessibleSelect
            label="Preferred Subscription Plan"
            required
            value={formData.plan}
            onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
            placeholder="Choose a plan"
            options={[
              { value: 'essential', label: 'Essential Selection - €45/month' },
              { value: 'connoisseur', label: 'Connoisseur Collection - €89/month' },
              { value: 'cellar', label: 'Cellar Master Reserve - €159/month' }
            ]}
          />
          <AccessibleTextarea
            label="Tell us about your wine preferences"
            optional
            value={formData.preferences}
            onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
            placeholder="Do you prefer reds or whites? Any specific regions? Favorite varietals?"
            description="This helps us curate wines you'll love"
          />
        </FormGroup>
      ),
      validation: () => formData.plan
    },
    {
      id: 'payment',
      title: 'Payment Information',
      description: 'Secure checkout',
      icon: <CreditCard className="h-5 w-5" />,
      content: (
        <FormGroup title="Billing Information">
          <div className="status-info p-4 rounded-lg flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Your payment information is secured with 256-bit SSL encryption</span>
          </div>
          <AccessibleInput
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            leftIcon={<CreditCard className="h-4 w-4" />}
          />
          <div className="grid grid-cols-2 gap-4">
            <AccessibleInput
              label="Expiry Date"
              placeholder="MM/YY"
            />
            <AccessibleInput
              label="Security Code"
              placeholder="123"
              description="3-digit code on back of card"
            />
          </div>
        </FormGroup>
      ),
      validation: () => true
    }
  ];

  // FAQ accordion items (Principle 2: Progressive Disclosure)
  const faqItems = [
    {
      id: 'shipping',
      trigger: (
        <div>
          <h3 className="typography-h4 text-bordeaux-900">How does shipping work?</h3>
          <p className="typography-body-small text-bordeaux-600">Delivery and shipping information</p>
        </div>
      ),
      content: (
        <div className="space-y-3">
          <p className="typography-body text-bordeaux-700">
            We ship your carefully selected wines directly to your door every month. 
            All shipments are insured and temperature-controlled to ensure perfect condition.
          </p>
          <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
            <li>Free shipping on all subscription orders</li>
            <li>Temperature-controlled packaging</li>
            <li>Delivery tracking included</li>
            <li>Adult signature required</li>
          </ul>
        </div>
      )
    },
    {
      id: 'customization',
      trigger: (
        <div>
          <h3 className="typography-h4 text-bordeaux-900">Can I customize my selections?</h3>
          <p className="typography-body-small text-bordeaux-600">Personalization options</p>
        </div>
      ),
      content: (
        <p className="typography-body text-bordeaux-700">
          Absolutely! Our sommelier team considers your preferences, ratings, and 
          feedback to continually refine your monthly selections. You can also 
          swap wines before each shipment.
        </p>
      )
    },
    {
      id: 'pause',
      trigger: (
        <div>
          <h3 className="typography-h4 text-bordeaux-900">Can I pause my subscription?</h3>
          <p className="typography-body-small text-bordeaux-600">Flexibility and control</p>
        </div>
      ),
      content: (
        <p className="typography-body text-bordeaux-700">
          Yes, you can pause your subscription at any time. Simply log into your 
          account and select the pause option. You can resume whenever you're ready.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-champagne-50">
      {/* Skip Navigation (Principle 5: Accessibility) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation Header (Principle 1: Hierarchy & Principle 7: Alignment) */}
      <header className="bg-white shadow-sm border-b border-bordeaux-200">
        <div className="container-system py-4">
          <nav className="align-horizontal-between" aria-label="Main navigation">
            <div className="flex items-center space-x-2">
              <Wine className="h-8 w-8 text-bordeaux-600" />
              <h1 className="typography-h3 text-bordeaux-900">UI Principles Showcase</h1>
            </div>
            
            <div className="group-navigation">
              {['overview', 'hierarchy', 'disclosure', 'accessibility'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    activeSection === section
                      ? 'bg-bordeaux-100 text-bordeaux-900'
                      : 'text-bordeaux-600 hover:text-bordeaux-900'
                  )}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container-system py-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-12">
            {/* Hero Section (Principle 1: Hierarchy) */}
            <section className="align-text-center spacing-section">
              <h1 className="typography-h1 mb-6">7 Essential UI Design Principles</h1>
              <p className="typography-body-large text-bordeaux-700 max-w-3xl mx-auto mb-8">
                Discover how hierarchy, progressive disclosure, consistency, contrast, 
                accessibility, proximity, and alignment create exceptional user experiences.
              </p>
              <div className="group-actions align-horizontal-center">
                <EnhancedButton variant="primary" size="lg" onClick={() => setActiveSection('hierarchy')}>
                  Explore Principles
                </EnhancedButton>
                <EnhancedButton variant="outline" size="lg">
                  View Documentation
                </EnhancedButton>
              </div>
            </section>

            {/* Principles Grid (Principle 7: Alignment & Principle 6: Proximity) */}
            <section>
              <h2 className="typography-h2 align-text-center mb-12">The 7 Principles in Action</h2>
              <div className="align-grid">
                {[
                  { title: 'Hierarchy', description: 'Clear visual hierarchy guides user attention', icon: <TrendingUp /> },
                  { title: 'Progressive Disclosure', description: 'Information revealed step by step', icon: <Calendar /> },
                  { title: 'Consistency', description: 'Unified patterns throughout the experience', icon: <Award /> },
                  { title: 'Contrast', description: 'Strategic use of color and typography', icon: <Star /> },
                  { title: 'Accessibility', description: 'Inclusive design for all users', icon: <Users /> },
                  { title: 'Proximity', description: 'Related elements grouped together', icon: <MapPin /> },
                  { title: 'Alignment', description: 'Clean, organized visual structure', icon: <Check /> }
                ].map((principle, index) => (
                  <Card key={principle.title} variant="elevated" className="interactive-element">
                    <CardHeader>
                      <div className="w-12 h-12 bg-bordeaux-100 rounded-lg flex items-center justify-center mb-4">
                        {principle.icon}
                      </div>
                      <CardTitle hierarchy="secondary">{principle.title}</CardTitle>
                      <CardDescription>{principle.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Hierarchy Section */}
        {activeSection === 'hierarchy' && (
          <div className="space-y-12">
            <section>
              <h1 className="typography-h1 mb-6">Principle 1: Visual Hierarchy</h1>
              <p className="typography-body-large text-bordeaux-700 mb-8">
                Typography, spacing, and visual weight guide users through content naturally.
              </p>

              {/* Typography Hierarchy Example */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Typography Hierarchy</CardTitle>
                  <CardDescription>Different text sizes and weights create clear information hierarchy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h1 className="typography-h1">H1: Main Page Title</h1>
                  <h2 className="typography-h2">H2: Section Heading</h2>
                  <h3 className="typography-h3">H3: Subsection Title</h3>
                  <h4 className="typography-h4">H4: Component Title</h4>
                  <p className="typography-body-large">Large body text for important content</p>
                  <p className="typography-body">Regular body text for general content</p>
                  <p className="typography-body-small">Small text for secondary information</p>
                  <p className="typography-caption">Caption text for metadata</p>
                </CardContent>
              </Card>

              {/* Wine Catalog with Hierarchy */}
              <div className="align-grid">
                {featuredWines.map((wine) => (
                  <Card key={wine.id} variant="elevated" className="interactive-element">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Primary Info (Highest Hierarchy) */}
                        <div>
                          <h3 className="typography-h3 text-bordeaux-900">{wine.name}</h3>
                          <p className="typography-body text-bordeaux-600">{wine.region}</p>
                        </div>

                        {/* Secondary Info (Medium Hierarchy) */}
                        <div className="group-related flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="typography-body-small font-medium">{wine.rating}</span>
                          </div>
                          <span className="typography-h4 text-bordeaux-900">€{wine.price}</span>
                        </div>

                        {/* Tertiary Info (Lower Hierarchy) */}
                        <p className="typography-body-small text-bordeaux-500">{wine.description}</p>

                        {/* Actions (Visual Emphasis) */}
                        <div className="group-actions space-x-2">
                          <EnhancedButton 
                            variant={wine.inStock ? "primary" : "ghost"} 
                            size="sm"
                            disabled={!wine.inStock}
                            leftIcon={<ShoppingCart className="h-4 w-4" />}
                          >
                            {wine.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </EnhancedButton>
                          <EnhancedButton variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </EnhancedButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Progressive Disclosure Section */}
        {activeSection === 'disclosure' && (
          <div className="space-y-12">
            <section>
              <h1 className="typography-h1 mb-6">Principle 2: Progressive Disclosure</h1>
              <p className="typography-body-large text-bordeaux-700 mb-8">
                Complex workflows broken into manageable steps reduce cognitive load.
              </p>

              {/* Multi-step Subscription Form */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Wine Club Subscription</CardTitle>
                  <CardDescription>Step-by-step subscription process</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressiveStepper
                    steps={subscriptionSteps}
                    currentStep={subscriptionStep}
                    onStepChange={setSubscriptionStep}
                    onComplete={() => alert('Subscription completed!')}
                    allowSkip={false}
                    showProgress={true}
                  />
                </CardContent>
              </Card>

              {/* Expandable Sections */}
              <div className="space-y-4">
                <h2 className="typography-h2 mb-4">Expandable Content</h2>
                
                <ExpandableSection
                  title="Wine Storage Tips"
                  description="Learn how to properly store your wines"
                  icon={<Wine className="h-4 w-4" />}
                >
                  <div className="space-y-3">
                    <p className="typography-body text-bordeaux-700">
                      Proper wine storage is crucial for maintaining quality and allowing wines to age gracefully.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
                      <li>Store bottles horizontally to keep corks moist</li>
                      <li>Maintain temperature between 45-65°F (7-18°C)</li>
                      <li>Keep humidity levels around 70%</li>
                      <li>Protect from direct sunlight and vibration</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection
                  title="Tasting Notes Guide"
                  description="How to identify flavors and aromas"
                  variant="success"
                >
                  <p className="typography-body text-bordeaux-700">
                    Developing your palate takes practice. Start by identifying basic flavor 
                    categories: fruit, earth, spice, and oak characteristics.
                  </p>
                </ExpandableSection>
              </div>

              {/* FAQ Accordion */}
              <div className="mt-8">
                <h2 className="typography-h2 mb-4">Frequently Asked Questions</h2>
                <Accordion items={faqItems} type="single" />
              </div>
            </section>
          </div>
        )}

        {/* Accessibility Section */}
        {activeSection === 'accessibility' && (
          <div className="space-y-12">
            <section>
              <h1 className="typography-h1 mb-6">Principle 5: Accessibility</h1>
              <p className="typography-body-large text-bordeaux-700 mb-8">
                Inclusive design ensures everyone can use and enjoy your product.
              </p>

              {/* Accessible Form Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>
                    Fully accessible form with proper labels, descriptions, and error handling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormGroup title="Get in Touch" description="We'd love to hear from you">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AccessibleInput
                        label="Name"
                        required
                        placeholder="Your full name"
                        leftIcon={<Users className="h-4 w-4" />}
                      />
                      <AccessibleInput
                        label="Email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                      />
                    </div>
                    
                    <AccessibleInput
                      label="Phone Number"
                      type="tel"
                      optional
                      placeholder="+1 (555) 123-4567"
                      leftIcon={<Phone className="h-4 w-4" />}
                      helpText="We'll only call if necessary"
                    />
                    
                    <AccessibleSelect
                      label="Inquiry Type"
                      required
                      placeholder="Select a topic"
                      options={[
                        { value: 'general', label: 'General Information' },
                        { value: 'subscription', label: 'Subscription Support' },
                        { value: 'billing', label: 'Billing Question' },
                        { value: 'technical', label: 'Technical Issue' }
                      ]}
                    />
                    
                    <AccessibleTextarea
                      label="Message"
                      required
                      placeholder="Tell us how we can help..."
                      description="Please provide as much detail as possible"
                    />
                  </FormGroup>
                  
                  <FormActions alignment="right">
                    <EnhancedButton variant="ghost">
                      Cancel
                    </EnhancedButton>
                    <EnhancedButton variant="primary">
                      Send Message
                    </EnhancedButton>
                  </FormActions>
                </CardContent>
              </Card>

              {/* Accessibility Features */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Accessibility Features Implemented</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="typography-h4 text-bordeaux-900">Keyboard Navigation</h4>
                      <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
                        <li>All interactive elements are keyboard accessible</li>
                        <li>Logical tab order throughout the interface</li>
                        <li>Skip links for screen readers</li>
                        <li>Clear focus indicators</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="typography-h4 text-bordeaux-900">Screen Reader Support</h4>
                      <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
                        <li>Semantic HTML structure</li>
                        <li>Proper ARIA labels and roles</li>
                        <li>Descriptive alt text for images</li>
                        <li>Live regions for dynamic content</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="typography-h4 text-bordeaux-900">Visual Accessibility</h4>
                      <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
                        <li>WCAG AA compliant color contrast</li>
                        <li>Scalable fonts and layouts</li>
                        <li>High contrast mode support</li>
                        <li>Reduced motion preferences</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="typography-h4 text-bordeaux-900">Form Accessibility</h4>
                      <ul className="list-disc list-inside space-y-1 text-bordeaux-600">
                        <li>Clear labels and descriptions</li>
                        <li>Error messages with suggestions</li>
                        <li>Required field indicators</li>
                        <li>Grouped related form fields</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
