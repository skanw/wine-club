import { test, expect } from '@playwright/test';

test.describe('Simple Modern Design Test', () => {
  test('should load modern design without mountain backgrounds', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for basic content to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check that the page loads successfully
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for modern design elements
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Verify no mountain/vineyard background images
    const backgroundImages = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const backgrounds = [];
      
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none' && 
            (bgImage.includes('unsplash') || bgImage.includes('vineyard') || bgImage.includes('mountain'))) {
          backgrounds.push(bgImage);
        }
      }
      
      return backgrounds;
    });
    
    // Should not have mountain/vineyard backgrounds
    expect(backgroundImages.length).toBe(0);
    
    // Check for modern CSS variables
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        bgBase: computedStyle.getPropertyValue('--bg-base'),
        textPrimary: computedStyle.getPropertyValue('--text-primary'),
        accentPrimary: computedStyle.getPropertyValue('--accent-primary'),
        shadowMedium: computedStyle.getPropertyValue('--shadow-medium'),
        gradientPrimary: computedStyle.getPropertyValue('--gradient-primary')
      };
    });
    
    // Verify modern CSS variables are present
    expect(cssVars.bgBase).toBeTruthy();
    expect(cssVars.textPrimary).toBeTruthy();
    expect(cssVars.accentPrimary).toBeTruthy();
    
    // Check for modern patterns or gradients
    const hasModernBackgrounds = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const bg = style.background || style.backgroundImage;
        
        if (bg && bg !== 'none' && 
            (bg.includes('gradient') || bg.includes('radial-gradient') || bg.includes('repeating-linear-gradient'))) {
          return true;
        }
      }
      
      return false;
    });
    
    // Should have modern gradient/pattern backgrounds
    expect(hasModernBackgrounds).toBe(true);
  });

  test('should have enhanced contrast and modern styling', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for modern card designs
    const cards = await page.locator('.floating-card, .wine-card, .plan-card, .why-join-card, .testimonial-card');
    
    if (await cards.count() > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();
      
      // Check for modern border radius
      const borderRadius = await firstCard.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderRadius;
      });
      
      // Should have modern rounded corners
      expect(borderRadius).toMatch(/12px|16px|20px|24px/);
      
      // Check for enhanced shadows
      const boxShadow = await firstCard.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.boxShadow;
      });
      
      // Should have shadows
      expect(boxShadow).not.toBe('none');
    }
    
    // Check for modern buttons
    const buttons = await page.locator('.btn, .btn-solid, .plan-select-btn, .wine-add-btn');
    
    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Check for modern border radius on buttons
      const buttonBorderRadius = await firstButton.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderRadius;
      });
      
      expect(buttonBorderRadius).toMatch(/6px|8px|12px/);
    }
  });

  test('should have responsive typography and spacing', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for responsive headings
    const headings = await page.locator('h1, h2, h3');
    
    if (await headings.count() > 0) {
      const firstHeading = headings.first();
      await expect(firstHeading).toBeVisible();
      
      // Check font size is reasonable
      const fontSize = await firstHeading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.fontSize;
      });
      
      const size = parseFloat(fontSize);
      expect(size).toBeGreaterThan(12);
      expect(size).toBeLessThan(100);
    }
    
    // Check for modern spacing
    const sections = await page.locator('.section, .section-minimal, .hero');
    
    if (await sections.count() > 0) {
      const firstSection = sections.first();
      await expect(firstSection).toBeVisible();
      
      // Check for generous padding
      const padding = await firstSection.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.padding;
      });
      
      // Should have substantial padding
      expect(padding).not.toBe('0px');
    }
  });

  test('should have modern color scheme', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check body background
    const bodyBackground = await page.locator('body').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    // Should have a defined background color
    expect(bodyBackground).not.toBe('rgba(0, 0, 0, 0)');
    
    // Check text color
    const bodyColor = await page.locator('body').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    // Should have defined text color
    expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');
    
    // Verify good contrast between text and background
    expect(bodyColor).not.toBe(bodyBackground);
    
    // Check for accent colors
    const accentElements = await page.locator('[style*="color"], .btn, .accent');
    
    if (await accentElements.count() > 0) {
      const firstAccent = accentElements.first();
      const accentColor = await firstAccent.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.color || style.backgroundColor;
      });
      
      // Should have accent colors
      expect(accentColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should have modern navigation and layout', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check for navigation
    const nav = await page.locator('nav, .nav-main, .navbar-minimal');
    
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
      
      // Check for modern backdrop blur
      const backdropFilter = await nav.first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.backdropFilter;
      });
      
      // Should have backdrop blur or be transparent initially
      expect(backdropFilter).toMatch(/blur|none/);
    }
    
    // Check for modern layout structure
    const mainContent = await page.locator('main, .hero, .section');
    
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
      
      // Check for modern positioning
      const position = await mainContent.first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.position;
      });
      
      // Should have proper positioning
      expect(position).toMatch(/relative|absolute|static/);
    }
  });
}); 