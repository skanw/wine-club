import { test, expect } from '@playwright/test';

test.describe('Modern Design Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should display modern design with enhanced contrast', async ({ page }) => {
    // Test main landing page
    await page.goto('http://localhost:3000');
    
    // Check for modern background patterns instead of mountain images
    const heroSection = await page.locator('.hero');
    await expect(heroSection).toBeVisible();
    
    // Verify no background images are used
    const backgroundImage = await page.locator('.hero').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage;
    });
    
    // Should not contain mountain or vineyard images
    expect(backgroundImage).not.toContain('unsplash');
    expect(backgroundImage).not.toContain('vineyard');
    expect(backgroundImage).not.toContain('mountain');
    
    // Check for modern gradient backgrounds
    expect(backgroundImage).toContain('gradient') || expect(backgroundImage).toContain('linear-gradient');
  });

  test('should have excellent text contrast ratios', async ({ page }) => {
    // Test text contrast on main elements
    const primaryText = await page.locator('h1, h2, h3').first();
    const secondaryText = await page.locator('p').first();
    
    await expect(primaryText).toBeVisible();
    await expect(secondaryText).toBeVisible();
    
    // Check text colors for good contrast
    const primaryColor = await primaryText.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    const secondaryColor = await secondaryText.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    // Verify dark text on light backgrounds or light text on dark backgrounds
    expect(primaryColor).toMatch(/rgb\(0, 0, 0\)|rgb\(26, 26, 26\)|rgb\(255, 255, 255\)/);
    expect(secondaryColor).toMatch(/rgb\(45, 45, 45\)|rgb\(74, 74, 74\)|rgb\(224, 224, 224\)/);
  });

  test('should display modern card designs with enhanced shadows', async ({ page }) => {
    // Test floating cards
    const floatingCards = await page.locator('.floating-card, .why-join-card, .wine-card');
    await expect(floatingCards.first()).toBeVisible();
    
    // Check for modern border radius
    const borderRadius = await floatingCards.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.borderRadius;
    });
    
    expect(borderRadius).toMatch(/16px|20px|24px/);
    
    // Check for enhanced shadows
    const boxShadow = await floatingCards.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.boxShadow;
    });
    
    expect(boxShadow).not.toBe('none');
    expect(boxShadow).toContain('rgba');
  });

  test('should have modern navigation with enhanced visibility', async ({ page }) => {
    // Test navigation elements
    const navLinks = await page.locator('.nav-link, .nav-link-minimal');
    await expect(navLinks.first()).toBeVisible();
    
    // Check for modern hover effects
    await navLinks.first().hover();
    
    // Verify enhanced focus states
    await navLinks.first().focus();
    const outline = await navLinks.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.outline;
    });
    
    expect(outline).not.toBe('none');
  });

  test('should display modern buttons with gradients', async ({ page }) => {
    // Test button designs
    const buttons = await page.locator('.btn, .btn-solid, .plan-select-btn');
    await expect(buttons.first()).toBeVisible();
    
    // Check for modern border radius
    const borderRadius = await buttons.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.borderRadius;
    });
    
    expect(borderRadius).toMatch(/8px|12px|16px/);
    
    // Check for gradient backgrounds
    const background = await buttons.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.background;
    });
    
    expect(background).toContain('gradient') || expect(background).toContain('linear-gradient');
  });

  test('should have modern geometric patterns', async ({ page }) => {
    // Test for pattern overlays
    const sections = await page.locator('.section, .section-minimal, .hero');
    
    for (let i = 0; i < Math.min(3, await sections.count()); i++) {
      const section = sections.nth(i);
      await expect(section).toBeVisible();
      
      // Check for pattern backgrounds
      const background = await section.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.background;
      });
      
      // Should contain patterns or gradients
      expect(background).toContain('gradient') || expect(background).toContain('radial-gradient') || expect(background).toContain('repeating-linear-gradient');
    }
  });

  test('should have enhanced accessibility features', async ({ page }) => {
    // Test focus indicators
    const focusableElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    for (let i = 0; i < Math.min(5, await focusableElements.count()); i++) {
      const element = focusableElements.nth(i);
      await element.focus();
      
      const outline = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.outline;
      });
      
      // Should have visible focus indicators
      expect(outline).not.toBe('none');
    }
    
    // Test color contrast
    const body = await page.locator('body');
    const bodyColor = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    const bodyBackground = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    // Verify good contrast between text and background
    expect(bodyColor).not.toBe(bodyBackground);
  });

  test('should have modern responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that elements are still visible and properly sized
    const heroContent = await page.locator('.hero-content, .typing-container');
    await expect(heroContent.first()).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heroContent.first()).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(heroContent.first()).toBeVisible();
  });

  test('should have smooth animations and transitions', async ({ page }) => {
    // Test hover animations on cards
    const cards = await page.locator('.floating-card, .wine-card, .plan-card');
    const firstCard = cards.first();
    
    await expect(firstCard).toBeVisible();
    
    // Get initial transform
    const initialTransform = await firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    
    // Hover and check for transform change
    await firstCard.hover();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    const hoverTransform = await firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    
    // Should have some transform change on hover
    expect(hoverTransform).not.toBe(initialTransform);
  });

  test('should have modern typography with proper scaling', async ({ page }) => {
    // Test responsive typography
    const headings = await page.locator('h1, h2, h3');
    
    for (let i = 0; i < Math.min(3, await headings.count()); i++) {
      const heading = headings.nth(i);
      await expect(heading).toBeVisible();
      
      const fontSize = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.fontSize;
      });
      
      // Should have reasonable font sizes
      const size = parseFloat(fontSize);
      expect(size).toBeGreaterThan(12);
      expect(size).toBeLessThan(100);
    }
  });

  test('should have modern color scheme with proper contrast', async ({ page }) => {
    // Test color variables are properly applied
    const root = await page.locator(':root');
    
    // Check for CSS custom properties
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        bgBase: computedStyle.getPropertyValue('--bg-base'),
        textPrimary: computedStyle.getPropertyValue('--text-primary'),
        accentPrimary: computedStyle.getPropertyValue('--accent-primary')
      };
    });
    
    // Verify color variables are defined
    expect(cssVars.bgBase).not.toBe('');
    expect(cssVars.textPrimary).not.toBe('');
    expect(cssVars.accentPrimary).not.toBe('');
  });

  test('should have modern footer with enhanced design', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = await page.locator('.footer, .footer-minimal');
    await expect(footer).toBeVisible();
    
    // Check for modern footer design
    const footerBackground = await footer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.background;
    });
    
    // Should have modern background
    expect(footerBackground).not.toBe('rgba(0, 0, 0, 0)');
    
    // Check for social icons
    const socialIcons = await page.locator('.social-icon');
    if (await socialIcons.count() > 0) {
      await expect(socialIcons.first()).toBeVisible();
      
      // Check for modern icon design
      const iconBorderRadius = await socialIcons.first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderRadius;
      });
      
      expect(iconBorderRadius).toMatch(/8px|12px|50%/);
    }
  });

  test('should have proper theme switching functionality', async ({ page }) => {
    // Test theme toggle if available
    const themeToggle = await page.locator('.theme-toggle, .theme-toggle-minimal');
    
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
      
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      });
      
      // Click theme toggle
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(500);
      
      // Check if theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      });
      
      // Theme should have changed
      expect(newTheme).not.toBe(initialTheme);
    }
  });
}); 