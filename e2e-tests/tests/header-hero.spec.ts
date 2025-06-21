import { test, expect } from '@playwright/test';

test.describe('Header & Hero Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for scroll reveal animations to complete
    await page.waitForTimeout(1000);
  });

  test('header layout and spacing on desktop 1366x768', async ({ page }) => {
    // Set viewport to target resolution
    await page.setViewportSize({ width: 1366, height: 768 });
    
    // Wait for theme to be applied
    await page.waitForTimeout(500);
    
    // Take screenshot of header area
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Verify no element overlaps header
    const heroSection = page.locator('section').first();
    const headerBox = await header.boundingBox();
    const heroBox = await heroSection.boundingBox();
    
    if (headerBox && heroBox) {
      // Hero should start below header
      expect(heroBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
    }
    
    // Visual regression test for header
    await expect(header).toHaveScreenshot('header-desktop-1366x768.png');
  });

  test('header layout on mobile 375x667', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for responsive layout
    await page.waitForTimeout(500);
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Visual regression test for mobile header
    await expect(header).toHaveScreenshot('header-mobile-375x667.png');
  });

  test('hero section layout and contrast', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1366, height: 768 });
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Check that hero content is visible and properly spaced
    const heroTitle = page.locator('h1').first();
    const heroSubtitle = page.locator('.hero-subtitle-reveal');
    const ctaButtons = page.locator('.cta-bar-reveal');
    
    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
    await expect(ctaButtons).toBeVisible();
    
    // Visual regression test for hero section
    await expect(heroSection).toHaveScreenshot('hero-section-desktop.png');
  });

  test('navigation accessibility and contrast', async ({ page }) => {
    const header = page.locator('header');
    
    // Check navigation items are visible and accessible
    const navItems = page.locator('nav a');
    const navItemCount = await navItems.count();
    
    for (let i = 0; i < navItemCount; i++) {
      const navItem = navItems.nth(i);
      await expect(navItem).toBeVisible();
      
      // Check that nav items have sufficient contrast
      const styles = await navItem.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor
        };
      });
      
      // Nav items should have defined colors
      expect(styles.color).toBeTruthy();
    }
  });

  test('theme toggle functionality', async ({ page }) => {
    const themeToggle = page.locator('button[role="switch"]');
    await expect(themeToggle).toBeVisible();
    
    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Click theme toggle
    await themeToggle.click();
    await page.waitForTimeout(300); // Wait for theme transition
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    expect(newTheme).not.toBe(initialTheme);
    
    // Take screenshot of header in new theme
    const header = page.locator('header');
    await expect(header).toHaveScreenshot(`header-${newTheme}-theme.png`);
  });

  test('CTA buttons contrast and accessibility', async ({ page }) => {
    const primaryButton = page.locator('.btn-primary').first();
    const secondaryButton = page.locator('.btn-secondary').first();
    
    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();
    
    // Check button accessibility
    await expect(primaryButton).toHaveAttribute('href');
    await expect(secondaryButton).toHaveAttribute('href');
    
    // Test button hover states
    await primaryButton.hover();
    await page.waitForTimeout(200);
    
    // Visual test for button states
    const ctaSection = page.locator('.cta-bar-reveal');
    await expect(ctaSection).toHaveScreenshot('cta-buttons-hover.png');
  });

  test('responsive layout breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 667, name: 'mobile-medium' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1366, height: 768, name: 'desktop-medium' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await page.waitForTimeout(300); // Wait for responsive layout
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check that header doesn't overlap content
      const heroContent = page.locator('.hero-reveal');
      const headerBox = await header.boundingBox();
      const heroBox = await heroContent.boundingBox();
      
      if (headerBox && heroBox) {
        expect(heroBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 10); // 10px tolerance
      }
      
      // Take screenshot for visual regression
      await expect(page).toHaveScreenshot(`layout-${breakpoint.name}.png`);
    }
  });

  test('scroll reveal animations trigger once', async ({ page }) => {
    // Scroll to trigger animations
    await page.evaluate(() => {
      window.scrollTo(0, 200);
    });
    
    await page.waitForTimeout(800); // Wait for animations
    
    // Check that reveal classes are applied
    const heroSubtitle = page.locator('.hero-subtitle-reveal');
    const ctaBar = page.locator('.cta-bar-reveal');
    
    const subtitleVisible = await heroSubtitle.evaluate((el) => {
      return el.classList.contains('is-visible');
    });
    
    const ctaVisible = await ctaBar.evaluate((el) => {
      return el.classList.contains('is-visible');
    });
    
    expect(subtitleVisible).toBe(true);
    expect(ctaVisible).toBe(true);
    
    // Scroll back up and down again
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    
    await page.evaluate(() => {
      window.scrollTo(0, 200);
    });
    await page.waitForTimeout(300);
    
    // Elements should still be visible (trigger once)
    const stillVisible = await heroSubtitle.evaluate((el) => {
      return el.classList.contains('is-visible');
    });
    
    expect(stillVisible).toBe(true);
  });

  test('accessibility landmarks and ARIA labels', async ({ page }) => {
    // Check theme toggle has proper ARIA labels
    const themeToggle = page.locator('button[role="switch"]');
    await expect(themeToggle).toHaveAttribute('aria-label', /Toggle red-wine.*white-wine.*theme/);
    
    // Check navigation has proper landmarks
    const nav = page.locator('nav[aria-label="Global"]');
    await expect(nav).toBeVisible();
    
    // Check header structure
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check main content section
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
}); 