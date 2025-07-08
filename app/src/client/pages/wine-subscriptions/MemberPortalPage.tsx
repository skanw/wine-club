import React from 'react'
// import { getMyWineSubscriptions, updateWineSubscription } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const MemberPortalPage: React.FC = () => {
  // const { data: subscriptions, isLoading, error } = useQuery(getMyWineSubscriptions)
  
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Member Portal</h1>
        <ComingSoon 
          title="Member Portal"
          message="Member portal features are being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default MemberPortalPage 