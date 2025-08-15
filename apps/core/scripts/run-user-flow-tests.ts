#!/usr/bin/env ts-node

import { WineClubUserFlowTester } from '../src/test/user-flow-tests.ts';
import * as fs from 'fs';
import * as path from 'path';

interface TestReport {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
  tests: Array<{
    name: string;
    status: 'PASS' | 'FAIL';
    duration: number;
    error?: string;
    screenshots?: string[];
  }>;
  recommendations: string[];
  performance: {
    averageLoadTime: number;
    slowestTest: string;
    fastestTest: string;
  };
}

class TestReporter {
  private report: TestReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      summary: { total: 0, passed: 0, failed: 0, successRate: 0 },
      tests: [],
      recommendations: [],
      performance: { averageLoadTime: 0, slowestTest: '', fastestTest: '' }
    };
  }

  generateReport(testResults: any[]) {
    this.report.tests = testResults;
    this.report.summary.total = testResults.length;
    this.report.summary.passed = testResults.filter(r => r.status === 'PASS').length;
    this.report.summary.failed = testResults.filter(r => r.status === 'FAIL').length;
    this.report.summary.successRate = (this.report.summary.passed / this.report.summary.total) * 100;

    // Calculate performance metrics
    const durations = testResults.map(r => r.duration);
    this.report.performance.averageLoadTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    const fastest = testResults.reduce((min, test) => test.duration < min.duration ? test : min);
    const slowest = testResults.reduce((max, test) => test.duration > max.duration ? test : max);
    
    this.report.performance.fastestTest = fastest.testName;
    this.report.performance.slowestTest = slowest.testName;

    // Generate recommendations
    this.generateRecommendations();

    return this.report;
  }

  private generateRecommendations() {
    const failedTests = this.report.tests.filter(t => t.status === 'FAIL');
    
    if (this.report.summary.successRate >= 90) {
      this.report.recommendations.push('🎉 Excellent! The platform provides outstanding user experience.');
    } else if (this.report.summary.successRate >= 75) {
      this.report.recommendations.push('👍 Good user experience with room for improvement.');
    } else {
      this.report.recommendations.push('⚠️ Significant user experience issues need attention.');
    }

    // Specific recommendations based on failed tests
    failedTests.forEach(test => {
      if (test.testName.includes('Registration')) {
        this.report.recommendations.push('🔧 Review user registration flow for better conversion.');
      }
      if (test.testName.includes('Checkout')) {
        this.report.recommendations.push('💳 Optimize checkout process to reduce cart abandonment.');
      }
      if (test.testName.includes('Mobile')) {
        this.report.recommendations.push('📱 Improve mobile responsiveness for better mobile UX.');
      }
      if (test.testName.includes('Accessibility')) {
        this.report.recommendations.push('♿ Enhance accessibility features for inclusive design.');
      }
      if (test.testName.includes('Performance')) {
        this.report.recommendations.push('⚡ Optimize page load times for better user satisfaction.');
      }
    });

    // Performance recommendations
    if (this.report.performance.averageLoadTime > 2000) {
      this.report.recommendations.push('🚀 Consider performance optimizations to improve load times.');
    }
  }

  saveReport(report: TestReport, filename: string = 'user-flow-test-report.json') {
    const reportsDir = path.join(__dirname, '../test-reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filepath = path.join(reportsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Test report saved to: ${filepath}`);
    return filepath;
  }

  generateHTMLReport(report: TestReport, filename: string = 'user-flow-test-report.html') {
    const reportsDir = path.join(__dirname, '../test-reports');
    const filepath = path.join(reportsDir, filename);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wine Club User Flow Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #8B2635 0%, #C17817 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header .subtitle { opacity: 0.9; margin-top: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; background: #f8f9fa; }
        .metric { text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric .value { font-size: 2em; font-weight: bold; margin-bottom: 10px; }
        .metric .label { color: #666; }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .warning { color: #ffc107; }
        .tests { padding: 30px; }
        .test-item { display: flex; align-items: center; padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid; }
        .test-item.pass { background: #d4edda; border-left-color: #28a745; }
        .test-item.fail { background: #f8d7da; border-left-color: #dc3545; }
        .test-status { font-weight: bold; margin-right: 15px; }
        .test-name { flex: 1; }
        .test-duration { color: #666; font-size: 0.9em; }
        .recommendations { padding: 30px; background: #e9ecef; }
        .recommendation { padding: 10px; margin-bottom: 10px; background: white; border-radius: 4px; }
        .performance { padding: 30px; background: #f8f9fa; }
        .performance-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍷 Wine Club User Flow Test Report</h1>
            <div class="subtitle">Generated on ${new Date(report.timestamp).toLocaleString()}</div>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="value">${report.summary.total}</div>
                <div class="label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="value success">${report.summary.passed}</div>
                <div class="label">Passed</div>
            </div>
            <div class="metric">
                <div class="value failure">${report.summary.failed}</div>
                <div class="label">Failed</div>
            </div>
            <div class="metric">
                <div class="value ${report.summary.successRate >= 90 ? 'success' : report.summary.successRate >= 75 ? 'warning' : 'failure'}">${report.summary.successRate.toFixed(1)}%</div>
                <div class="label">Success Rate</div>
            </div>
        </div>
        
        <div class="tests">
            <h2>Test Results</h2>
            ${report.tests.map(test => `
                <div class="test-item ${test.status.toLowerCase()}">
                    <div class="test-status">${test.status === 'PASS' ? '✅' : '❌'}</div>
                    <div class="test-name">${test.testName}</div>
                    <div class="test-duration">${test.duration}ms</div>
                </div>
                ${test.error ? `<div style="margin-left: 40px; color: #dc3545; font-size: 0.9em;">Error: ${test.error}</div>` : ''}
            `).join('')}
        </div>
        
        <div class="performance">
            <h2>Performance Metrics</h2>
            <div class="performance-grid">
                <div class="metric">
                    <div class="value">${report.performance.averageLoadTime.toFixed(0)}ms</div>
                    <div class="label">Average Load Time</div>
                </div>
                <div class="metric">
                    <div class="value">${report.performance.fastestTest}</div>
                    <div class="label">Fastest Test</div>
                </div>
                <div class="metric">
                    <div class="value">${report.performance.slowestTest}</div>
                    <div class="label">Slowest Test</div>
                </div>
            </div>
        </div>
        
        <div class="recommendations">
            <h2>Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation">${rec}</div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filepath, html);
    console.log(`🌐 HTML report saved to: ${filepath}`);
    return filepath;
  }
}

async function main() {
  console.log('🍷 Wine Club User Flow Test Suite');
  console.log('==================================\n');

  const tester = new WineClubUserFlowTester();
  const reporter = new TestReporter();

  try {
    await tester.initialize();
    await tester.runAllTests();

    // Generate reports
    const report = reporter.generateReport(tester.results);
    reporter.saveReport(report);
    reporter.generateHTMLReport(report);

    console.log('\n🎯 Test Suite Completed!');
    console.log(`📊 Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    console.log(`⚡ Average Load Time: ${report.performance.averageLoadTime.toFixed(0)}ms`);

    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  } finally {
    await tester.cleanup();
  }
}

if (require.main === module) {
  main();
}

export { TestReporter }; 