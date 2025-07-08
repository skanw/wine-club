import React from 'react'

interface ComingSoonProps {
  message?: string
  title?: string
  className?: string
}

function ComingSoon({ 
  message = "This feature is coming soon!", 
  title = "Coming Soon",
  className = ""
}: ComingSoonProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-champagne-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🍷</span>
      </div>
      <h3 className="text-xl font-semibold text-bordeaux-900 mb-2">{title}</h3>
      <p className="text-bordeaux-700 max-w-md">{message}</p>
      <div className="mt-4 text-sm text-gray-500">
        We're working hard to bring you this feature
      </div>
    </div>
  )
}

export default ComingSoon 