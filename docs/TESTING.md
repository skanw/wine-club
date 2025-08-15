# 🍷 Wine Club Platform - User Flow Testing Suite

This comprehensive testing suite validates the human-computer interaction quality and user experience of the Wine Club platform across all critical user journeys.

## 📋 Test Suites Overview

### 1. Basic User Flows (`test:simple`)
Core functionality tests for essential user interactions:
- Landing page experience
- User registration flow
- Wine cave discovery
- Subscription checkout
- User dashboard
- Mobile responsiveness
- Accessibility
- Performance

### 2. Comprehensive Scenarios (`test:comprehensive`)
Detailed scenario-based tests covering all user journeys:
- Wine cave discovery & onboarding
- Subscription signup & payment flow
- AI sommelier interaction
- Wine rating & review system
- Shipping & delivery tracking
- User dashboard & account management
- Admin dashboard & analytics
- Mobile responsiveness & touch interactions
- Accessibility & keyboard navigation
- Performance & loading states
- Error handling & edge cases
- Internationalization & localization

### 3. Wine-Specific Features (`test:wine-specific`)
Specialized tests for wine industry specific features:
- Wine tasting experience
- Cellar management
- Sommelier consultation
- Wine education & learning
- Wine recommendations engine
- Wine club membership management
- Wine events & tastings
- Wine pairing & food matching
- Wine storage & aging
- Wine community & social features

## 🚀 Running Tests

### Prerequisites
1. Ensure the Wine Club platform is running: `wasp start`
2. Install dependencies: `npm install`
3. Verify Puppeteer is installed: `npm install --save-dev puppeteer`

### Basic Commands

```bash
# Run basic user flow tests
npm run test:simple

# Run comprehensive scenario tests
npm run test:comprehensive

# Run wine-specific feature tests
npm run test:wine-specific

# Run all test suites
npm run test:all

# List available test suites
npm run test:list

# Run specific test suites
npm run test:run basic
npm run test:run comprehensive wine-specific
npm run test:run --all
```

### Advanced Usage

```bash
# Run specific test suites with custom configuration
node scripts/run-specific-tests.cjs basic comprehensive

# Run all tests with detailed output
node scripts/run-specific-tests.cjs --all

# View test configuration
cat test-config.json
```

## 📊 Test Results & Assessment

### Success Criteria
- **EXCEPTIONAL (95-100%)**: All tests pass, platform ready for production
- **EXCELLENT (85-94%)**: Most tests pass, minor improvements needed
- **GOOD (70-84%)**: Core functionality works, several areas need attention
- **NEEDS WORK (<70%)**: Multiple issues detected, prioritize fixes

### Assessment Categories

#### Human-Computer Interaction Quality
- **User Journey Flow**: Seamless navigation through key user paths
- **Interface Design**: Intuitive and visually appealing UI/UX
- **Responsiveness**: Optimal experience across all device sizes
- **Accessibility**: WCAG AA compliance and keyboard navigation
- **Performance**: Fast loading times and smooth interactions

#### Wine Industry Standards
- **Wine Expertise**: Professional-level wine knowledge and guidance
- **Sommelier Services**: Expert consultation and recommendations
- **Cellar Management**: Comprehensive wine storage and organization
- **Education**: Engaging wine learning and tasting experiences
- **Community**: Social features that foster wine appreciation

#### Technical Excellence
- **Error Handling**: Graceful handling of edge cases and failures
- **Security**: Secure user data and payment processing
- **Scalability**: Platform performance under load
- **Internationalization**: Multi-language and multi-currency support
- **Mobile Optimization**: Touch-friendly mobile experience

## 🔧 Test Configuration

The test suite is configured via `test-config.json`:

```json
{
  "testSuites": {
    "basic": { /* Basic test configuration */ },
    "comprehensive": { /* Comprehensive test configuration */ },
    "wine-specific": { /* Wine-specific test configuration */ }
  },
  "testSettings": {
    "baseUrl": "http://localhost:3000",
    "timeouts": { /* Timeout settings */ },
    "viewport": { /* Viewport configurations */ },
    "browserOptions": { /* Puppeteer browser options */ }
  },
  "userProfiles": { /* Test user accounts */ },
  "testData": { /* Sample wine and subscription data */ },
  "accessibility": { /* WCAG compliance settings */ },
  "performance": { /* Performance thresholds */ }
}
```

