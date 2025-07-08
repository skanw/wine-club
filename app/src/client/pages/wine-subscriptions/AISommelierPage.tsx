import React from 'react'
// import { getMyWineSubscriptions, getWineRecommendations } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const AISommelierPage: React.FC = () => {
  // const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery(getMyWineSubscriptions)
  // const { data: recommendations, isLoading: recommendationsLoading } = useQuery(getWineRecommendations)
  
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">AI Sommelier</h1>
        <ComingSoon 
          title="AI Sommelier"
          message="AI-powered wine recommendations are being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default AISommelierPage 