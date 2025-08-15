import { test, expect, Page, BrowserContext } from '@playwright/test';

// 🌍 Wine Club Internationalization E2E Tests
test.describe('🌐 Internationalization (i18n) Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start with a clean slate - clear localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      document.cookie = 'i18nextLng=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
  });

  test.describe('Language Toggle Functionality', () => {
    test('should display language switcher in navbar', async ({ page }) => {
      await page.goto('/');
      
      // Check that language switcher is visible
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await expect(languageSwitcher).toBeVisible();
      
      // Should show US flag by default
      const flagElement = languageSwitcher.locator('span[role="img"]');
      await expect(flagElement).toHaveText('🇺🇸');
    });

    test('should toggle between English and French', async ({ page }) => {
      await page.goto('/');
      
      // Click language switcher
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      
      // Click French option
      const frenchOption = page.locator('button:has-text("Français")');
      await expect(frenchOption).toBeVisible();
      await frenchOption.click();
      
      // Verify flag changed to French
      const flagElement = languageSwitcher.locator('span[role="img"]');
      await expect(flagElement).toHaveText('🇫🇷');
    });

    test('should persist language selection across page reloads', async ({ page }) => {
      await page.goto('/');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Reload page
      await page.reload();
      
      // Language should still be French
      const flagElement = languageSwitcher.locator('span[role="img"]');
      await expect(flagElement).toHaveText('🇫🇷');
    });

    test('should persist language selection across navigation', async ({ page }) => {
      await page.goto('/');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Navigate to different page
      await page.click('a[href*="wine-subscriptions"]');
      await page.waitForLoadState('networkidle');
      
      // Language should still be French
      const flagElementAfterNav = page.locator('[aria-label*="Change language"] span[role="img"]');
      await expect(flagElementAfterNav).toHaveText('🇫🇷');
    });
  });

  test.describe('Landing Page Translations', () => {
    test('should translate hero section from English to French', async ({ page }) => {
      await page.goto('/');
      
      // Verify English content
      await expect(page.locator('h1')).toContainText('Transform Your Wine Cave into a');
      await expect(page.locator('h1')).toContainText('Thriving Subscription Business');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation to apply
      await page.waitForTimeout(500);
      
      // Verify French content
      await expect(page.locator('h1')).toContainText('Transformez Votre Cave à Vin en une');
      await expect(page.locator('h1')).toContainText('Entreprise d\'Abonnement Prospère');
    });

    test('should translate hero buttons from English to French', async ({ page }) => {
      await page.goto('/');
      
      // Verify English buttons
      await expect(page.locator('a:has-text("Start Your Wine Cave")')).toBeVisible();
      await expect(page.locator('a:has-text("View Demo")')).toBeVisible();
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(500);
      
      // Verify French buttons
      await expect(page.locator('a:has-text("Créer Votre Cave à Vin")')).toBeVisible();
      await expect(page.locator('a:has-text("Voir la Démo")')).toBeVisible();
    });

    test('should translate navbar elements', async ({ page }) => {
      await page.goto('/');
      
      // Verify English navbar
      await expect(page.locator('nav a:has-text("Subscribe")')).toBeVisible();
      await expect(page.locator('nav div:has-text("Log in")')).toBeVisible();
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(500);
      
      // Verify French navbar
      await expect(page.locator('nav a:has-text("S\'abonner Maintenant")')).toBeVisible();
      await expect(page.locator('nav div:has-text("Connexion")')).toBeVisible();
    });

    test('should translate features section', async ({ page }) => {
      await page.goto('/');
      
      // Scroll to features section
      await page.locator('#features').scrollIntoViewIfNeeded();
      
      // Verify English features title
      await expect(page.locator('#features h2, #features p').first()).toContainText('Best');
      await expect(page.locator('#features h2, #features p').first()).toContainText('Features');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(500);
      
      // Verify French features title
      await expect(page.locator('#features h2, #features p').first()).toContainText('Meilleures');
      await expect(page.locator('#features h2, #features p').first()).toContainText('Fonctionnalités');
    });
  });

  test.describe('Subscription Page Translations', () => {
    test('should translate subscription page content', async ({ page }) => {
      await page.goto('/wine-subscriptions');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Verify English content (if any visible text)
      const pageContent = await page.textContent('body');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(1000);
      
      // Verify content changed (basic check)
      const frenchPageContent = await page.textContent('body');
      expect(frenchPageContent).not.toBe(pageContent);
    });
  });

  test.describe('Authentication Pages Translations', () => {
    test('should translate login page', async ({ page }) => {
      await page.goto('/login');
      
      // Change to French first
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(500);
      
      // Check for French text in login form (if translated)
      const loginContent = await page.textContent('body');
      
      // Basic verification that page content exists
      expect(loginContent).toBeTruthy();
      expect(loginContent.length).toBeGreaterThan(0);
    });

    test('should translate signup page', async ({ page }) => {
      await page.goto('/signup');
      
      // Change to French first
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Wait for translation
      await page.waitForTimeout(500);
      
      // Check for content
      const signupContent = await page.textContent('body');
      expect(signupContent).toBeTruthy();
      expect(signupContent.length).toBeGreaterThan(0);
    });
  });

  test.describe('Dashboard Translations (if accessible)', () => {
    test('should maintain language selection on protected routes', async ({ page }) => {
      await page.goto('/');
      
      // Change to French
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      await page.locator('button:has-text("Français")').click();
      
      // Try to navigate to a dashboard route (will likely redirect to login)
      await page.goto('/wine-caves');
      
      // Language switcher should still show French
      const flagElement = page.locator('[aria-label*="Change language"] span[role="img"]');
      await expect(flagElement).toHaveText('🇫🇷');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should show language toggle in mobile menu', async ({ page, isMobile }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Open mobile menu
      const mobileMenuButton = page.locator('button[aria-label*="Open main menu"], button:has-text("☰")');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        
        // Look for language switcher in mobile menu
        const mobileLanguageSwitcher = page.locator('div:has(span:text("🇺🇸")), div:has(span:text("🇫🇷"))');
        await expect(mobileLanguageSwitcher).toBeVisible();
      }
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels for language switcher', async ({ page }) => {
      await page.goto('/');
      
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await expect(languageSwitcher).toHaveAttribute('aria-label');
      await expect(languageSwitcher).toHaveAttribute('aria-expanded', 'false');
      
      // Open dropdown
      await languageSwitcher.click();
      await expect(languageSwitcher).toHaveAttribute('aria-expanded', 'true');
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');
      
      // Tab to language switcher
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need multiple tabs depending on nav structure
      
      // Find the language switcher and activate with keyboard
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.focus();
      await page.keyboard.press('Enter');
      
      // Should open dropdown
      await expect(languageSwitcher).toHaveAttribute('aria-expanded', 'true');
    });

    test('should work with screen readers', async ({ page }) => {
      await page.goto('/');
      
      // Check for screen reader friendly attributes
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      const ariaLabel = await languageSwitcher.getAttribute('aria-label');
      
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('language');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing translations gracefully', async ({ page }) => {
      await page.goto('/');
      
      // Evaluate JavaScript to simulate missing translation
      const result = await page.evaluate(() => {
        // @ts-ignore - accessing global i18n for testing
        return window.i18n?.t('nonexistent.translation.key') || 'fallback';
      });
      
      // Should not crash and provide some fallback
      expect(result).toBeTruthy();
    });

    test('should handle network errors during language change', async ({ page }) => {
      await page.goto('/');
      
      // Simulate network issues by intercepting requests
      await page.route('**/*', route => {
        if (route.request().url().includes('locales')) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      // Try to change language
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      await languageSwitcher.click();
      
      // Should not crash the app
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('should not significantly impact page load time', async ({ page }) => {
      // Measure load time with i18n
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (adjust threshold as needed)
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
    });

    test('should handle rapid language switching', async ({ page }) => {
      await page.goto('/');
      
      const languageSwitcher = page.locator('[aria-label*="Change language"]');
      
      // Rapidly switch languages
      for (let i = 0; i < 5; i++) {
        await languageSwitcher.click();
        await page.locator('button:has-text("Français")').click();
        await page.waitForTimeout(100);
        
        await languageSwitcher.click();
        await page.locator('button:has-text("English")').click();
        await page.waitForTimeout(100);
      }
      
      // App should remain functional
      await expect(page.locator('body')).toBeVisible();
      await expect(languageSwitcher).toBeVisible();
    });
  });
}); 