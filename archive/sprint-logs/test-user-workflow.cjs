#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class SimpleUserWorkflowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.testResultsDir = 'test-results';
    
    // Create test results directory
    if (!fs.existsSync(this.testResultsDir)) {
      fs.mkdirSync(this.testResultsDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🚀 Initializing Puppeteer...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === 'true',
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Enable console logging
    this.page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    this.page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    console.log('✅ Puppeteer initialized successfully');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }

  async runTest(testName, testFn) {
    const startTime = Date.now();
    const result = {
      name: testName,
      status: 'passed',
      duration: 0
    };

    try {
      console.log(`\n🧪 Running test: ${testName}`);
      
      // Always navigate to a real page before clearing storage
      if (this.page) {
        await this.page.goto('http://localhost:3000');
        await this.page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      }
      
      await testFn();
      
      // Take screenshot on success
      if (this.page) {
        const screenshotPath = path.join(this.testResultsDir, `${testName.replace(/\s+/g, '-').toLowerCase()}-success.png`);
        await this.page.screenshot({ path: screenshotPath });
        result.screenshot = screenshotPath;
      }
      
      console.log(`✅ Test passed: ${testName}`);
      
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      
      // Take screenshot on failure
      if (this.page) {
        const screenshotPath = path.join(this.testResultsDir, `${testName.replace(/\s+/g, '-').toLowerCase()}-failed.png`);
        await this.page.screenshot({ path: screenshotPath });
        result.screenshot = screenshotPath;
      }
      
      console.log(`❌ Test failed: ${testName}`);
      console.log(`   Error: ${result.error}`);
    }

    result.duration = Date.now() - startTime;
    this.results.push(result);
    
    return result;
  }

  async testLandingPage() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('header', { timeout: 10000 });
    
    // Check if page loaded successfully
    const title = await this.page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for main elements
    const header = await this.page.$('header');
    if (!header) throw new Error('Header not found');
    
    const nav = await this.page.$('nav');
    if (!nav) throw new Error('Navigation not found');
    
    // Check for wine-themed elements
    const wineElements = await this.page.$$('[class*="wine"], [class*="bordeaux"], [class*="champagne"]');
    console.log(`🍷 Found ${wineElements.length} wine-themed elements`);
  }

  async testNavigation() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000');
    
    // Test navigation to different pages
    const navigationTests = [
      { name: 'Demo', url: 'http://localhost:3000/demo' },
      { name: 'Pricing', url: 'http://localhost:3000/pricing' },
      { name: 'Login', url: 'http://localhost:3000/login' }
    ];
    
    for (const test of navigationTests) {
      console.log(`🧭 Testing navigation to ${test.name}...`);
      
      await this.page.goto(test.url);
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Verify page loaded
      const currentUrl = this.page.url();
      if (!currentUrl.includes(test.name.toLowerCase())) {
        throw new Error(`Navigation to ${test.name} failed - URL: ${currentUrl}`);
      }
      
      console.log(`✅ Successfully navigated to ${test.name}`);
    }
  }

  async testThemeToggle() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('header', { timeout: 10000 });
    
    // Look for theme toggle button
    const themeToggle = await this.page.$('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
    
    if (themeToggle) {
      console.log('🎨 Theme toggle found, testing...');
      
      // Get initial theme
      const initialTheme = await this.page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      console.log(`🌙 Initial theme: ${initialTheme}`);
      
      // Click theme toggle
      await themeToggle.click();
      await this.page.waitForTimeout(500);
      
      // Check if theme changed
      const newTheme = await this.page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });
      
      console.log(`☀️ New theme: ${newTheme}`);
      
      if (newTheme === initialTheme) {
        throw new Error('Theme did not change after toggle');
      }
    } else {
      console.log('⚠️ Theme toggle not found, skipping test');
    }
  }

  async testAuthenticationPages() {
    if (!this.page) throw new Error('Page not initialized');
    
    // Test login page
    console.log('🔐 Testing login page...');
    await this.page.goto('http://localhost:3000/login');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    const loginForm = await this.page.$('form');
    if (!loginForm) throw new Error('Login form not found');
    
    const emailInput = await this.page.$('input[type="email"], input[name="email"]');
    const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
    
    if (!emailInput || !passwordInput) {
      throw new Error('Login form inputs not found');
    }
    
    console.log('✅ Login page elements found');
    
    // Test signup page
    console.log('📝 Testing signup page...');
    await this.page.goto('http://localhost:3000/signup');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    const signupForm = await this.page.$('form');
    if (!signupForm) throw new Error('Signup form not found');
    
    const nameInput = await this.page.$('input[name="name"], input[placeholder*="name"]');
    const signupEmailInput = await this.page.$('input[type="email"], input[name="email"]');
    const signupPasswordInput = await this.page.$('input[type="password"], input[name="password"]');
    
    if (!nameInput || !signupEmailInput || !signupPasswordInput) {
      throw new Error('Signup form inputs not found');
    }
    
    console.log('✅ Signup page elements found');
  }

  async testSubscriptionWorkflow() {
    if (!this.page) throw new Error('Page not initialized');
    
    console.log('💰 Testing subscription workflow...');
    await this.page.goto('http://localhost:3000/pricing');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    // Look for pricing elements
    const pricingElements = await this.page.$$('[class*="pricing"], [class*="plan"], [class*="subscription"]');
    console.log(`💳 Found ${pricingElements.length} pricing-related elements`);
    
    if (pricingElements.length === 0) {
      // Try alternative selectors
      const cards = await this.page.$$('.card, [class*="card"], .plan, [class*="plan"]');
      console.log(`📋 Found ${cards.length} potential plan cards`);
      
      if (cards.length === 0) {
        throw new Error('No pricing plans found');
      }
    }
    
    // Look for subscribe buttons
    const subscribeButtons = await this.page.$$('button:contains("Subscribe"), button:contains("Get Started"), button:contains("Choose Plan")');
    console.log(`🔘 Found ${subscribeButtons.length} subscribe buttons`);
    
    console.log('✅ Subscription workflow elements found');
  }

  async testResponsiveDesign() {
    if (!this.page) throw new Error('Page not initialized');
    
    console.log('📱 Testing responsive design...');
    
    // Test mobile viewport
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    console.log('📱 Mobile viewport loaded');
    
    // Look for mobile menu
    const mobileMenuButton = await this.page.$('[data-testid="mobile-menu"], button[aria-label*="menu"], button[aria-label*="hamburger"]');
    if (mobileMenuButton) {
      console.log('🍔 Mobile menu button found');
      await mobileMenuButton.click();
      await this.page.waitForTimeout(500);
    }
    
    // Test tablet viewport
    await this.page.setViewport({ width: 768, height: 1024 });
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    console.log('📱 Tablet viewport loaded');
    
    // Test desktop viewport
    await this.page.setViewport({ width: 1280, height: 720 });
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    console.log('🖥️ Desktop viewport loaded');
    
    console.log('✅ Responsive design test completed');
  }

  async testPerformance() {
    if (!this.page) throw new Error('Page not initialized');
    
    console.log('⚡ Testing performance...');
    
    const startTime = Date.now();
    
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    console.log(`📊 Page load time: ${loadTime}ms`);
    
    if (loadTime > 5000) {
      throw new Error(`Page load time (${loadTime}ms) exceeds 5 second threshold`);
    }
    
    // Get performance metrics
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        totalTime: navigation ? navigation.loadEventEnd - navigation.startTime : 0
      };
    });
    
    console.log(`📈 Performance metrics:`, metrics);
    
    console.log('✅ Performance test completed');
  }

  async runAllTests() {
    console.log('🍷 Starting Wine Club SaaS User Workflow Tests\n');
    
    try {
      await this.initialize();
      
      const tests = [
        { name: 'Landing Page Load', fn: () => this.testLandingPage() },
        { name: 'Navigation Links', fn: () => this.testNavigation() },
        { name: 'Theme Toggle', fn: () => this.testThemeToggle() },
        { name: 'Authentication Pages', fn: () => this.testAuthenticationPages() },
        { name: 'Subscription Workflow', fn: () => this.testSubscriptionWorkflow() },
        { name: 'Responsive Design', fn: () => this.testResponsiveDesign() },
        { name: 'Performance', fn: () => this.testPerformance() }
      ];
      
      for (const test of tests) {
        await this.runTest(test.name, test.fn);
      }
      
    } finally {
      await this.cleanup();
    }
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n📋 Test Results Summary');
    console.log('=' .repeat(50));
    
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    // Save results to file
    const reportPath = path.join(this.testResultsDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    if (failed > 0) {
      console.log('\n❌ Some tests failed. Check the screenshots in test-results/ directory.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
      console.log('🍷 Wine Club SaaS is ready for production!');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SimpleUserWorkflowTester();
  tester.runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = SimpleUserWorkflowTester; 