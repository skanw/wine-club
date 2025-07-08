import React from 'react';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Wine, 
  Calendar,
  Settings,
  FileText,
  Bell
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { data: user } = useAuth();

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$24,500',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Members',
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Shipments',
      value: '892',
      change: '+15.3%',
      changeType: 'positive',
      icon: Wine,
      color: 'bg-purple-500'
    },
    {
      title: 'Retention Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      title: 'Coming Soon',
      description: 'Wine subscription management',
      icon: Users,
      href: '/dashboard' as const,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Coming Soon',
      description: 'Wine cave management',
      icon: Wine,
      href: '/dashboard' as const,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Coming Soon',
      description: 'Wine discovery',
      icon: DollarSign,
      href: '/dashboard' as const,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Coming Soon',
      description: 'Loyalty program',
      icon: BarChart3,
      href: '/dashboard' as const,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const recentActivity = [
    {
      type: 'subscription',
      message: 'New subscription from Sarah Johnson',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      type: 'payment',
      message: 'Payment received from Premium tier',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      type: 'inventory',
      message: 'Low stock alert: Pinot Noir 2019',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      type: 'member',
      message: 'Member cancellation: Mike Davis',
      time: '2 hours ago',
      status: 'error'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.username || 'Admin'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-bordeaux-600 hover:text-bordeaux-700"
                >
                  View dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - Revenue trends</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Growth</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - Member acquisition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 