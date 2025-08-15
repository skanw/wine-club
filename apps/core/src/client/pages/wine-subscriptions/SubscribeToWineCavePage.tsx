import React from 'react'
// import { getPublicWineCaves, createWineSubscription } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const SubscribeToWineCavePage: React.FC = () => {
  // const { data: wineCaves, isLoading, error } = useQuery(getPublicWineCaves)
  
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Subscribe to Wine Cave</h1>
        <ComingSoon 
          title="Wine Cave Subscription"
          message="Wine cave subscription features are being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default SubscribeToWineCavePage 