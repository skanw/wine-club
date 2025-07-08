import React from 'react'
// import { getWineCaves, createShipment, generateShippingLabel, updateShipment } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const ShippingDashboardPage: React.FC = () => {
  // const { data: wineCaves, isLoading, error } = useQuery(getWineCaves)
  
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Shipping Dashboard</h1>
        <ComingSoon 
          title="Shipping Management"
          message="Shipping management features are being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default ShippingDashboardPage 