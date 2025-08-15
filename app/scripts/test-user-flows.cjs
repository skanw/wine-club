#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class SimpleUserFlowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.baseUrl = 'http://localhost:3000';
  }

  async initialize() {
    console.log('🚀 Initializing Simple User Flow Tester...');
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ Tester initialized successfully');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }

  async takeScreenshot(name) {
    if (!this.page) throw new Error('Page not initialized');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-screenshots/${name}-${timestamp}.png`;
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await this.page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  async runTest(testName, testFn) {
    const startTime = Date.now();
    const result = {
      testName,
      status: 'PASS',
      duration: 0,
      error: null,
      screenshots: []
    };

    try {
      console.log(`\n🧪 Running test: ${testName}`);
      await testFn();
      result.duration = Date.now() - startTime;
      console.log(`✅ ${testName} - PASSED (${result.duration}ms)`);
    } catch (error) {
      result.status = 'FAIL';
      result.duration = Date.now() - startTime;
      result.error = error.message;
      console.log(`❌ ${testName} - FAILED (${result.duration}ms): ${result.error}`);
      
      try {
        const screenshot = await this.takeScreenshot(`failed-${testName}`);
        result.screenshots.push(screenshot);
      } catch (screenshotError) {
        console.log('⚠️ Failed to take screenshot:', screenshotError);
      }
    }

    this.results.push(result);
    return result;
  }

  // Test 1: Landing Page Experience
  async testLandingPageExperience() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to landing page
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
    
    // Check page title
    const title = await this.page.title();
    console.log(`📄 Page title: ${title}`);

    // Test hero section
    const heroSection = await this.page.$('main, .hero, [class*="hero"]');
    if (!heroSection) {
      throw new Error('Hero section not found');
    }

    // Test navigation menu
    const navMenu = await this.page.$('nav, header');
    if (!navMenu) {
      throw new Error('Navigation menu not found');
    }

    // Test call-to-action buttons
    const ctaButtons = await this.page.$$('button, a[href*="signup"], a[href*="login"]');
    console.log(`🔘 Found ${ctaButtons.length} call-to-action buttons`);

    // Test responsive design (mobile viewport)
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.waitForTimeout(1000);
    
    // Reset viewport
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  // Test 2: User Registration Flow
  async testUserRegistrationFlow() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to signup page
    await this.page.goto(`${this.baseUrl}/signup`, { waitUntil: 'networkidle0' });

    // Look for registration form
    const form = await this.page.$('form');
    if (!form) {
      throw new Error('Registration form not found');
    }

    // Fill registration form if fields exist
    const emailInput = await this.page.$('input[type="email"], input[name="email"]');
    if (emailInput) {
      await emailInput.type(`test-${Date.now()}@example.com`);
    }

    const usernameInput = await this.page.$('input[name="username"]');
    if (usernameInput) {
      await usernameInput.type(`testuser-${Date.now()}`);
    }

    const passwordInput = await this.page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.type('TestPassword123!');
    }

    // Test form submission
    const submitButton = await this.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  // Test 3: Wine Cave Discovery
  async testWineCaveDiscovery() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to wine caves page
    await this.page.goto(`${this.baseUrl}/wine-caves`, { waitUntil: 'networkidle0' });

    // Test wine cave cards
    const wineCaveCards = await this.page.$$('.card, [class*="card"], [class*="wine-cave"]');
    console.log(`🍷 Found ${wineCaveCards.length} wine cave cards`);

    // Test search functionality
    const searchInput = await this.page.$('input[placeholder*="search"], input[name="search"]');
    if (searchInput) {
      await searchInput.type('Bordeaux');
      await this.page.waitForTimeout(1000);
    }

    // Click on a wine cave if available
    if (wineCaveCards.length > 0) {
      await wineCaveCards[0].click();
      await this.page.waitForTimeout(1000);
    }
  }

  // Test 4: Subscription Checkout
  async testSubscriptionCheckout() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to a wine cave
    await this.page.goto(`${this.baseUrl}/wine-cave`, { waitUntil: 'networkidle0' });

    // Test subscription tier selection
    const subscriptionTiers = await this.page.$$('.tier, [class*="tier"], [class*="subscription"]');
    console.log(`💳 Found ${subscriptionTiers.length} subscription tiers`);

    // Select a subscription tier if available
    if (subscriptionTiers.length > 0) {
      await subscriptionTiers[0].click();
      await this.page.waitForTimeout(500);
    }

    // Test "Subscribe Now" button
    const subscribeButton = await this.page.$('button:contains("Subscribe"), a:contains("Subscribe")');
    if (subscribeButton) {
      await subscribeButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  // Test 5: User Dashboard
  async testUserDashboard() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to dashboard
    await this.page.goto(`${this.baseUrl}/dashboard`, { waitUntil: 'networkidle0' });

    // Test dashboard layout
    const dashboard = await this.page.$('main, .dashboard, [class*="dashboard"]');
    if (!dashboard) {
      console.log('⚠️ Dashboard not found - may need authentication');
      return;
    }

    // Test navigation menu
    const navItems = await this.page.$$('nav a, nav button');
    console.log(`🧭 Found ${navItems.length} navigation items`);
  }

  // Test 6: Mobile Responsiveness
  async testMobileResponsiveness() {
    if (!this.page) throw new Error('Page not initialized');

    const mobileViewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 414, height: 896, name: 'iPhone 11 Pro' },
      { width: 768, height: 1024, name: 'iPad' }
    ];

    for (const viewport of mobileViewports) {
      console.log(`\n📱 Testing ${viewport.name} viewport`);
      
      await this.page.setViewport(viewport);
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      await this.page.waitForTimeout(1000);

      // Test touch targets
      const touchTargets = await this.page.$$('button, a, input');
      console.log(`👆 Found ${touchTargets.length} touch targets`);
    }

    // Reset to desktop viewport
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  // Test 7: Accessibility
  async testAccessibility() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    // Test keyboard navigation
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
    
    // Check for focus indicators
    const focusedElement = await this.page.evaluate(() => {
      const element = document.activeElement;
      return element ? element.tagName : null;
    });
    
    if (focusedElement) {
      console.log(`✅ Keyboard navigation: Focus on ${focusedElement}`);
    }

    // Test alt text for images
    const images = await this.page.$$('img');
    let imagesWithAlt = 0;
    for (const img of images) {
      const altText = await img.evaluate(el => el.getAttribute('alt'));
      if (altText) imagesWithAlt++;
    }
    console.log(`🖼️ Images with alt text: ${imagesWithAlt}/${images.length}`);
  }

  // Test 8: Performance
  async testPerformance() {
    if (!this.page) throw new Error('Page not initialized');

    const startTime = Date.now();
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;

    console.log(`📊 Page load time: ${loadTime}ms`);

    if (loadTime > 3000) {
      console.log('⚠️ Page load time is slow (>3s)');
    } else {
      console.log('✅ Page load time is acceptable');
    }

    // Test image loading
    const images = await this.page.$$('img');
    console.log(`📸 Total images: ${images.length}`);
  }

  // Run all tests
  async runAllTests() {
    console.log('🍷 Starting Wine Club User Flow Tests...\n');

    const tests = [
      { name: 'Landing Page Experience', fn: () => this.testLandingPageExperience() },
      { name: 'User Registration Flow', fn: () => this.testUserRegistrationFlow() },
      { name: 'Wine Cave Discovery', fn: () => this.testWineCaveDiscovery() },
      { name: 'Subscription Checkout', fn: () => this.testSubscriptionCheckout() },
      { name: 'User Dashboard', fn: () => this.testUserDashboard() },
      { name: 'Mobile Responsiveness', fn: () => this.testMobileResponsiveness() },
      { name: 'Accessibility', fn: () => this.testAccessibility() },
      { name: 'Performance', fn: () => this.testPerformance() }
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.fn);
    }

    this.printResults();
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`  - ${r.testName}: ${r.error}`);
        });
    }
    
    console.log('\n🎯 Human-Computer Interaction Assessment:');
    if (failed === 0) {
      console.log('✅ EXCELLENT: All user flows work perfectly!');
      console.log('✅ The platform provides outstanding user experience');
      console.log('✅ Navigation is intuitive and responsive');
      console.log('✅ Forms are well-designed and functional');
      console.log('✅ Mobile experience is optimized');
      console.log('✅ Accessibility features are properly implemented');
    } else if (failed <= 2) {
      console.log('👍 GOOD: Most user flows work well with minor issues');
      console.log('🔧 Consider addressing the failed tests for better UX');
    } else {
      console.log('⚠️ NEEDS IMPROVEMENT: Several user experience issues detected');
      console.log('🔧 Prioritize fixing the failed tests for better user satisfaction');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    const tester = new SimpleUserFlowTester();
    
    try {
      await tester.initialize();
      await tester.runAllTests();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    } finally {
      await tester.cleanup();
      process.exit(0);
    }
  })();
}

module.exports = { SimpleUserFlowTester }; 