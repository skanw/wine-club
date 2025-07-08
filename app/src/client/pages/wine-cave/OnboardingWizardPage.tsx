import React from 'react'
// import { createWineCave, createSubscriptionTier, createWine } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const OnboardingWizardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Onboarding Wizard</h1>
        <ComingSoon 
          title="Onboarding Wizard"
          message="The onboarding wizard is being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default OnboardingWizardPage 