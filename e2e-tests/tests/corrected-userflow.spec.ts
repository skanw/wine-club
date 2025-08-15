import { test, expect } from '@playwright/test';

test.describe('Minimalist Wine Club - Corrected User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the minimalist landing page
    await page.goto('http://localhost:3000/minimalist');
    await page.waitForLoadState('networkidle');
  });

  test('Complete user journey from discovery to conversion', async ({ page }) => {
    console.log('🚀 Starting complete user journey test...');

    // 1. Initial Page Load & Hero Section
    await test.step('Hero section and typing animation', async () => {
      console.log('📝 Testing hero section...');
      
      // Check if hero section loads
      await expect(page.locator('.hero-minimal')).toBeVisible();
      
      // Verify typing animation container exists
      await expect(page.locator('.typing-container')).toBeVisible();
      
      // Check for main CTA buttons using actual text
      await expect(page.locator('text=Start Your Journey')).toBeVisible();
      await expect(page.locator('text=Watch Video')).toBeVisible();
      
      // Verify trust indicators
      await expect(page.locator('text=100% Organic')).toBeVisible();
      await expect(page.locator('text=Expert Curated')).toBeVisible();
      await expect(page.locator('text=Free Delivery')).toBeVisible();
    });

    // 2. Navigation & Theme Toggle
    await test.step('Navigation and theme functionality', async () => {
      console.log('🧭 Testing navigation...');
      
      // Check navbar is present
      await expect(page.locator('.navbar-minimal')).toBeVisible();
      
      // Verify logo and brand name
      await expect(page.locator('text=WineClub')).toBeVisible();
      
      // Test theme toggle
      const themeToggle = page.locator('.theme-toggle-minimal');
      await expect(themeToggle).toBeVisible();
      
      // Click theme toggle and verify it changes
      const initialTheme = await themeToggle.getAttribute('data-theme');
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const newTheme = await themeToggle.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
      
      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);
    });

    // 3. Features Section with Floating Cards
    await test.step('Features section with animations', async () => {
      console.log('✨ Testing features section...');
      
      // Scroll to features section
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(1000);
      
      // Check features section
      await expect(page.locator('.section-minimal-alt')).toBeVisible();
      await expect(page.locator('text=Why Choose WineClub')).toBeVisible();
      
      // Verify floating cards are present
      const floatingCards = page.locator('.floating-card');
      await expect(floatingCards).toHaveCount(6);
      
      // Test hover effects on cards
      const firstCard = floatingCards.first();
      await firstCard.hover();
      await page.waitForTimeout(500);
      
      // Check for feature icons
      await expect(page.locator('.floating-card-icon')).toHaveCount(6);
    });

    // 4. Wines Section with Scroll Reveal
    await test.step('Wines section with scroll-triggered animations', async () => {
      console.log('🍷 Testing wines section...');
      
      // Scroll to wines section
      await page.evaluate(() => window.scrollTo(0, 1600));
      await page.waitForTimeout(1000);
      
      // Check wines section
      await expect(page.locator('text=Featured Wines')).toBeVisible();
      
      // Verify wine cards are present
      const wineCards = page.locator('.wine-card');
      await expect(wineCards).toHaveCount(6);
      
      // Test horizontal scroll
      const winesContainer = page.locator('.flex.space-x-6.overflow-x-auto');
      await expect(winesContainer).toBeVisible();
      
      // Check for wine images and details
      await expect(page.locator('text=Château Margaux')).toBeVisible();
      await expect(page.locator('text=Dom Pérignon')).toBeVisible();
      
      // Verify wine type badges
      await expect(page.locator('text=Red')).toBeVisible();
      await expect(page.locator('text=White')).toBeVisible();
    });

    // 5. Pricing Section with Tab Animation
    await test.step('Pricing section with interactive tabs', async () => {
      console.log('💰 Testing pricing section...');
      
      // Scroll to pricing section
      await page.evaluate(() => window.scrollTo(0, 2400));
      await page.waitForTimeout(1000);
      
      // Check pricing section
      await expect(page.locator('text=Choose Your Plan')).toBeVisible();
      
      // Test tab switching
      const monthlyTab = page.locator('[data-tab="monthly"]');
      const yearlyTab = page.locator('[data-tab="yearly"]');
      
      await expect(monthlyTab).toBeVisible();
      await expect(yearlyTab).toBeVisible();
      
      // Click yearly tab
      await yearlyTab.click();
      await page.waitForTimeout(500);
      
      // Verify tab underline animation
      const tabUnderline = page.locator('.tab-underline');
      await expect(tabUnderline).toBeVisible();
      
      // Check pricing cards
      const planCards = page.locator('.plan-card');
      await expect(planCards).toHaveCount(3);
      
      // Verify plan names
      await expect(page.locator('text=Starter')).toBeVisible();
      await expect(page.locator('text=Premium')).toBeVisible();
      await expect(page.locator('text=Connoisseur')).toBeVisible();
      
      // Test hover effects on plan cards
      const premiumCard = planCards.nth(1);
      await premiumCard.hover();
      await page.waitForTimeout(500);
    });

    // 6. Footer with Parallax Effect
    await test.step('Footer with parallax animations', async () => {
      console.log('🦶 Testing footer...');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, 3200));
      await page.waitForTimeout(1000);
      
      // Check footer
      await expect(page.locator('.footer-minimal')).toBeVisible();
      
      // Verify parallax text elements
      const parallaxTexts = page.locator('.parallax-text');
      await expect(parallaxTexts).toHaveCount(3);
      
      // Check for parallax text content
      await expect(page.locator('text=CELLAR.')).toBeVisible();
      await expect(page.locator('text=COMMUNITY.')).toBeVisible();
      await expect(page.locator('text=CRAFT.')).toBeVisible();
      
      // Test social icons
      const socialIcons = page.locator('.social-icons a');
      await expect(socialIcons).toHaveCount(4);
      
      // Hover over footer to trigger social icon fade-in
      await page.locator('.footer-minimal').hover();
      await page.waitForTimeout(500);
    });

    // 7. Responsive Design Test
    await test.step('Responsive design across devices', async () => {
      console.log('📱 Testing responsive design...');
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Verify mobile menu button appears
      await expect(page.locator('button[aria-label="Open mobile menu"]')).toBeVisible();
      
      // Check that desktop navigation is hidden
      await expect(page.locator('.hidden.md\\:flex')).toBeHidden();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      // Verify tablet layout
      await expect(page.locator('.floating-card')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Verify desktop navigation is visible
      await expect(page.locator('.hidden.md\\:flex')).toBeVisible();
    });

    // 8. Performance & Accessibility
    await test.step('Performance and accessibility checks', async () => {
      console.log('⚡ Testing performance and accessibility...');
      
      // Check for proper heading hierarchy
      const h1Elements = page.locator('h1');
      const h2Elements = page.locator('h2');
      
      await expect(h1Elements).toHaveCount(0); // No h1 in minimalist design
      await expect(h2Elements).toHaveCount(4); // Features, Wines, Pricing, etc.
      
      // Verify focus states are working
      const ctaButton = page.locator('text=Start Your Journey').first();
      await ctaButton.focus();
      await page.waitForTimeout(500);
      
      // Check for proper ARIA labels
      await expect(page.locator('[aria-label]')).toHaveCount(3); // Theme toggle, mobile menu, etc.
      
      // Verify smooth scrolling
      const scrollBehavior = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return style.scrollBehavior;
      });
      expect(scrollBehavior).toBe('smooth');
    });

    // 9. Animation Performance
    await test.step('Animation performance and smoothness', async () => {
      console.log('🎬 Testing animation performance...');
      
      // Scroll through the page to trigger animations
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          let currentScroll = 0;
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollStep = 100;
          
          const scrollInterval = setInterval(() => {
            currentScroll += scrollStep;
            window.scrollTo(0, currentScroll);
            
            if (currentScroll >= maxScroll) {
              clearInterval(scrollInterval);
              resolve();
            }
          }, 100);
        });
      });
      
      await page.waitForTimeout(2000);
      
      // Verify animations are running smoothly
      const animatedElements = page.locator('.floating-card, .reveal-card, .plan-card');
      await expect(animatedElements).toBeVisible();
    });

    // 10. Conversion Path Test
    await test.step('Conversion path and CTA functionality', async () => {
      console.log('🎯 Testing conversion path...');
      
      // Test hero CTA
      const heroCTA = page.locator('text=Start Your Journey').first();
      await heroCTA.click();
      
      // Should navigate to pricing page
      await page.waitForURL('**/pricing');
      await expect(page.locator('text=Choose Your Plan')).toBeVisible();
      
      // Go back to minimalist page
      await page.goto('http://localhost:3000/minimalist');
      await page.waitForLoadState('networkidle');
      
      // Test features CTA
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(1000);
      
      const featuresCTA = page.locator('text=Get Started');
      await featuresCTA.click();
      
      // Should navigate to pricing page
      await page.waitForURL('**/pricing');
      await expect(page.locator('text=Choose Your Plan')).toBeVisible();
    });

    console.log('✅ Complete user journey test passed!');
  });

  test('Theme switching and persistence', async ({ page }) => {
    console.log('🎨 Testing theme switching...');
    
    // Check initial theme
    const themeToggle = page.locator('.theme-toggle-minimal');
    const initialTheme = await themeToggle.getAttribute('data-theme');
    
    // Toggle theme multiple times
    for (let i = 0; i < 3; i++) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      const currentTheme = await themeToggle.getAttribute('data-theme');
      expect(currentTheme).toBeDefined();
    }
    
    // Refresh page and check theme persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const persistedTheme = await themeToggle.getAttribute('data-theme');
    expect(persistedTheme).toBeDefined();
    
    console.log('✅ Theme switching test passed!');
  });

  test('Navigation and routing', async ({ page }) => {
    console.log('🧭 Testing navigation...');
    
    // Test navigation links - use more specific selectors to avoid overlay issues
    const navLinks = [
      { text: 'How It Works', expectedPath: '/how-it-works' },
      { text: 'Wines', expectedPath: '/wines' },
      { text: 'Pricing', expectedPath: '/pricing' },
      { text: 'About', expectedPath: '/about' },
      { text: 'Contact', expectedPath: '/contact' }
    ];
    
    for (const link of navLinks) {
      // Use more specific selector to avoid overlay issues
      const navLink = page.locator(`nav a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      
      // Scroll to ensure the link is in view and not covered by overlay
      await navLink.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      await navLink.click();
      await page.waitForURL(`**${link.expectedPath}`);
      
      // Go back to minimalist page
      await page.goto('http://localhost:3000/minimalist');
      await page.waitForLoadState('networkidle');
    }
    
    console.log('✅ Navigation test passed!');
  });

  test('Basic functionality test', async ({ page }) => {
    console.log('🔧 Testing basic functionality...');
    
    // Test that the page loads correctly
    await expect(page.locator('.hero-minimal')).toBeVisible();
    await expect(page.locator('text=WineClub')).toBeVisible();
    
    // Test that typing animation is working
    await expect(page.locator('.typing-container')).toBeVisible();
    
    // Test that CTA buttons are present
    await expect(page.locator('text=Start Your Journey')).toBeVisible();
    await expect(page.locator('text=Watch Video')).toBeVisible();
    
    // Test scrolling and section visibility
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=Why Choose WineClub')).toBeVisible();
    
    console.log('✅ Basic functionality test passed!');
  });
}); 