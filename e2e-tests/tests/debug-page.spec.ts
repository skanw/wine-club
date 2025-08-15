import { test, expect } from '@playwright/test';

test('Debug minimalist page content', async ({ page }) => {
  console.log('🔍 Debugging minimalist page content...');
  
  // Navigate to the minimalist landing page
  await page.goto('http://localhost:3000/minimalist');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-minimalist-page.png', fullPage: true });
  
  // Get all text content on the page
  const pageText = await page.textContent('body');
  console.log('Page text content:', pageText?.substring(0, 1000));
  
  // Check if hero section exists
  const heroExists = await page.locator('.hero-minimal').isVisible();
  console.log('Hero section visible:', heroExists);
  
  // Check if typing container exists
  const typingExists = await page.locator('.typing-container').isVisible();
  console.log('Typing container visible:', typingExists);
  
  // Get all buttons on the page
  const buttons = await page.locator('button, a[href]').allTextContents();
  console.log('All buttons/links:', buttons);
  
  // Get all text content in hero section
  const heroText = await page.locator('.hero-minimal').textContent();
  console.log('Hero section text:', heroText);
  
  // Check for any elements with "Start" or "Journey" text
  const startElements = await page.locator('*:has-text("Start")').count();
  const journeyElements = await page.locator('*:has-text("Journey")').count();
  console.log('Elements with "Start":', startElements);
  console.log('Elements with "Journey":', journeyElements);
  
  // Check if translations are loaded
  const translationKeys = await page.evaluate(() => {
    // Check if i18next is available
    if ((window as any).i18next) {
      return (window as any).i18next.t('hero.cta.primary');
    }
    return 'i18next not available';
  });
  console.log('Translation test:', translationKeys);
  
  // Basic assertions that should work
  await expect(page.locator('.hero-minimal')).toBeVisible();
  await expect(page.locator('text=WineClub')).toBeVisible();
  
  console.log('✅ Debug test completed!');
}); 