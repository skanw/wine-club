import React from 'react';

const TotalSignupsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Signups</h3>
      <div className="text-center text-gray-500 py-8">
        <span className="text-4xl mb-4 block">📈</span>
        <p>Signup data coming soon</p>
        <p className="text-sm">Track your user signup metrics</p>
      </div>
    </div>
  );
};

export default TotalSignupsCard; 