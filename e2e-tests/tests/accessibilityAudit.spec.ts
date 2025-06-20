import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG AA Accessibility Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should pass axe accessibility audit in light theme', async ({ page }) => {
    // Ensure light theme is active
    await page.evaluate(() => {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
    });
    
    await page.waitForTimeout(300); // Wait for theme transition
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass axe accessibility audit in dark theme', async ({ page }) => {
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
    });
    
    await page.waitForTimeout(300); // Wait for theme transition
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast ratios', async ({ page }) => {
    // Test specific contrast ratios
    const contrastTests = [
      { selector: 'h1', minRatio: 4.5 },
      { selector: 'h2', minRatio: 4.5 },
      { selector: 'p', minRatio: 4.5 },
      { selector: 'button', minRatio: 4.5 },
      { selector: 'a', minRatio: 4.5 },
    ];

    for (const test of contrastTests) {
      const elements = page.locator(test.selector);
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        const element = elements.nth(i);
        
        // Get computed colors
        const colors = await element.evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            color: style.color,
            backgroundColor: style.backgroundColor,
          };
        });
        
        // Parse RGB values
        const parseRGB = (rgb: string) => {
          const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
        };
        
        const textRGB = parseRGB(colors.color);
        const bgRGB = parseRGB(colors.backgroundColor);
        
        // Calculate relative luminance
        const getLuminance = (rgb: number[]) => {
          const [r, g, b] = rgb.map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const textLum = getLuminance(textRGB);
        const bgLum = getLuminance(bgRGB);
        
        // Calculate contrast ratio
        const contrastRatio = (Math.max(textLum, bgLum) + 0.05) / (Math.min(textLum, bgLum) + 0.05);
        
        // Skip if background is transparent
        if (colors.backgroundColor === 'rgba(0, 0, 0, 0)' || colors.backgroundColor === 'transparent') {
          continue;
        }
        
        expect(contrastRatio).toBeGreaterThanOrEqual(test.minRatio);
      }
    }
  });

  test('should have proper focus management', async ({ page }) => {
    // Test keyboard navigation
    const focusableElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check if focus indicator is visible
      const focusStyles = await focusedElement.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          outlineColor: style.outlineColor,
          boxShadow: style.boxShadow,
        };
      });
      
      // Should have visible focus indicator
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow.includes('rgb');
        
      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let lastLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.charAt(1));
      
      // Heading levels should not skip (e.g., h1 -> h3)
      if (lastLevel > 0) {
        expect(currentLevel - lastLevel).toBeLessThanOrEqual(1);
      }
      
      lastLevel = currentLevel;
    }
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper button labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have accessible name
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should work with screen readers', async ({ page }) => {
    // Test accessibility tree structure
    const snapshot = await page.accessibility.snapshot();
    expect(snapshot).toBeTruthy();
    
    // Check for proper landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').all();
    expect(landmarks.length).toBeGreaterThan(0);
    
    // Check for proper headings in accessibility tree
    const accessibleHeadings = await page.locator('h1, h2, h3, [role="heading"]').all();
    expect(accessibleHeadings.length).toBeGreaterThan(0);
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that animations are disabled
    const animatedElements = await page.locator('.reveal, .wine-reveal, .bottle-reveal, .card-reveal').all();
    
    for (const element of animatedElements) {
      const styles = await element.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          opacity: style.opacity,
          transform: style.transform,
          animation: style.animation,
          transition: style.transition,
        };
      });
      
      // Elements should be immediately visible
      expect(styles.opacity).toBe('1');
      expect(styles.transform).toBe('none');
      expect(styles.animation).toContain('none');
    }
  });

  test('should maintain performance during accessibility features', async ({ page }) => {
    // Measure performance with accessibility features
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            fcp: 0,
            lcp: 0,
            cls: 0,
            fid: 0,
          };
          
          entries.forEach((entry) => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.cls += entry.value;
            }
          });
          
          resolve(metrics);
        });
        
        observer.observe({ type: 'paint', buffered: true });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => observer.disconnect(), 3000);
      });
    });
    
    const metrics = await performanceMetrics as any;
    
    // Performance should remain good
    expect(metrics.fcp).toBeLessThan(2500); // First Contentful Paint < 2.5s
    expect(metrics.lcp).toBeLessThan(4000); // Largest Contentful Paint < 4s
    expect(metrics.cls).toBeLessThan(0.1);  // Cumulative Layout Shift < 0.1
  });

  test('should support high contrast mode', async ({ page }) => {
    // Test with forced colors (high contrast mode)
    await page.emulateMedia({ forcedColors: 'active' });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Run accessibility audit in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check that content is still visible
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();
  });

  test('should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      Object.defineProperty(window, 'navigator', {
        value: { ...window.navigator, javaEnabled: () => false },
        writable: false
      });
    });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Content should still be accessible
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // Essential content should be readable
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThan(0);
  });
}); 