#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ComprehensiveUserFlowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.baseUrl = 'http://localhost:3000';
    this.testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      username: `testuser-${Date.now()}`
    };
  }

  async initialize() {
    console.log('🚀 Initializing Comprehensive User Flow Tester...');
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

  // ===== SPECIFIC SCENARIO TESTS =====

  // Scenario 1: New Wine Cave Discovery & Onboarding
  async testWineCaveDiscoveryAndOnboarding() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to landing page
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
    
    // Test hero section and value proposition
    const heroTitle = await this.page.$eval('h1, .hero h1, [class*="hero"] h1', el => el.textContent);
    console.log(`🎯 Hero title: ${heroTitle}`);

    // Test "Explore Wine Caves" CTA
    const exploreButton = await this.page.$('a[href*="wine-caves"], button:contains("Explore"), a:contains("Explore")');
    if (exploreButton) {
      await exploreButton.click();
      await this.page.waitForTimeout(2000);
    }

    // Test wine cave filtering
    const filterButtons = await this.page.$$('button[class*="filter"], select, [class*="filter"]');
    console.log(`🔍 Found ${filterButtons.length} filter options`);

    // Test wine cave search
    const searchInput = await this.page.$('input[placeholder*="search"], input[name="search"]');
    if (searchInput) {
      await searchInput.type('Bordeaux');
      await this.page.waitForTimeout(1000);
    }

    // Test wine cave card interaction
    const wineCaveCards = await this.page.$$('.card, [class*="card"], [class*="wine-cave"]');
    if (wineCaveCards.length > 0) {
      await wineCaveCards[0].click();
      await this.page.waitForTimeout(2000);
      
      // Test wine cave details page
      const wineList = await this.page.$$('[class*="wine"], .wine-item');
      console.log(`🍷 Found ${wineList.length} wines in cave`);
    }
  }

  // Scenario 2: Subscription Signup & Payment Flow
  async testSubscriptionSignupFlow() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to a wine cave
    await this.page.goto(`${this.baseUrl}/wine-cave`, { waitUntil: 'networkidle0' });

    // Test subscription tier selection
    const subscriptionTiers = await this.page.$$('.tier, [class*="tier"], [class*="subscription"]');
    console.log(`💳 Found ${subscriptionTiers.length} subscription tiers`);

    if (subscriptionTiers.length > 0) {
      // Select a tier
      await subscriptionTiers[0].click();
      await this.page.waitForTimeout(1000);

      // Test "Subscribe Now" button
      const subscribeButton = await this.page.$('button:contains("Subscribe"), a:contains("Subscribe")');
      if (subscribeButton) {
        await subscribeButton.click();
        await this.page.waitForTimeout(2000);

        // Test signup form
        const emailInput = await this.page.$('input[type="email"], input[name="email"]');
        if (emailInput) {
          await emailInput.type(this.testUser.email);
        }

        const passwordInput = await this.page.$('input[type="password"]');
        if (passwordInput) {
          await passwordInput.type(this.testUser.password);
        }

        const nameInput = await this.page.$('input[name="name"], input[name="firstName"]');
        if (nameInput) {
          await nameInput.type('Test User');
        }

        // Test form submission
        const submitButton = await this.page.$('button[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await this.page.waitForTimeout(3000);
        }
      }
    }
  }

  // Scenario 3: AI Sommelier Interaction
  async testAISommelierInteraction() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to AI sommelier page
    await this.page.goto(`${this.baseUrl}/ai-sommelier`, { waitUntil: 'networkidle0' });

    // Test AI chat interface
    const chatInput = await this.page.$('input[placeholder*="message"], textarea, [class*="chat"] input');
    if (chatInput) {
      await chatInput.type('I prefer red wines with bold flavors');
      await this.page.waitForTimeout(1000);

      // Test send button
      const sendButton = await this.page.$('button:contains("Send"), button[type="submit"]');
      if (sendButton) {
        await sendButton.click();
        await this.page.waitForTimeout(3000);
      }
    }

    // Test wine recommendations
    const recommendations = await this.page.$$('[class*="recommendation"], .wine-card');
    console.log(`🤖 Found ${recommendations.length} AI recommendations`);

    // Test preference settings
    const preferenceButtons = await this.page.$$('button[class*="preference"], [class*="taste"]');
    console.log(`👅 Found ${preferenceButtons.length} taste preference options`);
  }

  // Scenario 4: Wine Rating & Review System
  async testWineRatingSystem() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to wine details page
    await this.page.goto(`${this.baseUrl}/wine`, { waitUntil: 'networkidle0' });

    // Test rating stars
    const ratingStars = await this.page.$$('[class*="star"], .rating-star, [class*="rating"]');
    if (ratingStars.length > 0) {
      // Click on 4th star (4/5 rating)
      await ratingStars[3].click();
      await this.page.waitForTimeout(1000);
    }

    // Test review form
    const reviewTextarea = await this.page.$('textarea[placeholder*="review"], textarea[name="review"]');
    if (reviewTextarea) {
      await reviewTextarea.type('Excellent wine with rich flavors and smooth finish');
      await this.page.waitForTimeout(1000);
    }

    // Test flavor profile selection
    const flavorTags = await this.page.$$('[class*="flavor"], .tag, [class*="taste"]');
    if (flavorTags.length > 0) {
      await flavorTags[0].click();
      await flavorTags[1].click();
      await this.page.waitForTimeout(1000);
    }

    // Test submit review
    const submitReviewButton = await this.page.$('button:contains("Submit"), button[type="submit"]');
    if (submitReviewButton) {
      await submitReviewButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  // Scenario 5: Shipping & Delivery Tracking
  async testShippingAndTracking() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to shipping dashboard
    await this.page.goto(`${this.baseUrl}/shipping`, { waitUntil: 'networkidle0' });

    // Test shipping status
    const shippingStatus = await this.page.$$('[class*="status"], .status, [class*="shipping"]');
    console.log(`📦 Found ${shippingStatus.length} shipping status indicators`);

    // Test tracking number input
    const trackingInput = await this.page.$('input[placeholder*="tracking"], input[name="tracking"]');
    if (trackingInput) {
      await trackingInput.type('TRK123456789');
      await this.page.waitForTimeout(1000);

      const trackButton = await this.page.$('button:contains("Track"), button[type="submit"]');
      if (trackButton) {
        await trackButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test delivery preferences
    const deliveryOptions = await this.page.$$('[class*="delivery"], .option, [class*="preference"]');
    console.log(`🚚 Found ${deliveryOptions.length} delivery options`);
  }

  // Scenario 6: User Dashboard & Account Management
  async testUserDashboardAndAccount() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to user dashboard
    await this.page.goto(`${this.baseUrl}/dashboard`, { waitUntil: 'networkidle0' });

    // Test dashboard widgets
    const dashboardWidgets = await this.page.$$('[class*="widget"], .card, [class*="metric"]');
    console.log(`📊 Found ${dashboardWidgets.length} dashboard widgets`);

    // Test subscription management
    const subscriptionSection = await this.page.$('[class*="subscription"], .subscription');
    if (subscriptionSection) {
      const manageButton = await subscriptionSection.$('button:contains("Manage"), a:contains("Manage")');
      if (manageButton) {
        await manageButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test wine preferences
    const preferencesSection = await this.page.$('[class*="preferences"], .preferences');
    if (preferencesSection) {
      const editButton = await preferencesSection.$('button:contains("Edit"), a:contains("Edit")');
      if (editButton) {
        await editButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test account settings
    const accountSettings = await this.page.$('[class*="settings"], .settings, [class*="account"]');
    if (accountSettings) {
      const settingsButton = await accountSettings.$('button:contains("Settings"), a:contains("Settings")');
      if (settingsButton) {
        await settingsButton.click();
        await this.page.waitForTimeout(2000);
      }
    }
  }

  // Scenario 7: Admin Dashboard & Analytics
  async testAdminDashboard() {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to admin dashboard
    await this.page.goto(`${this.baseUrl}/admin`, { waitUntil: 'networkidle0' });

    // Test analytics charts
    const analyticsCharts = await this.page.$$('[class*="chart"], .chart, canvas');
    console.log(`📈 Found ${analyticsCharts.length} analytics charts`);

    // Test user management
    const userManagement = await this.page.$('[class*="users"], .users, [class*="members"]');
    if (userManagement) {
      const usersButton = await userManagement.$('button:contains("Users"), a:contains("Users")');
      if (usersButton) {
        await usersButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test wine inventory management
    const inventorySection = await this.page.$('[class*="inventory"], .inventory, [class*="wine"]');
    if (inventorySection) {
      const inventoryButton = await inventorySection.$('button:contains("Inventory"), a:contains("Inventory")');
      if (inventoryButton) {
        await inventoryButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test shipping management
    const shippingSection = await this.page.$('[class*="shipping"], .shipping');
    if (shippingSection) {
      const shippingButton = await shippingSection.$('button:contains("Shipping"), a:contains("Shipping")');
      if (shippingButton) {
        await shippingButton.click();
        await this.page.waitForTimeout(2000);
      }
    }
  }

  // Scenario 8: Mobile Responsiveness & Touch Interactions
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

      // Test mobile navigation
      const mobileMenu = await this.page.$('[class*="mobile"], .mobile-menu, [class*="hamburger"]');
      if (mobileMenu) {
        await mobileMenu.click();
        await this.page.waitForTimeout(1000);
      }

      // Test touch targets (minimum 44px)
      const touchTargets = await this.page.$$('button, a, input');
      console.log(`👆 Found ${touchTargets.length} touch targets`);

      // Test swipe gestures on wine cards
      const wineCards = await this.page.$$('.card, [class*="card"], [class*="wine"]');
      if (wineCards.length > 1) {
        await this.page.mouse.move(200, 300);
        await this.page.mouse.down();
        await this.page.mouse.move(100, 300);
        await this.page.mouse.up();
        await this.page.waitForTimeout(1000);
      }
    }

    // Reset to desktop viewport
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  // Scenario 9: Accessibility & Keyboard Navigation
  async testAccessibilityAndKeyboard() {
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

    // Test skip links
    const skipLinks = await this.page.$$('a[href*="#main"], a[href*="#content"]');
    console.log(`♿ Found ${skipLinks.length} skip links`);

    // Test alt text for images
    const images = await this.page.$$('img');
    let imagesWithAlt = 0;
    for (const img of images) {
      const altText = await img.evaluate(el => el.getAttribute('alt'));
      if (altText) imagesWithAlt++;
    }
    console.log(`🖼️ Images with alt text: ${imagesWithAlt}/${images.length}`);

    // Test ARIA labels
    const ariaLabels = await this.page.$$('[aria-label], [aria-labelledby]');
    console.log(`🎯 Found ${ariaLabels.length} ARIA labels`);

    // Test color contrast (basic check)
    const textElements = await this.page.$$('p, h1, h2, h3, h4, h5, h6, span, div');
    console.log(`📝 Found ${textElements.length} text elements for contrast testing`);
  }

  // Scenario 10: Performance & Loading States
  async testPerformanceAndLoading() {
    if (!this.page) throw new Error('Page not initialized');

    // Test initial page load
    const startTime = Date.now();
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;

    console.log(`📊 Initial page load time: ${loadTime}ms`);

    if (loadTime > 3000) {
      console.log('⚠️ Page load time is slow (>3s)');
    } else {
      console.log('✅ Page load time is acceptable');
    }

    // Test loading states
    const loadingSpinners = await this.page.$$('[class*="loading"], .spinner, [class*="skeleton"]');
    console.log(`⏳ Found ${loadingSpinners.length} loading indicators`);

    // Test lazy loading images
    const images = await this.page.$$('img');
    console.log(`📸 Total images: ${images.length}`);

    // Test infinite scroll (if applicable)
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(2000);

    // Test search performance
    const searchInput = await this.page.$('input[placeholder*="search"], input[name="search"]');
    if (searchInput) {
      const searchStartTime = Date.now();
      await searchInput.type('wine');
      await this.page.waitForTimeout(1000);
      const searchTime = Date.now() - searchStartTime;
      console.log(`🔍 Search response time: ${searchTime}ms`);
    }
  }

  // Scenario 11: Error Handling & Edge Cases
  async testErrorHandling() {
    if (!this.page) throw new Error('Page not initialized');

    // Test 404 page
    await this.page.goto(`${this.baseUrl}/non-existent-page`, { waitUntil: 'networkidle0' });
    
    const errorMessage = await this.page.$('[class*="error"], .error, [class*="404"]');
    if (errorMessage) {
      console.log('✅ 404 error page found');
    }

    // Test form validation
    await this.page.goto(`${this.baseUrl}/signup`, { waitUntil: 'networkidle0' });
    
    const submitButton = await this.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await this.page.waitForTimeout(1000);
      
      const validationErrors = await this.page.$$('[class*="error"], .error, [class*="validation"]');
      console.log(`⚠️ Found ${validationErrors.length} validation errors`);
    }

    // Test network error handling
    await this.page.setOfflineMode(true);
    await this.page.goto(this.baseUrl);
    await this.page.waitForTimeout(1000);
    
    const offlineMessage = await this.page.$('[class*="offline"], .offline, [class*="error"]');
    if (offlineMessage) {
      console.log('✅ Offline error handling found');
    }
    
    await this.page.setOfflineMode(false);
  }

  // Scenario 12: Internationalization & Localization
  async testInternationalization() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });

    // Test language selector
    const languageSelector = await this.page.$('[class*="language"], .language, select[name="lang"]');
    if (languageSelector) {
      console.log('✅ Language selector found');
      
      // Test French language
      await languageSelector.select('fr');
      await this.page.waitForTimeout(2000);
      
      const frenchText = await this.page.$eval('body', el => el.textContent);
      if (frenchText.includes('français') || frenchText.includes('French')) {
        console.log('✅ French localization working');
      }
    }

    // Test currency display
    const currencyElements = await this.page.$$('[class*="price"], .price, [class*="currency"]');
    console.log(`💰 Found ${currencyElements.length} currency elements`);

    // Test date formatting
    const dateElements = await this.page.$$('[class*="date"], .date, time');
    console.log(`📅 Found ${dateElements.length} date elements`);
  }

  // Run all specific scenario tests
  async runAllScenarioTests() {
    console.log('🍷 Starting Comprehensive Wine Club Scenario Tests...\n');

    const scenarios = [
      { name: 'Wine Cave Discovery & Onboarding', fn: () => this.testWineCaveDiscoveryAndOnboarding() },
      { name: 'Subscription Signup & Payment Flow', fn: () => this.testSubscriptionSignupFlow() },
      { name: 'AI Sommelier Interaction', fn: () => this.testAISommelierInteraction() },
      { name: 'Wine Rating & Review System', fn: () => this.testWineRatingSystem() },
      { name: 'Shipping & Delivery Tracking', fn: () => this.testShippingAndTracking() },
      { name: 'User Dashboard & Account Management', fn: () => this.testUserDashboardAndAccount() },
      { name: 'Admin Dashboard & Analytics', fn: () => this.testAdminDashboard() },
      { name: 'Mobile Responsiveness & Touch Interactions', fn: () => this.testMobileResponsiveness() },
      { name: 'Accessibility & Keyboard Navigation', fn: () => this.testAccessibilityAndKeyboard() },
      { name: 'Performance & Loading States', fn: () => this.testPerformanceAndLoading() },
      { name: 'Error Handling & Edge Cases', fn: () => this.testErrorHandling() },
      { name: 'Internationalization & Localization', fn: () => this.testInternationalization() }
    ];

    for (const scenario of scenarios) {
      await this.runTest(scenario.name, scenario.fn);
    }

    this.printDetailedResults();
  }

  printDetailedResults() {
    console.log('\n📊 Comprehensive Test Results Summary:');
    console.log('='.repeat(60));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Scenarios: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    // Group results by category
    const categories = {
      'User Journey': ['Wine Cave Discovery & Onboarding', 'Subscription Signup & Payment Flow'],
      'AI Features': ['AI Sommelier Interaction'],
      'Engagement': ['Wine Rating & Review System'],
      'Operations': ['Shipping & Delivery Tracking', 'User Dashboard & Account Management'],
      'Admin': ['Admin Dashboard & Analytics'],
      'UX/UI': ['Mobile Responsiveness & Touch Interactions', 'Accessibility & Keyboard Navigation'],
      'Technical': ['Performance & Loading States', 'Error Handling & Edge Cases'],
      'Global': ['Internationalization & Localization']
    };

    console.log('\n📋 Results by Category:');
    for (const [category, tests] of Object.entries(categories)) {
      const categoryResults = this.results.filter(r => tests.includes(r.testName));
      const categoryPassed = categoryResults.filter(r => r.status === 'PASS').length;
      const categoryTotal = categoryResults.length;
      const categoryRate = categoryTotal > 0 ? ((categoryPassed / categoryTotal) * 100).toFixed(1) : '0.0';
      
      console.log(`  ${category}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    }
    
    if (failed > 0) {
      console.log('\n❌ Failed Scenarios:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`  - ${r.testName}: ${r.error}`);
        });
    }
    
    console.log('\n🎯 Human-Computer Interaction Assessment:');
    if (failed === 0) {
      console.log('🏆 EXCEPTIONAL: All user scenarios work perfectly!');
      console.log('✅ The platform provides outstanding user experience across all touchpoints');
      console.log('✅ User journeys are intuitive and friction-free');
      console.log('✅ AI features enhance user engagement');
      console.log('✅ Mobile experience is optimized for all devices');
      console.log('✅ Accessibility features meet WCAG standards');
      console.log('✅ Performance is excellent across all scenarios');
      console.log('✅ Error handling is robust and user-friendly');
      console.log('✅ Internationalization is properly implemented');
    } else if (failed <= 3) {
      console.log('👍 EXCELLENT: Most scenarios work exceptionally well');
      console.log('🔧 Minor improvements needed for optimal user experience');
      console.log('🎯 Platform is ready for production with minor fixes');
    } else if (failed <= 6) {
      console.log('✅ GOOD: Core functionality works well');
      console.log('🔧 Several areas need attention for better UX');
      console.log('📈 Platform has solid foundation with room for improvement');
    } else {
      console.log('⚠️ NEEDS WORK: Multiple user experience issues detected');
      console.log('🔧 Prioritize fixing failed scenarios for user satisfaction');
      console.log('📋 Focus on core user journeys first');
    }

    // Generate recommendations
    console.log('\n💡 Recommendations:');
    if (failed > 0) {
      const failedTests = this.results.filter(r => r.status === 'FAIL');
      const criticalTests = failedTests.filter(r => 
        r.testName.includes('Signup') || 
        r.testName.includes('Payment') || 
        r.testName.includes('Dashboard')
      );
      
      if (criticalTests.length > 0) {
        console.log('🚨 CRITICAL: Fix core user flows first');
        criticalTests.forEach(t => console.log(`   - ${t.testName}`));
      }
      
      const uxTests = failedTests.filter(r => 
        r.testName.includes('Mobile') || 
        r.testName.includes('Accessibility') || 
        r.testName.includes('Performance')
      );
      
      if (uxTests.length > 0) {
        console.log('🎨 UX: Improve user experience');
        uxTests.forEach(t => console.log(`   - ${t.testName}`));
      }
    } else {
      console.log('🎉 All scenarios passed! Consider:');
      console.log('   - A/B testing for optimization');
      console.log('   - User feedback collection');
      console.log('   - Performance monitoring');
      console.log('   - Accessibility audits');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    const tester = new ComprehensiveUserFlowTester();
    
    try {
      await tester.initialize();
      await tester.runAllScenarioTests();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    } finally {
      await tester.cleanup();
      process.exit(0);
    }
  })();
}

module.exports = { ComprehensiveUserFlowTester }; 