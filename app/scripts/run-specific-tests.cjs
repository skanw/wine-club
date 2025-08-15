#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class SpecificTestRunner {
  constructor() {
    this.config = this.loadConfig();
    this.results = [];
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../test-config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('❌ Failed to load test configuration:', error.message);
      process.exit(1);
    }
  }

  async runTestSuite(suiteName) {
    const suite = this.config.testSuites[suiteName];
    if (!suite) {
      console.error(`❌ Test suite '${suiteName}' not found`);
      return false;
    }

    console.log(`\n🚀 Running test suite: ${suiteName}`);
    console.log(`📝 Description: ${suite.description}`);
    console.log(`📋 Scenarios: ${suite.scenarios.length}`);
    console.log('='.repeat(60));

    const scriptPath = path.join(__dirname, suite.script);
    
    if (!fs.existsSync(scriptPath)) {
      console.error(`❌ Test script not found: ${scriptPath}`);
      return false;
    }

    return new Promise((resolve) => {
      const child = spawn('node', [scriptPath], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      child.on('close', (code) => {
        const success = code === 0;
        console.log(`\n${success ? '✅' : '❌'} Test suite '${suiteName}' ${success ? 'completed successfully' : 'failed'} (exit code: ${code})`);
        resolve(success);
      });

      child.on('error', (error) => {
        console.error(`❌ Failed to run test suite '${suiteName}':`, error.message);
        resolve(false);
      });
    });
  }

  async runMultipleSuites(suiteNames) {
    console.log('🍷 Wine Club Platform - Specific Test Runner');
    console.log('='.repeat(60));
    
    const results = [];
    
    for (const suiteName of suiteNames) {
      const success = await this.runTestSuite(suiteName);
      results.push({ suite: suiteName, success });
    }

    this.printSummary(results);
    return results;
  }

  printSummary(results) {
    console.log('\n📊 Test Suite Summary:');
    console.log('='.repeat(60));
    
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;
    
    console.log(`Total Test Suites: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Test Suites:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.suite}`);
      });
    }

    console.log('\n🎯 Platform Assessment:');
    if (failed === 0) {
      console.log('🏆 EXCEPTIONAL: All test suites passed!');
      console.log('✅ The Wine Club platform is ready for production');
      console.log('✅ All user scenarios work perfectly');
      console.log('✅ Wine-specific features are fully functional');
      console.log('✅ Platform meets industry standards');
    } else if (failed <= 1) {
      console.log('👍 EXCELLENT: Most test suites passed');
      console.log('🔧 Minor improvements needed for optimal experience');
      console.log('🎯 Platform is production-ready with minor fixes');
    } else if (failed <= 2) {
      console.log('✅ GOOD: Core functionality works well');
      console.log('🔧 Several areas need attention');
      console.log('📈 Platform has solid foundation');
    } else {
      console.log('⚠️ NEEDS WORK: Multiple test suites failed');
      console.log('🔧 Prioritize fixing failed test suites');
      console.log('📋 Focus on core user journeys first');
    }
  }

  showAvailableSuites() {
    console.log('\n📋 Available Test Suites:');
    console.log('='.repeat(60));
    
    Object.entries(this.config.testSuites).forEach(([name, suite]) => {
      console.log(`\n🍷 ${name.toUpperCase()}`);
      console.log(`   Description: ${suite.description}`);
      console.log(`   Scenarios: ${suite.scenarios.length}`);
      console.log(`   Script: ${suite.script}`);
      console.log('   Scenarios:');
      suite.scenarios.forEach((scenario, index) => {
        console.log(`     ${index + 1}. ${scenario}`);
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const runner = new SpecificTestRunner();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🍷 Wine Club Platform Test Runner');
    console.log('\nUsage:');
    console.log('  node scripts/run-specific-tests.cjs <suite1> [suite2] [suite3]');
    console.log('  node scripts/run-specific-tests.cjs --list');
    console.log('  node scripts/run-specific-tests.cjs --all');
    console.log('\nExamples:');
    console.log('  node scripts/run-specific-tests.cjs basic');
    console.log('  node scripts/run-specific-tests.cjs comprehensive wine-specific');
    console.log('  node scripts/run-specific-tests.cjs --all');
    
    runner.showAvailableSuites();
    process.exit(0);
  }

  if (args.includes('--list')) {
    runner.showAvailableSuites();
    process.exit(0);
  }

  let suitesToRun = [];
  
  if (args.includes('--all')) {
    suitesToRun = Object.keys(runner.config.testSuites);
  } else {
    suitesToRun = args;
  }

  // Validate suite names
  const validSuites = Object.keys(runner.config.testSuites);
  const invalidSuites = suitesToRun.filter(suite => !validSuites.includes(suite));
  
  if (invalidSuites.length > 0) {
    console.error('❌ Invalid test suites:', invalidSuites.join(', '));
    console.log('\nValid test suites:');
    validSuites.forEach(suite => console.log(`  - ${suite}`));
    process.exit(1);
  }

  runner.runMultipleSuites(suitesToRun).then(results => {
    const allPassed = results.every(r => r.success);
    process.exit(allPassed ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { SpecificTestRunner }; 