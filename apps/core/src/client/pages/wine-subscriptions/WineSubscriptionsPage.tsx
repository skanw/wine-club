import React from 'react'
// import { getMyWineSubscriptions, getPublicWineCaves } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const WineSubscriptionsPage: React.FC = () => {
  // const { data: mySubscriptions, isLoading: subscriptionsLoading } = useQuery(getMyWineSubscriptions)
  // const { data: publicCaves, isLoading: cavesLoading } = useQuery(getPublicWineCaves)
  
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Wine Subscriptions</h1>
        <ComingSoon 
          title="Wine Subscriptions"
          message="Wine subscription management is being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default WineSubscriptionsPage 