import { test, expect } from '@playwright/test';

test.describe('Minimalist Design Test', () => {
  test('should display clean minimalist design without background images', async ({ page }) => {
    // Navigate to the main landing page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the hero section has a simple gradient background instead of images
    const heroSection = page.locator('section.hero-responsive');
    await expect(heroSection).toBeVisible();
    
    // Verify no background images are present
    const backgroundImages = await page.locator('[style*="background-image"]').count();
    expect(backgroundImages).toBe(0);
    
    // Check that the hero has a simple gradient background
    const heroBackground = page.locator('section.hero-responsive > div:first-child > div:first-child');
    const backgroundStyle = await heroBackground.getAttribute('style');
    expect(backgroundStyle).toContain('linear-gradient');
    expect(backgroundStyle).not.toContain('unsplash');
    
    // Verify clean typography with good contrast
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    const titleColor = await heroTitle.evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toBe('rgb(0, 0, 0)'); // Should be black for good contrast
    
    // Check that the hero card has clean styling
    const heroCard = page.locator('.hero-reveal');
    await expect(heroCard).toBeVisible();
    const cardBackground = await heroCard.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(cardBackground).toContain('rgba(255, 255, 255'); // Should be white/transparent white
  });

  test('should display minimalist wine cards with colored rectangles', async ({ page }) => {
    // Navigate to the minimalist landing page
    await page.goto('http://localhost:3000/minimalist');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that wine cards use colored rectangles instead of images
    const wineCards = page.locator('.wine-card');
    await expect(wineCards.first()).toBeVisible();
    
    // Verify no images in wine cards
    const wineImages = await page.locator('.wine-card img').count();
    expect(wineImages).toBe(0);
    
    // Check that wine cards have colored backgrounds
    const firstWineCard = wineCards.first();
    const wineImageDiv = firstWineCard.locator('div').first();
    const backgroundColor = await wineImageDiv.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have a color
  });

  test('should have simple color scheme throughout', async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page uses simple colors
    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Should be white or very light color
    expect(backgroundColor).toMatch(/rgba\(255, 255, 255|rgb\(255, 255, 255|rgba\(248, 249, 250/);
    
    // Check that text has good contrast
    const mainText = page.locator('h1, h2, h3, p').first();
    const textColor = await mainText.evaluate(el => getComputedStyle(el).color);
    expect(textColor).toMatch(/rgb\(0, 0, 0|rgb\(51, 51, 51|rgb\(102, 102, 102/); // Should be dark colors
  });

  test('should have clean navigation without complex backgrounds', async ({ page }) => {
    // Navigate to the main page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check navigation styling
    const nav = page.locator('nav').first();
    if (await nav.isVisible()) {
      const navBackground = await nav.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(navBackground).toMatch(/rgba\(255, 255, 255|rgb\(255, 255, 255/); // Should be white/transparent
    }
  });

  test('should load quickly without heavy images', async ({ page }) => {
    // Navigate to the main page and measure load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load quickly (under 3 seconds)
    expect(loadTime).toBeLessThan(3000);
    
    // Check that no large images are being loaded
    const imageRequests = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.initiatorType === 'img')
        .filter(entry => entry.transferSize > 100000) // Images larger than 100KB
        .length;
    });
    
    expect(imageRequests).toBe(0); // Should have no large images
  });
}); 