## 📸 Screenshots & Reporting

### Screenshot Capture
- Screenshots are automatically captured on test failures
- Stored in `test-screenshots/` directory
- Include timestamps for easy identification

### Test Reports
- Console output with detailed results
- JSON format for CI/CD integration
- HTML reports with visual results (planned)
- Performance metrics and recommendations

## 🎯 Test Scenarios in Detail

### Wine Cave Discovery & Onboarding
**Objective**: Validate the wine cave discovery and user onboarding experience
- Landing page hero section and value proposition
- Wine cave exploration and filtering
- Search functionality for specific wines/regions
- Wine cave detail pages with comprehensive information
- Call-to-action buttons and conversion paths

### Subscription Signup & Payment Flow
**Objective**: Ensure seamless subscription signup and payment processing
- Subscription tier selection and comparison
- User registration form validation
- Payment method integration and security
- Order confirmation and next steps
- Email verification and account activation

### AI Sommelier Interaction
**Objective**: Test AI-powered wine recommendation and consultation features
- Natural language chat interface
- Wine preference learning and adaptation
- Personalized wine recommendations
- Food pairing suggestions
- Tasting notes and wine education

### Wine Rating & Review System
**Objective**: Validate user engagement through wine rating and review features
- Star rating system functionality
- Review text input and validation
- Flavor profile tagging
- Review submission and moderation
- Community review display and filtering

### Shipping & Delivery Tracking
**Objective**: Test end-to-end shipping and delivery experience
- Shipping status display and updates
- Tracking number input and validation
- Delivery preference management
- Carrier integration and label generation
- Delivery confirmation and feedback

## 🚨 Troubleshooting

### Common Issues

#### Application Not Running
```bash
# Start the application first
wasp start

# Wait for startup (30-60 seconds)
# Then run tests
npm run test:simple
```

#### Puppeteer Installation Issues
```bash
# Reinstall Puppeteer
npm uninstall puppeteer
npm install --save-dev puppeteer

# On macOS, you might need to allow the binary
sudo xattr -d com.apple.quarantine node_modules/puppeteer/.local-chromium/*/Chromium.app/Contents/MacOS/Chromium
```

#### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill conflicting processes
kill -9 <PID>
```

#### Test Timeouts
- Increase timeout values in `test-config.json`
- Check application performance
- Verify network connectivity

### Debug Mode
```bash
# Run tests with debug output
DEBUG=puppeteer:* npm run test:simple

# Run with slower execution for debugging
# Edit test-config.json: "slowMo": 500
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: User Flow Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
```

### Local CI Setup
```bash
# Run tests before commit
npm run test:all

# Run specific tests for feature development
npm run test:run basic

# Generate test report
npm run test:run --all > test-report.txt
```

## 🎯 Best Practices

### Test Development
1. **User-Centric**: Focus on real user scenarios and pain points
2. **Comprehensive**: Cover all critical user journeys
3. **Realistic**: Use realistic test data and user behaviors
4. **Maintainable**: Keep tests modular and well-documented
5. **Reliable**: Ensure tests are stable and repeatable

### Test Execution
1. **Environment**: Use consistent test environment
2. **Data**: Use isolated test data to avoid conflicts
3. **Timing**: Allow sufficient time for application startup
4. **Monitoring**: Monitor test execution and results
5. **Documentation**: Document test failures and resolutions

### Continuous Improvement
1. **Feedback**: Incorporate user feedback into test scenarios
2. **Metrics**: Track test success rates and performance
3. **Updates**: Keep tests updated with new features
4. **Optimization**: Optimize test execution time
5. **Coverage**: Ensure comprehensive test coverage

## 📞 Support

For issues with the testing suite:
1. Check the troubleshooting section above
2. Review test configuration in `test-config.json`
3. Verify application is running and accessible
4. Check Puppeteer installation and permissions
5. Review test logs and screenshots for debugging

---

**Note**: This testing suite is designed to validate the human-computer interaction quality of the Wine Club platform. Regular execution ensures the platform maintains high standards of user experience and functionality. 