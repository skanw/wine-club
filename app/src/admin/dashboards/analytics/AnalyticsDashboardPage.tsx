import React from 'react';

const AnalyticsDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-2">Total Signups</h2>
            <div className="text-2xl font-bold">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-2">Total Paying Users</h2>
            <div className="text-2xl font-bold">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <div className="text-2xl font-bold">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-2">Revenue Chart</h2>
            <div className="text-gray-500">Chart coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
