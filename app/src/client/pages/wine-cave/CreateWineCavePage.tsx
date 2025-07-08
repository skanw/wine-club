import React from 'react'
// import { createWineCave } from 'wasp/client/operations'
import ComingSoon from '../../components/ui/ComingSoon'

const CreateWineCavePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bordeaux-900 mb-8">Create Wine Cave</h1>
        <ComingSoon 
          title="Create Wine Cave"
          message="Wine cave creation is being refactored and will be available soon."
        />
      </div>
    </div>
  )
}

export default CreateWineCavePage 