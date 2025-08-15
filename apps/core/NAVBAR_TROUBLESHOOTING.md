# Navbar Troubleshooting Guide

## 🚨 **Issue: Navbar Not Working**

### **Current Status**
- ✅ Development server running on http://localhost:3000
- ✅ All components exist and are properly configured
- ✅ Routes are correctly defined in main.wasp
- ✅ ModernNavbar component is properly implemented
- ✅ App.tsx integration is correct

---

## 🔍 **Debugging Steps**

### **1. Check Browser Console**
Open your browser's developer tools (F12) and check the console for any errors:

**Expected Console Logs:**
```
App.tsx - shouldDisplayAppNavBar: true pathname: /
ModernNavbar rendering, user: null
Available routes: {LoginRoute: {...}, SignupRoute: {...}, ...}
Navigation items: [{name: 'Features', href: '/how-it-works'}, ...]
```

**If you see errors, they might be:**
- Module import errors (expected in development)
- Route resolution errors
- Component rendering errors

### **2. Verify Navbar Visibility**
The navbar should be visible on all pages EXCEPT:
- `/login` - Login page
- `/signup` - Signup page
- `/admin/*` - Admin dashboard pages

**Test this by navigating to:**
- http://localhost:3000/ (should show navbar)
- http://localhost:3000/about (should show navbar)
- http://localhost:3000/login (should NOT show navbar)
- http://localhost:3000/signup (should NOT show navbar)

### **3. Test Navigation Links**
Click each navbar link to verify they work:

| Link | Expected Route | Status |
|------|----------------|--------|
| Logo | `/` | Should navigate to home |
| Features | `/how-it-works` | Should navigate to features |
| Pricing | `/pricing` | Should navigate to pricing |
| About | `/about` | Should navigate to about |
| Blog | `/blog` | Should navigate to blog |
| Contact | `/contact` | Should navigate to contact |
| Get Started | `/signup` | Should navigate to signup |
| Log in | `/login` | Should navigate to login |

### **4. Test Mobile Menu**
- Resize browser window to mobile size (< 768px)
- Click hamburger menu button (☰)
- Menu should open with all navigation items
- Click any item to navigate and close menu

---

## 🛠️ **Common Issues & Solutions**

### **Issue 1: Navbar Not Visible**
**Symptoms:** No navbar appears on any page

**Possible Causes:**
1. **App.tsx not rendering ModernNavbar**
2. **shouldDisplayAppNavBar logic incorrect**
3. **Component import error**

**Solutions:**
```typescript
// Check App.tsx line 47-49
{shouldDisplayAppNavBar && <ModernNavbar />}
```

### **Issue 2: Navigation Links Not Working**
**Symptoms:** Links appear but don't navigate

**Possible Causes:**
1. **Route not defined in main.wasp**
2. **Component not found**
3. **Link component import error**

**Solutions:**
```typescript
// Verify route exists in main.wasp
route AboutRoute { path: "/about", to: AboutPage }

// Verify component exists
page AboutPage {
  component: import AboutPage from "@src/client/pages/AboutPage"
}
```

### **Issue 3: Mobile Menu Not Working**
**Symptoms:** Hamburger menu doesn't open

**Possible Causes:**
1. **useState not working**
2. **Click handler not firing**
3. **CSS classes not applied**

**Solutions:**
```typescript
// Check ModernNavbar.tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Verify click handler
onClick={() => setIsMenuOpen(!isMenuOpen)}
```

### **Issue 4: Styling Issues**
**Symptoms:** Navbar looks broken or unstyled

**Possible Causes:**
1. **Tailwind CSS not loaded**
2. **Custom CSS classes missing**
3. **Bordeaux/Champagne colors not defined**

**Solutions:**
```css
/* Check if these classes are defined in your CSS */
.bg-bordeaux-600
.text-bordeaux-900
.bg-champagne-50
```

---

## 🧪 **Testing Tools**

### **1. Navbar Test Page**
Visit: http://localhost:3000/test/navbar

This page will:
- Display all available routes
- Show debug information
- Allow manual testing of each link

### **2. Browser Developer Tools**
- **Console:** Check for JavaScript errors
- **Network:** Verify all resources load
- **Elements:** Inspect navbar HTML structure
- **Responsive:** Test mobile layout

### **3. Manual Testing Checklist**
- [ ] Navbar visible on home page
- [ ] All navigation links work
- [ ] Mobile menu opens/closes
- [ ] Logo links to home
- [ ] Get Started button works
- [ ] Login/Dashboard toggle works
- [ ] Responsive design works

---

## 🔧 **Quick Fixes**

### **If Navbar is Completely Missing:**
1. Check browser console for errors
2. Verify App.tsx is importing ModernNavbar
3. Check if shouldDisplayAppNavBar is true
4. Restart development server

### **If Links Don't Work:**
1. Check main.wasp for route definitions
2. Verify page components exist
3. Check browser console for route errors
4. Test with direct URL navigation

### **If Mobile Menu Broken:**
1. Check useState hook in ModernNavbar
2. Verify click handlers are working
3. Check CSS classes for mobile menu
4. Test with browser responsive mode

---

## 📞 **Getting Help**

### **Debug Information to Collect:**
1. **Browser Console Logs:** Copy all console output
2. **Current URL:** What page you're on
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What's actually happening
5. **Browser/Device:** Chrome, Firefox, mobile, etc.

### **Files to Check:**
- `src/client/App.tsx` - Navbar integration
- `src/client/components/modern/ModernNavbar.tsx` - Navbar component
- `main.wasp` - Route definitions
- Browser console - Error messages

---

## ✅ **Success Criteria**

The navbar is working correctly when:
- ✅ Visible on all pages except login/signup/admin
- ✅ All navigation links work and navigate correctly
- ✅ Mobile menu opens and closes properly
- ✅ Logo links to home page
- ✅ Get Started button navigates to signup
- ✅ Login/Dashboard toggle works based on user state
- ✅ Responsive design works on all screen sizes
- ✅ No console errors related to navbar

---

**🎯 Next Steps:**
1. Open http://localhost:3000 in your browser
2. Check browser console for debug logs
3. Test all navigation links
4. Test mobile menu functionality
5. Report any specific errors or issues 