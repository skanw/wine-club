import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Wine, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star
} from 'lucide-react';
import Button from '../../components/ui/Button';

interface AnalyticsData {
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    growthRate: number;
    averageOrderValue: number;
    topPerformingWineCaves: Array<{
      id: string;
      name: string;
      revenue: number;
      subscribers: number;
    }>;
  };
  subscriptions: {
    totalSubscribers: number;
    activeSubscribers: number;
    churnRate: number;
    averageLifetime: number;
    conversionRate: number;
    topPlans: Array<{
      name: string;
      subscribers: number;
      revenue: number;
    }>;
  };
  engagement: {
    averageRating: number;
    reviewCount: number;
    activeMembers: number;
    retentionRate: number;
    topEngagedMembers: Array<{
      id: string;
      name: string;
      engagementScore: number;
    }>;
  };
  inventory: {
    totalWines: number;
    lowStockWines: number;
    averagePrice: number;
    topSellingWines: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
}

const AnalyticsDashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedWineCave, setSelectedWineCave] = useState<string | null>(null);

  // Mock data - replace with actual queries when operations are implemented
  const analyticsData: AnalyticsData = {
    revenue: {
      totalRevenue: 24500,
      monthlyRevenue: 8200,
      growthRate: 12.5,
      averageOrderValue: 89.99,
      topPerformingWineCaves: [
        { id: '1', name: 'Château Margaux', revenue: 8900, subscribers: 45 },
        { id: '2', name: 'Dom Pérignon', revenue: 6700, subscribers: 32 },
        { id: '3', name: 'Barolo Riserva', revenue: 5400, subscribers: 28 },
      ]
    },
    subscriptions: {
      totalSubscribers: 1247,
      activeSubscribers: 1189,
      churnRate: 4.6,
      averageLifetime: 18,
      conversionRate: 15.2,
      topPlans: [
        { name: 'Premium', subscribers: 456, revenue: 18240 },
        { name: 'Connoisseur', subscribers: 234, revenue: 14040 },
        { name: 'Basic', subscribers: 557, revenue: 11140 },
      ]
    },
    engagement: {
      averageRating: 4.3,
      reviewCount: 892,
      activeMembers: 892,
      retentionRate: 94.2,
      topEngagedMembers: [
        { id: '1', name: 'John Smith', engagementScore: 4.8 },
        { id: '2', name: 'Sarah Johnson', engagementScore: 4.7 },
        { id: '3', name: 'Michael Brown', engagementScore: 4.6 },
      ]
    },
    inventory: {
      totalWines: 156,
      lowStockWines: 12,
      averagePrice: 89.99,
      topSellingWines: [
        { id: '1', name: 'Château Margaux 2018', sales: 45, revenue: 40499.55 },
        { id: '2', name: 'Dom Pérignon 2012', sales: 32, revenue: 9599.68 },
        { id: '3', name: 'Barolo Riserva 2015', sales: 28, revenue: 5319.72 },
      ]
    }
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: `€${analyticsData.revenue.totalRevenue.toLocaleString()}`,
      change: analyticsData.revenue.growthRate,
      changeType: analyticsData.revenue.growthRate >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Total revenue across all wine caves'
    },
    {
      title: 'Active Members',
      value: analyticsData.subscriptions.activeSubscribers.toLocaleString(),
      change: 8.2,
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Currently active subscribers'
    },
    {
      title: 'Monthly Shipments',
      value: analyticsData.engagement.reviewCount.toLocaleString(),
      change: 15.3,
      changeType: 'positive',
      icon: Wine,
      color: 'bg-purple-500',
      description: 'Wines shipped this month'
    },
    {
      title: 'Retention Rate',
      value: `${analyticsData.engagement.retentionRate}%`,
      change: 2.1,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Member retention rate'
    }
  ];

  return (
    <div className="min-h-screen bg-champagne-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-bordeaux-900 mb-2">Analytics Dashboard</h1>
            <p className="text-taupe-600">Track your wine club performance and member engagement</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              {(['day', 'week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedPeriod === period
                      ? 'bg-bordeaux-600 text-white shadow-md'
                      : 'text-taupe-600 hover:text-bordeaux-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            
            <Button variant="primary" size="sm">
              <Calendar className="mr-2" size={16} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                  <metric.icon className={`${metric.color.replace('bg-', 'text-')}`} size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-bordeaux-900 mb-1">{metric.value}</h3>
              <p className="text-sm text-taupe-600 mb-2">{metric.title}</p>
              <p className="text-xs text-taupe-500">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Overview */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-bordeaux-900">Revenue Overview</h3>
              <Button variant="secondary" size="sm">
                <Eye className="mr-1" size={14} />
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Monthly Revenue</span>
                <span className="font-semibold text-bordeaux-900">€{analyticsData.revenue.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Average Order Value</span>
                <span className="font-semibold text-bordeaux-900">€{analyticsData.revenue.averageOrderValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Growth Rate</span>
                <span className="font-semibold text-green-600">+{analyticsData.revenue.growthRate}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-taupe-100">
              <h4 className="text-sm font-medium text-taupe-700 mb-3">Top Performing Wine Caves</h4>
              <div className="space-y-3">
                {analyticsData.revenue.topPerformingWineCaves.map((cave, index) => (
                  <div key={cave.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-bordeaux-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-bordeaux-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-bordeaux-900">{cave.name}</p>
                        <p className="text-xs text-taupe-500">{cave.subscribers} subscribers</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-bordeaux-600">€{cave.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Analytics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-bordeaux-900">Subscription Analytics</h3>
              <Button variant="secondary" size="sm">
                <Eye className="mr-1" size={14} />
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Total Subscribers</span>
                <span className="font-semibold text-bordeaux-900">{analyticsData.subscriptions.totalSubscribers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Active Subscribers</span>
                <span className="font-semibold text-bordeaux-900">{analyticsData.subscriptions.activeSubscribers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Churn Rate</span>
                <span className="font-semibold text-red-600">{analyticsData.subscriptions.churnRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">{analyticsData.subscriptions.conversionRate}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-taupe-100">
              <h4 className="text-sm font-medium text-taupe-700 mb-3">Popular Plans</h4>
              <div className="space-y-3">
                {analyticsData.subscriptions.topPlans.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-champagne-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-champagne-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-bordeaux-900">{plan.name}</p>
                        <p className="text-xs text-taupe-500">{plan.subscribers} subscribers</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-bordeaux-600">€{plan.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Member Engagement & Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Engagement */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-bordeaux-900">Member Engagement</h3>
              <Button variant="secondary" size="sm">
                <Eye className="mr-1" size={14} />
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={16} fill="currentColor" />
                  <span className="font-semibold text-bordeaux-900">{analyticsData.engagement.averageRating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Total Reviews</span>
                <span className="font-semibold text-bordeaux-900">{analyticsData.engagement.reviewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Active Members</span>
                <span className="font-semibold text-bordeaux-900">{analyticsData.engagement.activeMembers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Retention Rate</span>
                <span className="font-semibold text-green-600">{analyticsData.engagement.retentionRate}%</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-taupe-100">
              <h4 className="text-sm font-medium text-taupe-700 mb-3">Most Engaged Members</h4>
              <div className="space-y-3">
                {analyticsData.engagement.topEngagedMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-bordeaux-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-bordeaux-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-bordeaux-900">{member.name}</p>
                        <p className="text-xs text-taupe-500">Engagement Score</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={14} fill="currentColor" />
                      <span className="text-sm font-semibold text-bordeaux-600">{member.engagementScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Overview */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-bordeaux-900">Inventory Overview</h3>
              <Button variant="secondary" size="sm">
                <Eye className="mr-1" size={14} />
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Total Wines</span>
                <span className="font-semibold text-bordeaux-900">{analyticsData.inventory.totalWines.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Low Stock Alert</span>
                <span className="font-semibold text-red-600">{analyticsData.inventory.lowStockWines} wines</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-taupe-600">Average Price</span>
                <span className="font-semibold text-bordeaux-900">€{analyticsData.inventory.averagePrice}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-taupe-100">
              <h4 className="text-sm font-medium text-taupe-700 mb-3">Top Selling Wines</h4>
              <div className="space-y-3">
                {analyticsData.inventory.topSellingWines.map((wine, index) => (
                  <div key={wine.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-champagne-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-champagne-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-bordeaux-900">{wine.name}</p>
                        <p className="text-xs text-taupe-500">{wine.sales} sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-bordeaux-600">€{wine.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage; 