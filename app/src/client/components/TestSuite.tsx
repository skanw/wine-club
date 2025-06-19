import React, { useState, useEffect } from 'react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'running';
  message: string;
  timestamp: string;
}

const TestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Wine Logo Rendering',
        test: () => {
          const logoElements = document.querySelectorAll('svg[viewBox="0 0 40 40"]');
          return logoElements.length > 0;
        }
      },
      {
        name: 'Wine Color Palette',
        test: () => {
          const testEl = document.createElement('div');
          testEl.className = 'wine-primary-bg';
          document.body.appendChild(testEl);
          const computed = window.getComputedStyle(testEl);
          const bgColor = computed.backgroundColor;
          document.body.removeChild(testEl);
          return bgColor === 'rgb(139, 0, 0)' || bgColor.includes('139');
        }
      },
      {
        name: 'Page Transitions CSS',
        test: () => {
          const stylesheets = Array.from(document.styleSheets);
          return stylesheets.some(sheet => {
            try {
              const rules = Array.from(sheet.cssRules || []);
              return rules.some(rule => 
                rule.cssText.includes('wine-pour') || 
                rule.cssText.includes('page-transition')
              );
            } catch (e) {
              return false;
            }
          });
        }
      },
      {
        name: 'Scroll Animations',
        test: () => {
          const animatedElements = document.querySelectorAll('.scroll-animate-hidden');
          return animatedElements.length > 0;
        }
      },
      {
        name: 'Navigation Consistency',
        test: () => {
          const navbars = document.querySelectorAll('nav[aria-label="Global"]');
          return navbars.length === 1;
        }
      },
      {
        name: 'Wine-themed Content',
        test: () => {
          const wineContent = document.body.textContent || '';
          return wineContent.includes('Wine Cave') || wineContent.includes('🍷');
        }
      },
      {
        name: 'Responsive Design',
        test: () => {
          const viewportMeta = document.querySelector('meta[name="viewport"]');
          return viewportMeta !== null;
        }
      },
      {
        name: 'Accessibility Labels',
        test: () => {
          const srOnlyElements = document.querySelectorAll('.sr-only');
          return srOnlyElements.length > 0;
        }
      },
      {
        name: 'Hover Effects',
        test: () => {
          const hoverElements = document.querySelectorAll('.wine-hover-lift, .wine-hover-scale');
          return hoverElements.length > 0;
        }
      },
      {
        name: 'Performance (No Layout Shifts)',
        test: () => {
          // Simple check for explicit width/height on images
          const images = document.querySelectorAll('img');
          return Array.from(images).every(img => 
            img.getAttribute('width') && img.getAttribute('height')
          );
        }
      }
    ];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      // Add running state
      setTestResults(prev => [...prev, {
        name: test.name,
        status: 'running',
        message: 'Running...',
        timestamp: new Date().toLocaleTimeString()
      }]);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        const passed = test.test();
        setTestResults(prev => prev.map(result => 
          result.name === test.name 
            ? {
                ...result,
                status: passed ? 'pass' : 'fail',
                message: passed ? 'Test passed successfully' : 'Test failed - requirement not met',
                timestamp: new Date().toLocaleTimeString()
              }
            : result
        ));
      } catch (error) {
        setTestResults(prev => prev.map(result => 
          result.name === test.name 
            ? {
                ...result,
                status: 'fail',
                message: `Test error: ${error}`,
                timestamp: new Date().toLocaleTimeString()
              }
            : result
        ));
      }
    }

    setIsRunning(false);
  };

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const totalTests = testResults.length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🧪 Wine Club UI Test Suite
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Comprehensive validation of wine-themed UI transformations
        </p>
        
        {totalTests > 0 && (
          <div className="mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className={`text-2xl font-bold ${allPassed ? 'text-green-600' : 'text-yellow-600'}`}>
                {passedTests}/{totalTests} Tests Passed
              </div>
              {allPassed && <div className="test-2xl">🎉</div>}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  allPassed ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'wine-gradient-bg wine-hover-lift wine-shadow'
          }`}
        >
          {isRunning ? '🔄 Running Tests...' : '🚀 Run UI Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div 
              key={result.name}
              className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                result.status === 'pass' 
                  ? 'bg-green-50 border-green-500 dark:bg-green-900/20' 
                  : result.status === 'fail'
                  ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                  : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    {result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏳'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.name}
                    </div>
                    <div className={`text-sm ${
                      result.status === 'pass' ? 'text-green-600' : 
                      result.status === 'fail' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {result.message}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {result.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {allPassed && totalTests > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-center">
            <div className="text-4xl mb-2">🎊</div>
            <div className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
              All Tests Passed!
            </div>
            <div className="text-green-700 dark:text-green-400">
              Your Wine Club UI transformation is complete and ready for production.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSuite; 