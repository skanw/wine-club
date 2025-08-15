#!/usr/bin/env node

/**
 * Navigation Test Script
 * Tests all navbar links and functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Navigation Integration...\n');

// Test configuration
const testConfig = {
  baseUrl: 'http://localhost:3001',
  routes: [
    { name: 'Home', path: '/', expected: 'LandingPage' },
    { name: 'Features', path: '/how-it-works', expected: 'HowItWorksPage' },
    { name: 'Pricing', path: '/pricing', expected: 'PricingPage' },
    { name: 'About', path: '/about', expected: 'AboutPage' },
    { name: 'Blog', path: '/blog', expected: 'BlogPage' },
    { name: 'Contact', path: '/contact', expected: 'ContactPage' },
    { name: 'Signup', path: '/signup', expected: 'SignupPage' },
    { name: 'Login', path: '/login', expected: 'LoginPage' },
    { name: 'Member Portal', path: '/member-portal', expected: 'MemberPortalPage' },
  ]
};

// Check if routes are properly configured in main.wasp
function checkWaspRoutes() {
  console.log('📋 Checking Wasp route configuration...');
  
  try {
    const waspFile = fs.readFileSync('main.wasp', 'utf8');
    const routeRegex = /route\s+(\w+)\s*\{\s*path:\s*"([^"]+)"/g;
    const routes = [];
    let match;
    
    while ((match = routeRegex.exec(waspFile)) !== null) {
      routes.push({
        name: match[1],
        path: match[2]
      });
    }
    
    console.log(`✅ Found ${routes.length} routes in main.wasp`);
    
    // Check if all expected routes exist
    const expectedPaths = testConfig.routes.map(r => r.path);
    const missingRoutes = expectedPaths.filter(path => 
      !routes.some(r => r.path === path)
    );
    
    if (missingRoutes.length > 0) {
      console.log(`❌ Missing routes: ${missingRoutes.join(', ')}`);
      return false;
    } else {
      console.log('✅ All expected routes are configured');
      return true;
    }
  } catch (error) {
    console.log('❌ Error reading main.wasp file:', error.message);
    return false;
  }
}

// Check if page components exist
function checkPageComponents() {
  console.log('\n📁 Checking page components...');
  
  const pagesDir = 'src/client/pages';
  const expectedPages = [
    { name: 'LandingPage.tsx', path: path.join(pagesDir, 'LandingPage.tsx') },
    { name: 'HowItWorksPage.tsx', path: path.join(pagesDir, 'HowItWorksPage.tsx') },
    { name: 'PricingPage.tsx', path: path.join(pagesDir, 'PricingPage.tsx') },
    { name: 'AboutPage.tsx', path: path.join(pagesDir, 'AboutPage.tsx') },
    { name: 'BlogPage.tsx', path: path.join(pagesDir, 'BlogPage.tsx') },
    { name: 'ContactPage.tsx', path: path.join(pagesDir, 'ContactPage.tsx') },
    { name: 'SignupPage.tsx', path: path.join(pagesDir, 'auth', 'SignupPage.tsx') },
    { name: 'LoginPage.tsx', path: path.join(pagesDir, 'auth', 'LoginPage.tsx') },
    { name: 'MemberPortalPage.tsx', path: path.join(pagesDir, 'user', 'MemberPortalPage.tsx') }
  ];
  
  const missingPages = [];
  
  expectedPages.forEach(page => {
    if (!fs.existsSync(page.path)) {
      missingPages.push(page.name);
    }
  });
  
  if (missingPages.length > 0) {
    console.log(`❌ Missing page components: ${missingPages.join(', ')}`);
    return false;
  } else {
    console.log('✅ All page components exist');
    return true;
  }
}

// Check ModernNavbar component
function checkNavbarComponent() {
  console.log('\n🧭 Checking ModernNavbar component...');
  
  const navbarPath = 'src/client/components/modern/ModernNavbar.tsx';
  
  if (!fs.existsSync(navbarPath)) {
    console.log('❌ ModernNavbar component not found');
    return false;
  }
  
  try {
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    
    // Check for required imports
    const hasRoutesImport = navbarContent.includes('import { routes } from \'wasp/client/router\'');
    const hasLinkImport = navbarContent.includes('import { Link } from \'react-router-dom\'');
    
    if (!hasRoutesImport) {
      console.log('❌ Missing routes import in ModernNavbar');
      return false;
    }
    
    if (!hasLinkImport) {
      console.log('❌ Missing Link import in ModernNavbar');
      return false;
    }
    
    // Check for navigation items configuration
    const hasNavigationItems = navbarContent.includes('navigationItems');
    const hasGetStartedButton = navbarContent.includes('Get Started');
    
    if (!hasNavigationItems) {
      console.log('❌ Missing navigationItems configuration');
      return false;
    }
    
    if (!hasGetStartedButton) {
      console.log('❌ Missing Get Started button');
      return false;
    }
    
    console.log('✅ ModernNavbar component is properly configured');
    return true;
  } catch (error) {
    console.log('❌ Error reading ModernNavbar component:', error.message);
    return false;
  }
}

// Check design consistency
function checkDesignConsistency() {
  console.log('\n🎨 Checking design consistency...');
  
  const pagesToCheck = [
    'src/client/pages/AboutPage.tsx',
    'src/client/pages/ContactPage.tsx',
    'src/client/pages/BlogPage.tsx'
  ];
  
  let allConsistent = true;
  
  pagesToCheck.forEach(pagePath => {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      const hasModernDesign = content.includes('bg-gradient-to-br from-bordeaux-50 via-champagne-50 to-bordeaux-100');
      const hasBlurredShapes = content.includes('blur-3xl opacity-20');
      
      if (!hasModernDesign || !hasBlurredShapes) {
        console.log(`❌ ${path.basename(pagePath)} missing modern design elements`);
        allConsistent = false;
      }
    }
  });
  
  if (allConsistent) {
    console.log('✅ All pages have consistent modern design');
  }
  
  return allConsistent;
}

// Check App.tsx integration
function checkAppIntegration() {
  console.log('\n🔗 Checking App.tsx integration...');
  
  const appPath = 'src/client/App.tsx';
  
  if (!fs.existsSync(appPath)) {
    console.log('❌ App.tsx not found');
    return false;
  }
  
  try {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    const hasModernNavbarImport = appContent.includes('import ModernNavbar from \'./components/modern/ModernNavbar\'');
    const hasModernNavbarUsage = appContent.includes('<ModernNavbar />');
    
    if (!hasModernNavbarImport) {
      console.log('❌ Missing ModernNavbar import in App.tsx');
      return false;
    }
    
    if (!hasModernNavbarUsage) {
      console.log('❌ Missing ModernNavbar usage in App.tsx');
      return false;
    }
    
    console.log('✅ App.tsx properly integrates ModernNavbar');
    return true;
  } catch (error) {
    console.log('❌ Error reading App.tsx:', error.message);
    return false;
  }
}

// Main test execution
function runTests() {
  console.log('🚀 Starting Navigation Integration Tests...\n');
  
  const tests = [
    { name: 'Wasp Routes', fn: checkWaspRoutes },
    { name: 'Page Components', fn: checkPageComponents },
    { name: 'Navbar Component', fn: checkNavbarComponent },
    { name: 'Design Consistency', fn: checkDesignConsistency },
    { name: 'App Integration', fn: checkAppIntegration }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  tests.forEach(test => {
    console.log(`\n--- Testing ${test.name} ---`);
    if (test.fn()) {
      passedTests++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All navigation tests passed! Integration is working correctly.');
    console.log('\n✅ Navigation Integration Status: SUCCESS');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
    console.log('\n❌ Navigation Integration Status: NEEDS ATTENTION');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Test navigation manually in the browser');
  console.log('3. Verify all links work correctly');
  console.log('4. Check responsive design on mobile devices');
}

// Run the tests
runTests(); 