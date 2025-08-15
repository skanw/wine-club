#!/usr/bin/env ts-node

import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

class UserWorkflowTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];
  private testResultsDir = 'test-results';

  constructor() {
    // Create test results directory
    if (!fs.existsSync(this.testResultsDir)) {
      fs.mkdirSync(this.testResultsDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🚀 Initializing Puppeteer...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
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

  async runTest(testName: string, testFn: () => Promise<void>): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      name: testName,
      status: 'passed',
      duration: 0
    };

    try {
      console.log(`\n🧪 Running test: ${testName}`);
      
      // Clear storage before each test
      if (this.page) {
        await this.page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        await this.page.deleteCookie();
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
      result.error = error instanceof Error ? error.message : String(error);
      
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
    
    // Check main sections
    const heroSection = await this.page.$('[data-testid="hero-section"]');
    if (!heroSection) throw new Error('Hero section not found');
    
    const nav = await this.page.$('nav');
    if (!nav) throw new Error('Navigation not found');
    
    const logo = await this.page.$('[data-testid="wine-logo"]');
    if (!logo) throw new Error('Wine logo not found');
  }

  async testNavigation() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000');
    
    // Test navigation links
    const navigationTests = [
      { name: 'Pricing', selector: 'a[href*="pricing"]' },
      { name: 'Demo', selector: 'a[href*="demo"]' },
      { name: 'Login', selector: 'a[href*="login"]' }
    ];
    
    for (const test of navigationTests) {
      const link = await this.page.$(test.selector);
      if (!link) throw new Error(`${test.name} link not found`);
      
      await link.click();
      await this.page.waitForNavigation({ timeout: 5000 });
      
      // Verify we're on the correct page
      const url = this.page.url();
      if (!url.includes(test.name.toLowerCase())) {
        throw new Error(`Navigation to ${test.name} failed`);
      }
      
      // Go back to home
      await this.page.goto('http://localhost:3000');
    }
  }

  async testThemeToggle() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000');
    
    const themeToggle = await this.page.$('[data-testid="theme-toggle"]');
    if (!themeToggle) throw new Error('Theme toggle not found');
    
    // Get initial theme
    const initialTheme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    // Click theme toggle
    await themeToggle.click();
    await this.page.waitForTimeout(500);
    
    // Check if theme changed
    const newTheme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    if (newTheme === initialTheme) {
      throw new Error('Theme did not change after toggle');
    }
  }

  async testAuthenticationPages() {
    if (!this.page) throw new Error('Page not initialized');
    
    // Test login page
    await this.page.goto('http://localhost:3000/login');
    await this.page.waitForSelector('form', { timeout: 10000 });
    
    const emailInput = await this.page.$('input[type="email"]');
    const passwordInput = await this.page.$('input[type="password"]');
    const submitButton = await this.page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Login form elements not found');
    }
    
    // Test signup page
    await this.page.goto('http://localhost:3000/signup');
    await this.page.waitForSelector('form', { timeout: 10000 });
    
    const nameInput = await this.page.$('input[name="name"]');
    const signupEmailInput = await this.page.$('input[type="email"]');
    const signupPasswordInput = await this.page.$('input[type="password"]');
    const signupSubmitButton = await this.page.$('button[type="submit"]');
    
    if (!nameInput || !signupEmailInput || !signupPasswordInput || !signupSubmitButton) {
      throw new Error('Signup form elements not found');
    }
  }

  async testSubscriptionWorkflow() {
    if (!this.page) throw new Error('Page not initialized');
    
    await this.page.goto('http://localhost:3000/pricing');
    await this.page.waitForSelector('[data-testid="pricing-plan"]', { timeout: 10000 });
    
    const pricingPlans = await this.page.$$('[data-testid="pricing-plan"]');
    if (pricingPlans.length === 0) {
      throw new Error('No pricing plans found');
    }
    
    // Test each plan
    for (let i = 0; i < Math.min(pricingPlans.length, 3); i++) {
      const plan = pricingPlans[i];
      
      const planName = await plan.$('[data-testid="plan-name"]');
      const planPrice = await plan.$('[data-testid="plan-price"]');
      const subscribeButton = await plan.$('[data-testid="subscribe-button"]');
      
      if (!planName || !planPrice || !subscribeButton) {
        throw new Error(`Pricing plan ${i + 1} missing required elements`);
      }
    }
  }

  async testResponsiveDesign() {
    if (!this.page) throw new Error('Page not initialized');
    
    // Test mobile viewport
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('header', { timeout: 10000 });
    
    const mobileMenuButton = await this.page.$('[data-testid="mobile-menu-button"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await this.page.waitForTimeout(500);
      
      const mobileMenu = await this.page.$('[data-testid="mobile-menu"]');
      if (!mobileMenu) {
        throw new Error('Mobile menu not found after clicking menu button');
      }
    }
    
    // Test tablet viewport
    await this.page.setViewport({ width: 768, height: 1024 });
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('header', { timeout: 10000 });
    
    const header = await this.page.$('header');
    if (!header) {
      throw new Error('Header not found in tablet view');
    }
  }

  async testPerformance() {
    if (!this.page) throw new Error('Page not initialized');
    
    const startTime = Date.now();
    
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('header', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    if (loadTime > 5000) {
      throw new Error(`Page load time (${loadTime}ms) exceeds 5 second threshold`);
    }
    
    console.log(`📊 Page load time: ${loadTime}ms`);
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
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new UserWorkflowTester();
  tester.runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export default UserWorkflowTester; 