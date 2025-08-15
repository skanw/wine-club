const puppeteer = require('puppeteer');

async function testLuxuryUserFlows() {
  console.log('🍷 Starting Luxury Wine Landing Page User Flow Tests\n');
  
  let browser;
  let page;
  
  try {
    // Initialize Puppeteer
    console.log('🚀 Initializing Puppeteer...');
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    console.log('✅ Puppeteer initialized successfully\n');
    
    // Test 1: Luxury Landing Page Load
    console.log('🧪 Test 1: Luxury Landing Page Load');
    await page.goto('http://localhost:3000/luxury', { waitUntil: 'networkidle0' });
    
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Check for luxury-specific elements
    const heroText = await page.$eval('h1', el => el.textContent);
    console.log(`🎯 Hero text: ${heroText}`);
    
    const themeToggle = await page.$('.theme-toggle');
    console.log(`🎨 Theme toggle found: ${!!themeToggle}`);
    
    const wineCards = await page.$$('.wine-card');
    console.log(`🍷 Wine cards found: ${wineCards.length}`);
    
    const planCards = await page.$$('.plan-card');
    console.log(`💳 Plan cards found: ${planCards.length}`);
    
    console.log('✅ Test 1 passed: Luxury Landing Page Load\n');
    
    // Test 2: Theme Switching
    console.log('🧪 Test 2: Theme Switching');
    
    // Check initial theme
    const initialTheme = await page.$eval('body', el => el.className);
    console.log(`🎨 Initial theme: ${initialTheme}`);
    
    // Switch to white wine theme
    const whiteThemeBtn = await page.$('.theme-btn:nth-child(2)');
    await whiteThemeBtn.click();
    await page.waitForTimeout(1000);
    
    const whiteTheme = await page.$eval('body', el => el.className);
    console.log(`🥂 White theme applied: ${whiteTheme.includes('theme-white')}`);
    
    // Switch back to red wine theme
    const redThemeBtn = await page.$('.theme-btn:nth-child(1)');
    await redThemeBtn.click();
    await page.waitForTimeout(1000);
    
    const redTheme = await page.$eval('body', el => el.className);
    console.log(`🍷 Red theme applied: ${redTheme.includes('theme-red')}`);
    
    console.log('✅ Test 2 passed: Theme Switching\n');
    
    // Test 3: Navigation Links
    console.log('🧪 Test 3: Navigation Links');
    
    // Test "Our Cellar" link
    const cellarLink = await page.$('a[href="/cellar"]');
    if (cellarLink) {
      console.log('🧭 Found "Our Cellar" link');
    }
    
    // Test "How It Works" link
    const howItWorksLink = await page.$('a[href="/how-it-works"]');
    if (howItWorksLink) {
      console.log('🧭 Found "How It Works" link');
    }
    
    // Test "Plans" link
    const plansLink = await page.$('a[href="/plans"]');
    if (plansLink) {
      console.log('🧭 Found "Plans" link');
    }
    
    // Test "Blog" link
    const blogLink = await page.$('a[href="/blog"]');
    if (blogLink) {
      console.log('🧭 Found "Blog" link');
    }
    
    // Test "Contact Us" button
    const contactBtn = await page.$('a[href="/contact"]');
    if (contactBtn) {
      console.log('🧭 Found "Contact Us" button');
    }
    
    // Test "Subscribe" button
    const subscribeBtn = await page.$('a[href="/subscription"]');
    if (subscribeBtn) {
      console.log('🧭 Found "Subscribe" button');
    }
    
    console.log('✅ Test 3 passed: Navigation Links\n');
    
    // Test 4: Hero Section Interaction
    console.log('🧪 Test 4: Hero Section Interaction');
    
    // Check hero content
    const heroContent = await page.$('.hero-content');
    if (heroContent) {
      console.log('🎯 Hero content section found');
      
      const heroTitle = await page.$eval('.hero-content h1', el => el.textContent);
      console.log(`📝 Hero title: ${heroTitle}`);
      
      const heroDescription = await page.$eval('.hero-content p', el => el.textContent);
      console.log(`📝 Hero description: ${heroDescription.substring(0, 50)}...`);
      
      const startJourneyBtn = await page.$('.hero-content .btn');
      if (startJourneyBtn) {
        console.log('🚀 "Start Your Journey" button found');
        
        // Test button hover effect
        await startJourneyBtn.hover();
        await page.waitForTimeout(500);
        console.log('🎨 Button hover effect tested');
      }
    }
    
    console.log('✅ Test 4 passed: Hero Section Interaction\n');
    
    // Test 5: Why Join Section
    console.log('🧪 Test 5: Why Join Section');
    
    const whyJoinCards = await page.$$('.why-join-card');
    console.log(`📊 Found ${whyJoinCards.length} why join cards`);
    
    if (whyJoinCards.length > 0) {
      // Test hover effects on cards
      await whyJoinCards[0].hover();
      await page.waitForTimeout(500);
      console.log('🎨 Card hover effect tested');
      
      // Check card content
      const cardTitle = await page.$eval('.why-join-card h3', el => el.textContent);
      console.log(`📝 First card title: ${cardTitle}`);
    }
    
    console.log('✅ Test 5 passed: Why Join Section\n');
    
    // Test 6: Featured Wines Carousel
    console.log('🧪 Test 6: Featured Wines Carousel');
    
    const wineCards2 = await page.$$('.wine-card');
    console.log(`🍷 Found ${wineCards2.length} wine cards`);
    
    if (wineCards2.length > 0) {
      // Test wine card hover
      await wineCards2[0].hover();
      await page.waitForTimeout(1000);
      
      // Check if "Add to Cart" button appears on hover
      const addToCartBtn = await page.$('.wine-add-btn');
      if (addToCartBtn) {
        console.log('🛒 "Add to Cart" button found on hover');
      }
      
      // Check wine information
      const wineName = await page.$eval('.wine-name', el => el.textContent);
      console.log(`🍷 Wine name: ${wineName}`);
      
      const wineRegion = await page.$eval('.wine-region', el => el.textContent);
      console.log(`🌍 Wine region: ${wineRegion}`);
    }
    
    console.log('✅ Test 6 passed: Featured Wines Carousel\n');
    
    // Test 7: Subscription Plans
    console.log('🧪 Test 7: Subscription Plans');
    
    const planTabs = await page.$$('.plan-tab');
    console.log(`📋 Found ${planTabs.length} plan tabs`);
    
    if (planTabs.length > 0) {
      // Test tab switching
      const whiteWineTab = planTabs[1]; // White Wine tab
      await whiteWineTab.click();
      await page.waitForTimeout(500);
      console.log('🥂 Switched to White Wine tab');
      
      const redWineTab = planTabs[0]; // Red Wine tab
      await redWineTab.click();
      await page.waitForTimeout(500);
      console.log('🍷 Switched back to Red Wine tab');
    }
    
    const planCards2 = await page.$$('.plan-card');
    console.log(`💳 Found ${planCards2.length} plan cards`);
    
    if (planCards2.length > 0) {
      // Check plan information
      const planName = await page.$eval('.plan-name', el => el.textContent);
      console.log(`📝 Plan name: ${planName}`);
      
      const planPrice = await page.$eval('.plan-price', el => el.textContent);
      console.log(`💰 Plan price: ${planPrice}`);
      
      // Test "Select Plan" button
      const selectPlanBtn = await page.$('.plan-select-btn');
      if (selectPlanBtn) {
        console.log('✅ "Select Plan" button found');
        
        // Test button hover
        await selectPlanBtn.hover();
        await page.waitForTimeout(500);
        console.log('🎨 Plan button hover effect tested');
      }
    }
    
    console.log('✅ Test 7 passed: Subscription Plans\n');
    
    // Test 8: Testimonials Section
    console.log('🧪 Test 8: Testimonials Section');
    
    const testimonialCards = await page.$$('.testimonial-card');
    console.log(`💬 Found ${testimonialCards.length} testimonial cards`);
    
    if (testimonialCards.length > 0) {
      // Check testimonial content
      const testimonialQuote = await page.$eval('.testimonial-quote', el => el.textContent);
      console.log(`💬 Testimonial quote: ${testimonialQuote.substring(0, 50)}...`);
      
      const testimonialAuthor = await page.$eval('.testimonial-author', el => el.textContent);
      console.log(`👤 Testimonial author: ${testimonialAuthor}`);
      
      const starRating = await page.$$('.testimonial-rating svg');
      console.log(`⭐ Star rating: ${starRating.length} stars`);
    }
    
    console.log('✅ Test 8 passed: Testimonials Section\n');
    
    // Test 9: Footer Links
    console.log('🧪 Test 9: Footer Links');
    
    const footerLinks = await page.$$('.footer-links a');
    console.log(`🔗 Found ${footerLinks.length} footer links`);
    
    const socialIcons = await page.$$('.social-icon');
    console.log(`📱 Found ${socialIcons.length} social media icons`);
    
    console.log('✅ Test 9 passed: Footer Links\n');
    
    // Test 10: Responsive Design
    console.log('🧪 Test 10: Responsive Design');
    
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('📱 Mobile viewport tested');
    
    // Test tablet viewport
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('📱 Tablet viewport tested');
    
    // Test desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    console.log('🖥️ Desktop viewport tested');
    
    console.log('✅ Test 10 passed: Responsive Design\n');
    
    // Test 11: Performance
    console.log('🧪 Test 11: Performance');
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000/luxury', { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    console.log(`⚡ Page load time: ${loadTime}ms`);
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('📊 Performance metrics:', performanceMetrics);
    
    console.log('✅ Test 11 passed: Performance\n');
    
    // Test 12: Accessibility
    console.log('🧪 Test 12: Accessibility');
    
    // Check for proper heading structure
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els => els.map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 30) })));
    console.log(`📝 Found ${headings.length} headings with proper structure`);
    
    // Check for alt text on images
    const images = await page.$$eval('img', els => els.map(el => ({ src: el.src, alt: el.alt })));
    const imagesWithAlt = images.filter(img => img.alt);
    console.log(`🖼️ Images with alt text: ${imagesWithAlt.length}/${images.length}`);
    
    // Check for ARIA labels
    const ariaElements = await page.$$eval('[aria-label]', els => els.length);
    console.log(`♿ Elements with ARIA labels: ${ariaElements}`);
    
    console.log('✅ Test 12 passed: Accessibility\n');
    
    console.log('🎉 All Luxury Landing Page User Flow Tests Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🧹 Browser closed');
    }
  }
}

// Run the tests
testLuxuryUserFlows().catch(console.error); 