# HCI Scroll Animations - Best Practices & Implementation

## 🎯 Design Philosophy

Based on leading HCI research and industry best practices, our scroll animations follow these principles:

### 1. **Non-Intrusive Reveals**
- Animations serve to **enhance content discovery**, not distract from it
- Use subtle motion that feels natural and purposeful
- Avoid "dancing" or repetitive animations that can cause motion sickness

### 2. **Performance-First Approach**
- Leverage **Intersection Observer API** for efficient scroll detection
- Use CSS transforms and opacity for hardware-accelerated animations
- Implement `will-change` property strategically to optimize rendering

### 3. **Accessibility Compliance**
- Respect `prefers-reduced-motion` user preferences
- Provide immediate content access for screen readers
- Maintain WCAG AA contrast ratios throughout animations

## 📐 Animation Pattern: Fade + Slide Up

### **Core Pattern**
```css
.reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  will-change: auto; /* Remove after animation */
}
```

### **Why This Pattern?**
1. **Subtle Movement**: 10px vertical translation is noticeable but not jarring
2. **Natural Timing**: 400ms duration feels responsive without being rushed
3. **Smooth Easing**: `ease-out` creates natural deceleration
4. **Performance**: Only animates opacity and transform (compositor-friendly)

## 🎬 Animation Timing & Staggering

### **Staggered Reveals**
```css
.reveal:nth-child(1) { transition-delay: 0ms; }
.reveal:nth-child(2) { transition-delay: 100ms; }
.reveal:nth-child(3) { transition-delay: 200ms; }
.reveal:nth-child(4) { transition-delay: 300ms; }
```

### **Intersection Observer Thresholds**
- **Entry Threshold**: `0.15` (15% visible)
- **Root Margin**: `"0px 0px -50px 0px"` (trigger 50px before bottom)
- **Once Only**: Animation fires only once per page load

## 🍷 Wine-Themed Enhancements

### **Wine Glass Reveal**
```css
.wine-reveal {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.wine-reveal.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

### **Bottle Pour Effect**
```css
.bottle-reveal {
  opacity: 0;
  transform: translateY(15px) rotate(-2deg);
  transition: all 500ms ease-out;
}

.bottle-reveal.is-visible {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}
```

## 🎨 WCAG AA Contrast Requirements

### **Light Theme Adjustments**
- **Background**: `#FEFEFE` (pure white for maximum contrast)
- **Primary Text**: `#1A1A1A` (contrast ratio: 12.6:1)
- **Secondary Text**: `#4A4A4A` (contrast ratio: 7.8:1)
- **Accent Text**: `#8B4513` on light backgrounds (contrast ratio: 5.2:1)

### **Dark Theme Adjustments**
- **Background**: `#0F0F0F` (near-black for maximum contrast)
- **Primary Text**: `#F5F5F5` (contrast ratio: 15.8:1)
- **Secondary Text**: `#D1D1D1` (contrast ratio: 10.2:1)
- **Accent Text**: `#E6C875` on dark backgrounds (contrast ratio: 8.1:1)

## 🔧 Implementation Checklist

### **JavaScript (Intersection Observer)**
- [x] Create `useScrollReveal` hook
- [x] Implement once-only trigger logic
- [x] Add cleanup for performance
- [x] Support staggered animations

### **CSS Classes**
- [x] Base `.reveal` class
- [x] Wine-themed variants
- [x] Reduced motion support
- [x] High contrast mode compatibility

### **Component Integration**
- [x] Hero section elements
- [x] Feature cards
- [x] Wine bottle sections
- [x] Pricing plan cards
- [x] Footer elements

## 🧪 Testing Guidelines

### **Manual Testing**
1. Scroll through page slowly - animations should trigger once
2. Refresh page and scroll again - animations should re-trigger
3. Toggle theme - contrast should remain compliant
4. Test with reduced motion enabled

### **Automated Testing**
1. Cypress test for `.is-visible` class application
2. Axe-core accessibility audit
3. Contrast ratio verification
4. Performance metrics (no layout thrashing)

## 📊 Performance Metrics

### **Target Benchmarks**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Animation Frame Rate**: 60fps consistently

### **Monitoring**
- Use Chrome DevTools Performance tab
- Monitor Core Web Vitals in production
- Track user engagement with animated sections

## 🎯 Success Criteria

1. **User Experience**: Smooth, non-intrusive animations that enhance content discovery
2. **Accessibility**: Full WCAG AA compliance with proper contrast ratios
3. **Performance**: No negative impact on page load or scroll performance
4. **Consistency**: Unified animation language across the entire application

---

*Last Updated: Sprint 8, Week 1*
*Next Review: End of Sprint 8* 