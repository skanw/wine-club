const puppeteer = require('puppeteer');

async function testNavigation() {
  console.log('🧭 Testing Navigation Links\n');
  
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    page = await browser.newPage();
    
    const navigationTests = [
      { name: 'About Page', path: '/about' },
      { name: 'How It Works Page', path: '/how-it-works' },
      { name: 'Contact Page', path: '/contact' },
      { name: 'Blog Page', path: '/blog' },
      { name: 'Luxury Landing Page', path: '/luxury' },
      { name: 'Pricing Page', path: '/pricing' },
      { name: 'Subscription Page', path: '/subscription' }
    ];
    
    console.log('🔗 Testing Navigation Links:');
    console.log('============================');
    
    for (const test of navigationTests) {
      try {
        await page.goto(`http://localhost:3002${test.path}`, { 
          waitUntil: 'networkidle0',
          timeout: 10000 
        });
        
        const status = await page.evaluate(() => {
          return {
            title: document.title,
            hasContent: document.body.innerText.length > 100
          };
        });
        
        console.log(`✅ ${test.name}: ${status.title} (${status.hasContent ? 'Has Content' : 'No Content'})`);
        
      } catch (error) {
        console.log(`❌ ${test.name}: Failed to load - ${error.message}`);
      }
    }
    
    // Test navbar navigation
    console.log('\n🧭 Testing Navbar Navigation:');
    console.log('=============================');
    
    await page.goto('http://localhost:3002/luxury', { waitUntil: 'networkidle0' });
    
    const navLinks = await page.$$eval('.nav-links a, .nav-actions a', links => 
      links.map(link => ({
        text: link.textContent.trim(),
        href: link.href
      }))
    );
    
    console.log(`Found ${navLinks.length} navigation links:`);
    navLinks.forEach(link => {
      console.log(`  • ${link.text} -> ${link.href.split('/').pop()}`);
    });
    
    // Test mobile navigation
    console.log('\n📱 Testing Mobile Navigation:');
    console.log('=============================');
    
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3002/luxury', { waitUntil: 'networkidle0' });
    
    const mobileMenuButton = await page.$('button[aria-label*="menu"], button[aria-label*="Menu"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mobileLinks = await page.$$eval('nav a', links => 
        links.map(link => link.textContent.trim())
      );
      
      console.log(`Mobile menu has ${mobileLinks.length} links: ${mobileLinks.join(', ')}`);
    } else {
      console.log('Mobile menu button not found');
    }
    
    console.log('\n🎉 Navigation Test Complete!');
    
  } catch (error) {
    console.error('❌ Navigation test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testNavigation().catch(console.error); 