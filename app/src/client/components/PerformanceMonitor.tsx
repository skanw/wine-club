import React, { useState } from 'react';
import { TrendingUp, Clock, Zap, Activity } from 'lucide-react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { metrics, score, grade, recommendations, isComplete } = usePerformanceMonitor();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const getMetricStatus = (metric: string, value: number | null) => {
    if (value === null) return 'loading';
    
    switch (metric) {
      case 'fcp':
        return value < 1.8 ? 'good' : value < 3 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value < 2.5 ? 'good' : value < 4 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-bordeaux-600 text-white p-3 rounded-full shadow-lg hover:bg-bordeaux-700 transition-colors duration-300 z-50"
        aria-label="Open performance monitor"
      >
        <Activity className="h-5 w-5" />
      </button>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white rounded-lg shadow-xl border border-bordeaux-200 z-50 overflow-hidden">
      <div className="bg-bordeaux-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-bordeaux-200 transition-colors duration-300"
          aria-label="Close performance monitor"
        >
          ×
        </button>
      </div>
      
      <div className="p-4">
        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-gray-600">
            {getScoreLabel(score)} Performance
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-sm">Core Web Vitals</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">FCP</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.fcp}s</span>
                <span className={`text-xs ${getStatusColor(getMetricStatus('fcp', metrics.fcp))}`}>
                  {getMetricStatus('fcp', metrics.fcp).replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">LCP</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.lcp}s</span>
                <span className={`text-xs ${getStatusColor(getMetricStatus('lcp', metrics.lcp))}`}>
                  {getMetricStatus('lcp', metrics.lcp).replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">FID</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.fid}ms</span>
                <span className={`text-xs ${getStatusColor(getMetricStatus('fid', metrics.fid))}`}>
                  {getMetricStatus('fid', metrics.fid).replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">CLS</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.cls?.toFixed(3) || '...'}</span>
                <span className={`text-xs ${getStatusColor(getMetricStatus('cls', metrics.cls))}`}>
                  {getMetricStatus('cls', metrics.cls).replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">TTFB</span>
            <span className="text-sm font-medium">{metrics.ttfb}ms</span>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Recommendations</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Optimize images for faster loading</li>
            <li>• Minimize JavaScript bundle size</li>
            <li>• Use CDN for static assets</li>
            <li>• Implement lazy loading</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 