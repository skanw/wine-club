import { test, expect } from '@playwright/test';

test.describe('Scroll-Spy Navbar Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to subscription page
    await page.goto('/subscription');
    await page.waitForLoadState('networkidle');
  });

  test('should highlight correct section on scroll', async ({ page }) => {
    // Wait for navbar to appear
    await page.waitForSelector('.scroll-spy-navbar', { state: 'visible' });
    
    // Initially should be on hero section
    const heroLink = page.locator('.navbar-link[href="#hero"]');
    await expect(heroLink).toHaveClass(/active/);

    // Scroll to why-join section
    await page.locator('#why-join').scrollIntoView();
    await page.waitForTimeout(500); // Wait for intersection observer
    
    const whyJoinLink = page.locator('.navbar-link[href="#why-join"]');
    await expect(whyJoinLink).toHaveClass(/active/);
    await expect(heroLink).not.toHaveClass(/active/);

    // Scroll to bottles section
    await page.locator('#bottles').scrollIntoView();
    await page.waitForTimeout(500);
    
    const bottlesLink = page.locator('.navbar-link[href="#bottles"]');
    await expect(bottlesLink).toHaveClass(/active/);
    await expect(whyJoinLink).not.toHaveClass(/active/);

    // Scroll to plans section
    await page.locator('#plans').scrollIntoView();
    await page.waitForTimeout(500);
    
    const plansLink = page.locator('.navbar-link[href="#plans"]');
    await expect(plansLink).toHaveClass(/active/);
    await expect(bottlesLink).not.toHaveClass(/active/);
  });

  test('should navigate to section on navbar click', async ({ page }) => {
    await page.waitForSelector('.scroll-spy-navbar', { state: 'visible' });
    
    // Click on Why Join link
    const whyJoinLink = page.locator('.navbar-link[href="#why-join"]');
    await whyJoinLink.click();
    
    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);
    
    // Check if section is in view
    const whyJoinSection = page.locator('#why-join');
    await expect(whyJoinSection).toBeInViewport();
    
    // Check if link becomes active
    await expect(whyJoinLink).toHaveClass(/active/);
  });

  test('should show/hide navbar based on scroll position', async ({ page }) => {
    await page.waitForSelector('.scroll-spy-navbar');
    
    const navbar = page.locator('.scroll-spy-navbar');
    
    // Initially navbar should be hidden (not sticky)
    await expect(navbar).not.toHaveClass(/sticky/);
    
    // Scroll down to trigger sticky behavior
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    
    // Navbar should now be sticky
    await expect(navbar).toHaveClass(/sticky/);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    
    // Navbar should hide again
    await expect(navbar).not.toHaveClass(/sticky/);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.waitForSelector('.scroll-spy-navbar', { state: 'visible' });
    
    const navbar = page.locator('.scroll-spy-navbar');
    await expect(navbar).toHaveAttribute('role', 'navigation');
    await expect(navbar).toHaveAttribute('aria-label', 'Page sections');
    
    // Check active link has aria-current
    const activeLink = page.locator('.navbar-link.active');
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
    
    // Check inactive links don't have aria-current
    const inactiveLinks = page.locator('.navbar-link:not(.active)');
    const count = await inactiveLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = inactiveLinks.nth(i);
      await expect(link).not.toHaveAttribute('aria-current');
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.waitForSelector('.scroll-spy-navbar', { state: 'visible' });
    
    // Focus on first navbar link
    const firstLink = page.locator('.navbar-link').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
    
    // Tab through all navbar links
    const navbarLinks = page.locator('.navbar-link');
    const linkCount = await navbarLinks.count();
    
    for (let i = 1; i < linkCount; i++) {
      await page.keyboard.press('Tab');
      await expect(navbarLinks.nth(i)).toBeFocused();
    }
    
    // Press Enter on focused link
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // Should navigate to corresponding section
    const lastLink = navbarLinks.nth(linkCount - 1);
    const href = await lastLink.getAttribute('href');
    const targetSection = page.locator(href!);
    await expect(targetSection).toBeInViewport();
  });

  test('should have ripple effect on click', async ({ page }) => {
    await page.waitForSelector('.scroll-spy-navbar', { state: 'visible' });
    
    const link = page.locator('.navbar-link').first();
    
    // Click and check for ripple effect
    await link.click();
    
    // Check if ripple element was created
    const ripple = page.locator('.ripple-effect');
    await expect(ripple).toBeVisible();
    
    // Ripple should disappear after animation
    await page.waitForTimeout(700);
    await expect(ripple).not.toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('should meet performance benchmarks', async ({ page }) => {
    // Start performance measurement
    await page.goto('/subscription');
    
    // Measure Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: Record<string, number> = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              metrics.tti = navEntry.loadEventEnd - navEntry.navigationStart;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['paint', 'navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // Check FCP (First Contentful Paint) ≤ 1.5s
    if (performanceMetrics.fcp) {
      expect(performanceMetrics.fcp).toBeLessThanOrEqual(1500);
    }
    
    // Check TTI (Time to Interactive) ≤ 2s  
    if (performanceMetrics.tti) {
      expect(performanceMetrics.tti).toBeLessThanOrEqual(2000);
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/subscription');
    
    // Check that animations are disabled
    const animatedElement = page.locator('.fade-in');
    const computedStyle = await animatedElement.evaluate((el) => {
      return window.getComputedStyle(el).animation;
    });
    
    expect(computedStyle).toBe('none');
  });
});

test.describe('Accessibility Tests', () => {
  test('should pass axe accessibility audit', async ({ page }) => {
    await page.goto('/subscription');
    await page.waitForLoadState('networkidle');
    
    // Inject axe-core
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
    });
    
    // Run axe accessibility audit
    const accessibilityResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        (window as any).axe.run(document, {
          rules: {
            'color-contrast': { enabled: true },
            'keyboard-navigation': { enabled: true },
            'focus-management': { enabled: true },
            'aria-attributes': { enabled: true }
          }
        }, (err: any, results: any) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });
    
    // Check for critical violations
    const criticalViolations = (accessibilityResults as any).violations.filter(
      (violation: any) => violation.impact === 'critical'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/subscription');
    
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    expect(headingCount).toBeGreaterThan(0);
    
    // Check first heading is h1
    const firstHeading = headings.first();
    const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should work with keyboard navigation only', async ({ page }) => {
    await page.goto('/subscription');
    
    // Start keyboard navigation from the beginning
    await page.keyboard.press('Tab');
    
    // Should be able to reach all interactive elements
    const interactiveElements = page.locator('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const elementCount = await interactiveElements.count();
    
    let tabCount = 0;
    let currentElement = await page.evaluate(() => document.activeElement?.tagName);
    
    while (currentElement && tabCount < elementCount + 5) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const newElement = await page.evaluate(() => document.activeElement?.tagName);
      if (newElement !== currentElement) {
        currentElement = newElement;
      }
    }
    
    // Should have found interactive elements
    expect(tabCount).toBeGreaterThan(0);
  });
});

export {}; 