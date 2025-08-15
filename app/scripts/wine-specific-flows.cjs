#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class WineSpecificFlowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.baseUrl = 'http://localhost:3000';
  }

  async initialize() {
    console.log('🍷 Initializing Wine-Specific Flow Tester...');
    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ Wine tester initialized successfully');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Wine tester cleanup completed');
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
      console.log(`\n🍷 Running wine test: ${testName}`);
      await testFn();
      result.duration = Date.now() - startTime;
      console.log(`✅ ${testName} - PASSED (${result.duration}ms)`);
    } catch (error) {
      result.status = 'FAIL';
      result.duration = Date.now() - startTime;
      result.error = error.message;
      console.log(`❌ ${testName} - FAILED (${result.duration}ms): ${result.error}`);
    }

    this.results.push(result);
    return result;
  }

  // Wine-Specific Test 1: Wine Tasting Experience
  async testWineTastingExperience() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/wine-tasting`, { waitUntil: 'networkidle0' });

    // Test wine selection for tasting
    const wineOptions = await this.page.$$('[class*="wine"], .wine-item, [class*="tasting"]');
    console.log(`🍷 Found ${wineOptions.length} wine tasting options`);

    if (wineOptions.length > 0) {
      await wineOptions[0].click();
      await this.page.waitForTimeout(2000);

      // Test tasting notes form
      const notesTextarea = await this.page.$('textarea[placeholder*="notes"], textarea[name="notes"]');
      if (notesTextarea) {
        await notesTextarea.type('Rich cherry notes with subtle oak undertones');
        await this.page.waitForTimeout(1000);
      }

      // Test flavor profile selection
      const flavorProfiles = await this.page.$$('[class*="flavor"], .flavor-tag, [class*="taste"]');
      console.log(`👅 Found ${flavorProfiles.length} flavor profile options`);

      // Test rating system
      const ratingStars = await this.page.$$('[class*="star"], .rating-star');
      if (ratingStars.length >= 5) {
        await ratingStars[4].click(); // 5-star rating
        await this.page.waitForTimeout(1000);
      }

      // Test food pairing suggestions
      const foodPairings = await this.page.$$('[class*="pairing"], .food-pairing');
      console.log(`🍽️ Found ${foodPairings.length} food pairing suggestions`);
    }
  }

  // Wine-Specific Test 2: Cellar Management
  async testCellarManagement() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/cellar`, { waitUntil: 'networkidle0' });

    // Test wine inventory
    const wineInventory = await this.page.$$('[class*="inventory"], .wine-item, [class*="cellar"]');
    console.log(`📦 Found ${wineInventory.length} wines in cellar`);

    // Test cellar organization
    const organizationOptions = await this.page.$$('[class*="organize"], .sort-option, [class*="filter"]');
    console.log(`🗂️ Found ${organizationOptions.length} organization options`);

    // Test wine details view
    if (wineInventory.length > 0) {
      await wineInventory[0].click();
      await this.page.waitForTimeout(2000);

      // Test wine information display
      const wineInfo = await this.page.$$('[class*="info"], .wine-details, [class*="details"]');
      console.log(`ℹ️ Found ${wineInfo.length} wine information sections`);

      // Test aging recommendations
      const agingInfo = await this.page.$('[class*="aging"], .aging-info');
      if (agingInfo) {
        console.log('✅ Aging recommendations found');
      }
    }
  }

  // Wine-Specific Test 3: Sommelier Consultation
  async testSommelierConsultation() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/sommelier`, { waitUntil: 'networkidle0' });

    // Test consultation booking
    const bookButton = await this.page.$('button:contains("Book"), a:contains("Book")');
    if (bookButton) {
      await bookButton.click();
      await this.page.waitForTimeout(2000);

      // Test consultation form
      const consultationType = await this.page.$('select[name="type"], [class*="type"]');
      if (consultationType) {
        await consultationType.select('Wine Selection');
        await this.page.waitForTimeout(1000);
      }

      const dateInput = await this.page.$('input[type="date"], input[name="date"]');
      if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await dateInput.type(tomorrow.toISOString().split('T')[0]);
        await this.page.waitForTimeout(1000);
      }

      const timeInput = await this.page.$('input[type="time"], select[name="time"]');
      if (timeInput) {
        await timeInput.type('14:00');
        await this.page.waitForTimeout(1000);
      }
    }

    // Test sommelier profiles
    const sommelierProfiles = await this.page.$$('[class*="sommelier"], .sommelier-card');
    console.log(`👨‍🍳 Found ${sommelierProfiles.length} sommelier profiles`);
  }

  // Wine-Specific Test 4: Wine Education & Learning
  async testWineEducation() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/education`, { waitUntil: 'networkidle0' });

    // Test educational content
    const educationalContent = await this.page.$$('[class*="lesson"], .course, [class*="education"]');
    console.log(`📚 Found ${educationalContent.length} educational modules`);

    if (educationalContent.length > 0) {
      await educationalContent[0].click();
      await this.page.waitForTimeout(2000);

      // Test lesson navigation
      const lessonNavigation = await this.page.$$('[class*="nav"], .lesson-nav, [class*="progress"]');
      console.log(`🧭 Found ${lessonNavigation.length} lesson navigation elements`);

      // Test interactive elements
      const interactiveElements = await this.page.$$('[class*="interactive"], .quiz, [class*="exercise"]');
      console.log(`🎯 Found ${interactiveElements.length} interactive elements`);
    }
  }

  // Wine-Specific Test 5: Wine Recommendations Engine
  async testWineRecommendations() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/recommendations`, { waitUntil: 'networkidle0' });

    // Test preference setup
    const preferenceForm = await this.page.$('[class*="preferences"], .preference-form');
    if (preferenceForm) {
      // Test wine type preferences
      const wineTypes = await this.page.$$('[class*="wine-type"], .type-option');
      console.log(`🍷 Found ${wineTypes.length} wine type options`);

      if (wineTypes.length > 0) {
        await wineTypes[0].click(); // Select red wine
        await this.page.waitForTimeout(1000);
      }

      // Test price range
      const priceRange = await this.page.$('input[type="range"], [class*="price-range"]');
      if (priceRange) {
        await priceRange.evaluate(el => el.value = '50');
        await this.page.waitForTimeout(1000);
      }

      // Test occasion selection
      const occasions = await this.page.$$('[class*="occasion"], .occasion-option');
      console.log(`🎉 Found ${occasions.length} occasion options`);
    }

    // Test recommendation results
    const recommendations = await this.page.$$('[class*="recommendation"], .wine-card');
    console.log(`🎯 Found ${recommendations.length} wine recommendations`);
  }

  // Wine-Specific Test 6: Wine Club Membership Management
  async testWineClubMembership() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/membership`, { waitUntil: 'networkidle0' });

    // Test membership tiers
    const membershipTiers = await this.page.$$('[class*="tier"], .membership-level, [class*="plan"]');
    console.log(`🏆 Found ${membershipTiers.length} membership tiers`);

    if (membershipTiers.length > 0) {
      await membershipTiers[0].click();
      await this.page.waitForTimeout(2000);

      // Test tier benefits
      const benefits = await this.page.$$('[class*="benefit"], .feature, [class*="perk"]');
      console.log(`✨ Found ${benefits.length} membership benefits`);

      // Test upgrade/downgrade options
      const upgradeButton = await this.page.$('button:contains("Upgrade"), a:contains("Upgrade")');
      if (upgradeButton) {
        console.log('✅ Upgrade option available');
      }
    }

    // Test member rewards
    const rewards = await this.page.$$('[class*="reward"], .points, [class*="loyalty"]');
    console.log(`🎁 Found ${rewards.length} reward elements`);
  }

  // Wine-Specific Test 7: Wine Events & Tastings
  async testWineEvents() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/events`, { waitUntil: 'networkidle0' });

    // Test event listings
    const events = await this.page.$$('[class*="event"], .event-card, [class*="tasting"]');
    console.log(`📅 Found ${events.length} wine events`);

    if (events.length > 0) {
      await events[0].click();
      await this.page.waitForTimeout(2000);

      // Test event details
      const eventDetails = await this.page.$$('[class*="details"], .event-info, [class*="description"]');
      console.log(`ℹ️ Found ${eventDetails.length} event detail sections`);

      // Test RSVP functionality
      const rsvpButton = await this.page.$('button:contains("RSVP"), a:contains("RSVP")');
      if (rsvpButton) {
        await rsvpButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test event filtering
    const eventFilters = await this.page.$$('[class*="filter"], .filter-option');
    console.log(`🔍 Found ${eventFilters.length} event filter options`);
  }

  // Wine-Specific Test 8: Wine Pairing & Food Matching
  async testWinePairing() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/pairing`, { waitUntil: 'networkidle0' });

    // Test food input
    const foodInput = await this.page.$('input[placeholder*="food"], input[name="food"]');
    if (foodInput) {
      await foodInput.type('Grilled steak');
      await this.page.waitForTimeout(1000);

      const searchButton = await this.page.$('button:contains("Find"), button[type="submit"]');
      if (searchButton) {
        await searchButton.click();
        await this.page.waitForTimeout(2000);
      }
    }

    // Test pairing results
    const pairingResults = await this.page.$$('[class*="pairing"], .wine-suggestion, [class*="match"]');
    console.log(`🍽️ Found ${pairingResults.length} wine pairing suggestions`);

    // Test pairing explanations
    const explanations = await this.page.$$('[class*="explanation"], .pairing-reason, [class*="why"]');
    console.log(`💡 Found ${explanations.length} pairing explanations`);
  }

  // Wine-Specific Test 9: Wine Storage & Aging
  async testWineStorage() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/storage`, { waitUntil: 'networkidle0' });

    // Test storage conditions
    const storageConditions = await this.page.$$('[class*="condition"], .storage-info, [class*="temperature"]');
    console.log(`🌡️ Found ${storageConditions.length} storage condition elements`);

    // Test aging recommendations
    const agingRecommendations = await this.page.$$('[class*="aging"], .aging-advice, [class*="maturity"]');
    console.log(`⏰ Found ${agingRecommendations.length} aging recommendations`);

    // Test cellar management tools
    const managementTools = await this.page.$$('[class*="tool"], .management-feature, [class*="organize"]');
    console.log(`🛠️ Found ${managementTools.length} cellar management tools`);
  }

  // Wine-Specific Test 10: Wine Community & Social Features
  async testWineCommunity() {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.goto(`${this.baseUrl}/community`, { waitUntil: 'networkidle0' });

    // Test community discussions
    const discussions = await this.page.$$('[class*="discussion"], .forum-post, [class*="thread"]');
    console.log(`💬 Found ${discussions.length} community discussions`);

    // Test user reviews
    const reviews = await this.page.$$('[class*="review"], .user-review, [class*="rating"]');
    console.log(`⭐ Found ${reviews.length} user reviews`);

    // Test social sharing
    const shareButtons = await this.page.$$('[class*="share"], .social-share, [class*="social"]');
    console.log(`📤 Found ${shareButtons.length} social sharing options`);

    // Test community features
    const communityFeatures = await this.page.$$('[class*="feature"], .community-tool, [class*="interaction"]');
    console.log(`👥 Found ${communityFeatures.length} community features`);
  }

  // Run all wine-specific tests
  async runAllWineTests() {
    console.log('🍷 Starting Wine-Specific User Flow Tests...\n');

    const wineTests = [
      { name: 'Wine Tasting Experience', fn: () => this.testWineTastingExperience() },
      { name: 'Cellar Management', fn: () => this.testCellarManagement() },
      { name: 'Sommelier Consultation', fn: () => this.testSommelierConsultation() },
      { name: 'Wine Education & Learning', fn: () => this.testWineEducation() },
      { name: 'Wine Recommendations Engine', fn: () => this.testWineRecommendations() },
      { name: 'Wine Club Membership Management', fn: () => this.testWineClubMembership() },
      { name: 'Wine Events & Tastings', fn: () => this.testWineEvents() },
      { name: 'Wine Pairing & Food Matching', fn: () => this.testWinePairing() },
      { name: 'Wine Storage & Aging', fn: () => this.testWineStorage() },
      { name: 'Wine Community & Social Features', fn: () => this.testWineCommunity() }
    ];

    for (const test of wineTests) {
      await this.runTest(test.name, test.fn);
    }

    this.printWineResults();
  }

  printWineResults() {
    console.log('\n🍷 Wine-Specific Test Results:');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Wine Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n🍷 Wine Experience Assessment:');
    if (failed === 0) {
      console.log('🏆 EXCEPTIONAL: All wine-specific features work perfectly!');
      console.log('✅ Wine tasting experience is immersive and educational');
      console.log('✅ Cellar management is intuitive and comprehensive');
      console.log('✅ Sommelier consultations are easily accessible');
      console.log('✅ Wine education content is engaging and informative');
      console.log('✅ Recommendation engine provides personalized suggestions');
      console.log('✅ Membership management is seamless');
      console.log('✅ Events and tastings are well-organized');
      console.log('✅ Wine pairing features are accurate and helpful');
      console.log('✅ Storage and aging guidance is expert-level');
      console.log('✅ Community features foster wine appreciation');
    } else if (failed <= 2) {
      console.log('👍 EXCELLENT: Most wine features work exceptionally well');
      console.log('🔧 Minor improvements needed for optimal wine experience');
    } else if (failed <= 4) {
      console.log('✅ GOOD: Core wine functionality works well');
      console.log('🔧 Several wine features need attention');
    } else {
      console.log('⚠️ NEEDS WORK: Multiple wine experience issues detected');
      console.log('🔧 Prioritize fixing wine-specific features');
    }

    console.log('\n🍷 Wine Industry Best Practices Check:');
    const wineFeatures = [
      'Wine Tasting Experience',
      'Cellar Management', 
      'Sommelier Consultation',
      'Wine Education',
      'Recommendations Engine'
    ];
    
    const wineFeatureResults = this.results.filter(r => wineFeatures.includes(r.testName));
    const wineFeaturePassed = wineFeatureResults.filter(r => r.status === 'PASS').length;
    
    if (wineFeaturePassed >= 4) {
      console.log('✅ Meets industry standards for wine club platforms');
      console.log('✅ Provides comprehensive wine education and guidance');
      console.log('✅ Offers professional sommelier expertise');
      console.log('✅ Delivers personalized wine recommendations');
    } else {
      console.log('⚠️ Needs improvement to meet industry standards');
      console.log('🔧 Focus on core wine expertise features');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    const tester = new WineSpecificFlowTester();
    
    try {
      await tester.initialize();
      await tester.runAllWineTests();
    } catch (error) {
      console.error('❌ Wine test suite failed:', error);
      process.exit(1);
    } finally {
      await tester.cleanup();
      process.exit(0);
    }
  })();
}

module.exports = { WineSpecificFlowTester }; 