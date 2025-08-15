describe('Wine Club Platform - Regression Test Suite', () => {
  beforeEach(() => {
    // Reset database state before each test
    cy.exec('npm run db:reset:test');
    
    // Visit the application
    cy.visit('http://localhost:3000');
    
    // Wait for page to load
    cy.get('[data-testid="app-loaded"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Critical User Flows', () => {
    it('Complete user journey: sign-up → subscribe → ship → cancel', () => {
      // Step 1: User Registration
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      cy.get('[data-testid="signup-submit"]').click();
      
      // Verify email verification
      cy.get('[data-testid="verification-sent"]').should('be.visible');
      
      // Mock email verification (in real test, would check email)
      cy.exec('npm run test:verify-email test@example.com');
      
      // Step 2: Wine Cave Discovery
      cy.get('[data-testid="wine-cave-list"]').should('be.visible');
      cy.get('[data-testid="cave-card"]').first().click();
      cy.get('[data-testid="cave-details"]').should('be.visible');
      
      // Step 3: Subscription Selection
      cy.get('[data-testid="subscription-tiers"]').should('be.visible');
      cy.get('[data-testid="tier-premium"]').click();
      cy.get('[data-testid="tier-details"]').should('contain', 'Premium');
      
      // Step 4: Checkout Process
      cy.get('[data-testid="subscribe-button"]').click();
      cy.get('[data-testid="checkout-form"]').should('be.visible');
      
      // Fill shipping information
      cy.get('[data-testid="shipping-name"]').type('John Doe');
      cy.get('[data-testid="shipping-address"]').type('123 Test Street');
      cy.get('[data-testid="shipping-city"]').type('Paris');
      cy.get('[data-testid="shipping-postal"]').type('75001');
      cy.get('[data-testid="shipping-phone"]').type('+33123456789');
      
      // Fill payment information (using Stripe test data)
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="card-expiry"]').type('1230');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="card-name"]').type('John Doe');
      
      // Complete payment
      cy.get('[data-testid="payment-submit"]').click();
      
      // Step 5: Verify Subscription Created
      cy.get('[data-testid="subscription-success"]').should('be.visible');
      cy.get('[data-testid="subscription-id"]').should('exist');
      
      // Step 6: Check Dashboard
      cy.get('[data-testid="user-dashboard"]').should('be.visible');
      cy.get('[data-testid="subscription-status"]').should('contain', 'Active');
      cy.get('[data-testid="next-billing"]').should('exist');
      
      // Step 7: View Wine Selection
      cy.get('[data-testid="wine-selection"]').click();
      cy.get('[data-testid="wine-list"]').should('be.visible');
      cy.get('[data-testid="wine-item"]').should('have.length.greaterThan', 0);
      
      // Step 8: Rate Wines
      cy.get('[data-testid="wine-item"]').first().click();
      cy.get('[data-testid="wine-rating"]').click();
      cy.get('[data-testid="rating-5"]').click();
      cy.get('[data-testid="rating-submit"]').click();
      cy.get('[data-testid="rating-success"]').should('be.visible');
      
      // Step 9: Check Shipping Status
      cy.get('[data-testid="shipping-status"]').click();
      cy.get('[data-testid="shipment-list"]').should('be.visible');
      cy.get('[data-testid="shipment-item"]').should('exist');
      
      // Step 10: Cancel Subscription
      cy.get('[data-testid="account-settings"]').click();
      cy.get('[data-testid="subscription-management"]').click();
      cy.get('[data-testid="cancel-subscription"]').click();
      cy.get('[data-testid="cancel-reason"]').select('Too expensive');
      cy.get('[data-testid="cancel-confirm"]').click();
      cy.get('[data-testid="cancellation-success"]').should('be.visible');
      
      // Verify cancellation
      cy.get('[data-testid="subscription-status"]').should('contain', 'Canceling');
    });

    it('Wine cave onboarding flow', () => {
      // Login as admin
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-input"]').type('admin@wineclubpro.com');
      cy.get('[data-testid="password-input"]').type('AdminPassword123!');
      cy.get('[data-testid="login-submit"]').click();
      
      // Navigate to cave onboarding
      cy.get('[data-testid="admin-dashboard"]').should('be.visible');
      cy.get('[data-testid="cave-onboarding"]').click();
      
      // Fill cave information
      cy.get('[data-testid="cave-name"]').type('Château Test');
      cy.get('[data-testid="cave-description"]').type('A test wine cave');
      cy.get('[data-testid="cave-address"]').type('456 Wine Street');
      cy.get('[data-testid="cave-city"]').type('Bordeaux');
      cy.get('[data-testid="cave-postal"]').type('33000');
      cy.get('[data-testid="cave-phone"]').type('+33556789012');
      cy.get('[data-testid="cave-email"]').type('contact@chateautest.fr');
      
      // Upload license
      cy.get('[data-testid="license-upload"]').attachFile('license.pdf');
      cy.get('[data-testid="license-verified"]').should('be.visible');
      
      // Configure POS integration
      cy.get('[data-testid="pos-integration"]').click();
      cy.get('[data-testid="pos-provider"]').select('Square');
      cy.get('[data-testid="pos-api-key"]').type('test_square_api_key');
      cy.get('[data-testid="pos-location-id"]').type('test_location_id');
      cy.get('[data-testid="pos-test-connection"]').click();
      cy.get('[data-testid="pos-connection-success"]').should('be.visible');
      
      // Create subscription tiers
      cy.get('[data-testid="subscription-tiers"]').click();
      cy.get('[data-testid="add-tier"]').click();
      cy.get('[data-testid="tier-name"]').type('Basic');
      cy.get('[data-testid="tier-price"]').type('49');
      cy.get('[data-testid="tier-description"]').type('Basic wine selection');
      cy.get('[data-testid="tier-save"]').click();
      cy.get('[data-testid="tier-created"]').should('be.visible');
      
      // Upload wine inventory
      cy.get('[data-testid="inventory-upload"]').click();
      cy.get('[data-testid="csv-upload"]').attachFile('wine-inventory.csv');
      cy.get('[data-testid="inventory-processed"]').should('be.visible');
      cy.get('[data-testid="wine-count"]').should('contain', '10');
      
      // Complete onboarding
      cy.get('[data-testid="complete-onboarding"]').click();
      cy.get('[data-testid="onboarding-success"]').should('be.visible');
    });

    it('Payment processing and webhook handling', () => {
      // Create subscription with test payment
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="email-input"]').type('payment@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      cy.get('[data-testid="signup-submit"]').click();
      
      // Mock email verification
      cy.exec('npm run test:verify-email payment@example.com');
      
      // Select subscription and proceed to payment
      cy.get('[data-testid="cave-card"]').first().click();
      cy.get('[data-testid="tier-premium"]').click();
      cy.get('[data-testid="subscribe-button"]').click();
      
      // Fill payment form with test card
      cy.get('[data-testid="shipping-name"]').type('Payment Test');
      cy.get('[data-testid="shipping-address"]').type('789 Payment Street');
      cy.get('[data-testid="shipping-city"]').type('Lyon');
      cy.get('[data-testid="shipping-postal"]').type('69000');
      cy.get('[data-testid="shipping-phone"]').type('+33456789012');
      
      // Test successful payment
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="card-expiry"]').type('1230');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="card-name"]').type('Payment Test');
      cy.get('[data-testid="payment-submit"]').click();
      
      // Verify payment success
      cy.get('[data-testid="subscription-success"]').should('be.visible');
      
      // Test failed payment
      cy.visit('http://localhost:3000/subscribe');
      cy.get('[data-testid="cave-card"]').first().click();
      cy.get('[data-testid="tier-premium"]').click();
      cy.get('[data-testid="subscribe-button"]').click();
      
      cy.get('[data-testid="shipping-name"]').type('Failed Payment');
      cy.get('[data-testid="shipping-address"]').type('456 Failed Street');
      cy.get('[data-testid="shipping-city"]').type('Marseille');
      cy.get('[data-testid="shipping-postal"]').type('13000');
      cy.get('[data-testid="shipping-phone"]').type('+33456789013');
      
      // Use declined test card
      cy.get('[data-testid="card-number"]').type('4000000000000002');
      cy.get('[data-testid="card-expiry"]').type('1230');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="card-name"]').type('Failed Payment');
      cy.get('[data-testid="payment-submit"]').click();
      
      // Verify payment failure
      cy.get('[data-testid="payment-error"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'declined');
    });

    it('Shipping and fulfillment workflow', () => {
      // Login as wine cave owner
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-input"]').type('cave@wineclubpro.com');
      cy.get('[data-testid="password-input"]').type('CavePassword123!');
      cy.get('[data-testid="login-submit"]').click();
      
      // Navigate to shipping dashboard
      cy.get('[data-testid="cave-dashboard"]').should('be.visible');
      cy.get('[data-testid="shipping-management"]').click();
      
      // View pending shipments
      cy.get('[data-testid="pending-shipments"]').should('be.visible');
      cy.get('[data-testid="shipment-item"]').first().click();
      
      // Generate shipping label
      cy.get('[data-testid="generate-label"]').click();
      cy.get('[data-testid="carrier-select"]').select('Colissimo');
      cy.get('[data-testid="label-generate"]').click();
      cy.get('[data-testid="label-generated"]').should('be.visible');
      cy.get('[data-testid="tracking-number"]').should('exist');
      
      // Update shipment status
      cy.get('[data-testid="shipment-status"]').select('Shipped');
      cy.get('[data-testid="update-status"]').click();
      cy.get('[data-testid="status-updated"]').should('be.visible');
      
      // Test tracking
      cy.get('[data-testid="tracking-link"]').click();
      cy.get('[data-testid="tracking-info"]').should('be.visible');
      cy.get('[data-testid="delivery-status"]').should('contain', 'In Transit');
    });

    it('Analytics and reporting', () => {
      // Login as cave owner
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-input"]').type('cave@wineclubpro.com');
      cy.get('[data-testid="password-input"]').type('CavePassword123!');
      cy.get('[data-testid="login-submit"]').click();
      
      // Navigate to analytics
      cy.get('[data-testid="analytics-dashboard"]').click();
      
      // Check revenue metrics
      cy.get('[data-testid="total-revenue"]').should('be.visible');
      cy.get('[data-testid="monthly-revenue"]').should('be.visible');
      cy.get('[data-testid="revenue-chart"]').should('be.visible');
      
      // Check subscription metrics
      cy.get('[data-testid="total-subscribers"]').should('be.visible');
      cy.get('[data-testid="active-subscribers"]').should('be.visible');
      cy.get('[data-testid="churn-rate"]').should('be.visible');
      
      // Check inventory metrics
      cy.get('[data-testid="total-wines"]').should('be.visible');
      cy.get('[data-testid="low-stock-alerts"]').should('be.visible');
      cy.get('[data-testid="top-selling-wines"]').should('be.visible');
      
      // Export reports
      cy.get('[data-testid="export-reports"]').click();
      cy.get('[data-testid="export-revenue"]').click();
      cy.get('[data-testid="export-subscriptions"]').click();
      cy.get('[data-testid="export-inventory"]').click();
      cy.get('[data-testid="export-success"]').should('be.visible');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('Handles network failures gracefully', () => {
      // Simulate network failure
      cy.intercept('POST', '/api/auth/signup', { forceNetworkError: true });
      
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="email-input"]').type('network@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      cy.get('[data-testid="signup-submit"]').click();
      
      // Verify error handling
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('Handles invalid input validation', () => {
      cy.get('[data-testid="signup-button"]').click();
      
      // Test invalid email
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="signup-submit"]').click();
      cy.get('[data-testid="email-error"]').should('contain', 'valid email');
      
      // Test weak password
      cy.get('[data-testid="email-input"]').clear().type('valid@example.com');
      cy.get('[data-testid="password-input"]').clear().type('weak');
      cy.get('[data-testid="confirm-password-input"]').clear().type('weak');
      cy.get('[data-testid="signup-submit"]').click();
      cy.get('[data-testid="password-error"]').should('contain', 'stronger');
      
      // Test age verification
      cy.get('[data-testid="password-input"]').clear().type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').clear().type('TestPassword123!');
      cy.get('[data-testid="signup-submit"]').click();
      cy.get('[data-testid="age-error"]').should('contain', 'age verification');
    });

    it('Handles concurrent user actions', () => {
      // Test multiple users signing up simultaneously
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="email-input"]').type('concurrent1@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      
      // Open another tab and try same email
      cy.window().then((win) => {
        win.open('http://localhost:3000/signup', '_blank');
      });
      
      cy.get('[data-testid="email-input"]').type('concurrent1@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      cy.get('[data-testid="signup-submit"]').click();
      
      // Verify duplicate email handling
      cy.get('[data-testid="email-error"]').should('contain', 'already exists');
    });
  });

  describe('Performance and Load Testing', () => {
    it('Handles large wine inventory', () => {
      // Login as cave owner
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-input"]').type('cave@wineclubpro.com');
      cy.get('[data-testid="password-input"]').type('CavePassword123!');
      cy.get('[data-testid="login-submit"]').click();
      
      // Upload large inventory
      cy.get('[data-testid="inventory-upload"]').click();
      cy.get('[data-testid="csv-upload"]').attachFile('large-inventory.csv');
      
      // Verify performance
      cy.get('[data-testid="inventory-processing"]').should('be.visible');
      cy.get('[data-testid="inventory-processed"]', { timeout: 30000 }).should('be.visible');
      cy.get('[data-testid="wine-count"]').should('contain', '1000');
      
      // Test pagination
      cy.get('[data-testid="wine-list"]').should('be.visible');
      cy.get('[data-testid="pagination"]').should('be.visible');
      cy.get('[data-testid="next-page"]').click();
      cy.get('[data-testid="wine-list"]').should('contain', 'Wine 51');
    });

    it('Handles multiple concurrent subscriptions', () => {
      // Create multiple subscriptions simultaneously
      for (let i = 1; i <= 5; i++) {
        cy.get('[data-testid="signup-button"]').click();
        cy.get('[data-testid="email-input"]').type(`loadtest${i}@example.com`);
        cy.get('[data-testid="password-input"]').type('TestPassword123!');
        cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
        cy.get('[data-testid="age-verification"]').check();
        cy.get('[data-testid="terms-accept"]').check();
        cy.get('[data-testid="signup-submit"]').click();
        
        // Mock email verification
        cy.exec(`npm run test:verify-email loadtest${i}@example.com`);
        
        // Complete subscription
        cy.get('[data-testid="cave-card"]').first().click();
        cy.get('[data-testid="tier-basic"]').click();
        cy.get('[data-testid="subscribe-button"]').click();
        
        // Quick checkout
        cy.get('[data-testid="quick-checkout"]').click();
        cy.get('[data-testid="subscription-success"]').should('be.visible');
        
        // Logout for next iteration
        cy.get('[data-testid="logout"]').click();
      }
      
      // Verify all subscriptions created
      cy.get('[data-testid="admin-dashboard"]').click();
      cy.get('[data-testid="subscription-count"]').should('contain', '5');
    });
  });

  describe('Accessibility and Mobile Testing', () => {
    it('Meets accessibility standards', () => {
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'signup-button');
      
      // Test screen reader compatibility
      cy.get('[data-testid="signup-button"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="email-input"]').should('have.attr', 'aria-describedby');
      
      // Test color contrast
      cy.get('[data-testid="main-content"]').should('have.css', 'color').and('not.eq', '#000000');
      
      // Test focus indicators
      cy.get('[data-testid="email-input"]').focus();
      cy.focused().should('have.css', 'outline').and('not.eq', 'none');
    });

    it('Responsive design on mobile', () => {
      // Test mobile viewport
      cy.viewport('iphone-x');
      
      // Verify mobile navigation
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
      
      // Test touch interactions
      cy.get('[data-testid="mobile-menu"]').click();
      cy.get('[data-testid="mobile-nav"]').should('be.visible');
      
      // Test mobile signup flow
      cy.get('[data-testid="signup-button"]').click();
      cy.get('[data-testid="signup-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').type('mobile@example.com');
      cy.get('[data-testid="password-input"]').type('TestPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPassword123!');
      cy.get('[data-testid="age-verification"]').check();
      cy.get('[data-testid="terms-accept"]').check();
      cy.get('[data-testid="signup-submit"]').click();
      
      // Verify mobile-optimized success page
      cy.get('[data-testid="subscription-success"]').should('be.visible');
    });
  });
}); 