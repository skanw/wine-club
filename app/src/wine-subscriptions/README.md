# 🍷 Premium Wine Subscription Page

## Overview
A haute couture subscription page featuring sophisticated design with interchangeable red/white wine themes, built following luxury brand sensibilities.

## Features

### 🎨 **Dual Theme System**
- **Red Wine Theme**: Deep Bordeaux (#5A1E1B) with elegant crimson accents
- **White Wine Theme**: Pale Gold (#F3E9D2) with warm taupe highlights
- Instant theme switching with smooth CSS transitions

### 📱 **Responsive Luxury Design**
- Generous whitespace and spatial luxury
- Centered content column (max 900px) with full-bleed hero imagery
- Mobile-first responsive design with elegant breakpoints

### ✨ **Premium Animations**
- Wine-themed scroll animations (pour, swirl, reveal effects)
- Smooth hover interactions with lift and scale effects
- Staggered entrance animations for content sections

### 🏗️ **Component Architecture**

#### **Hero Section**
- Full-viewport gradient background with parallax effect
- Translucent content panel with backdrop blur
- Theme-aware overlay colors and call-to-action buttons

#### **Benefits Grid**
- Three-column layout showcasing value propositions
- Icon-based visual hierarchy with hover animations
- Expert curation, perfect delivery, and learning focus

#### **Featured Bottles**
- Tabbed interface for red/white wine collections
- Alternating layouts with high-quality bottle imagery
- Tasting notes with elegant tag system
- Premium wine selections with detailed descriptions

#### **Subscription Plans**
- Theme-aware plan cards with accent borders
- Clear pricing hierarchy with serif typography
- Feature lists with checkmark indicators
- Hover effects with color-coded highlights

#### **Newsletter Footer**
- Theme-integrated background colors
- Elegant input styling with rounded corners
- Seamless integration with overall design language

## Typography

### **Headline Font**: Inter (Geometric Sans-serif)
- 48px H1, 32px H2, 24px H3
- Tight line-height (1.1) for impact
- Letter-spacing optimization (-0.02em to -0.03em)

### **Body Font**: Georgia (Humanist Serif)
- 18px base size with 1.6 line-height
- Elegant readability for wine descriptions

### **Microcopy**: Inter (Clean Sans-serif)
- Uppercase navigation with wide tracking (0.1em)
- 14px labels and navigation elements

## Color Palette

### **Base Neutrals**
```css
--bg-primary: #F9F7F1;     /* Soft ivory */
--bg-secondary: #FFFFFF;    /* Pure white */
--text-primary: #333333;    /* Anthracite */
--text-secondary: #4A4A4A;  /* Charcoal */
--text-muted: #7A7A7A;      /* Warm gray */
```

### **Red Wine Theme**
```css
--accent-primary: #5A1E1B;  /* Deep Bordeaux */
--accent-secondary: #8B2E2A; /* Bordeaux accent */
--accent-text: #FFFFFF;      /* Pure white */
--hero-overlay: rgba(90, 30, 27, 0.2);
```

### **White Wine Theme**
```css
--accent-primary: #F3E9D2;  /* Pale gold */
--accent-secondary: #E6D4B7; /* Gold accent */
--accent-text: #7A6651;      /* Warm taupe */
--hero-overlay: rgba(243, 233, 210, 0.3);
```

## Interactive Elements

### **Theme Toggle**
- Sticky positioned at top of page
- Pill-shaped toggle with smooth transitions
- Active state with shadow and transform effects

### **Hover Effects**
- **Buttons**: Scale (1.03x) + shadow fade-in
- **Images**: Subtle zoom (1.05x) on bottle images
- **Cards**: Lift (-5px translateY) with enhanced shadows

### **Scroll Animations**
- **Wine Pour**: Vertical scale animation from top
- **Wine Swirl**: Rotation with scale for dynamic entrance
- **Fade Slide**: Smooth opacity with horizontal movement

## Technical Implementation

### **CSS Architecture**
- CSS Custom Properties for theme switching
- Modular component-based styling
- Responsive breakpoints at 768px
- Hardware-accelerated animations

### **React Components**
- TypeScript interfaces for type safety
- Custom hooks for scroll animations
- State management for theme switching
- Modular data structures for wines and plans

### **Performance Optimizations**
- Lazy loading for bottle images
- Optimized SVG graphics for wine bottles
- Efficient CSS transitions and transforms
- Minimal JavaScript bundle impact

## Usage

### **Navigation**
Access via: `/premium-subscription`

### **Theme Switching**
```typescript
const [activeTheme, setActiveTheme] = useState<'red' | 'white'>('red');

useEffect(() => {
  document.body.className = `theme-${activeTheme}`;
}, [activeTheme]);
```

### **Scroll Animations**
```typescript
const heroAnimation = useScrollAnimation({ 
  animationClass: 'animate-wine-reveal',
  delay: 200 
});
```

## Brand Integration

### **Wine Bottle Graphics**
- Custom SVG illustrations matching theme colors
- Realistic bottle proportions with cork and foil details
- Theme-appropriate wine colors (red vs. white/champagne)
- Professional labeling with vintage years

### **Content Strategy**
- Premium wine selections (Château Margaux, Dom Pérignon)
- Authentic tasting notes and vineyard information
- Luxury pricing tiers with clear value propositions
- Sommelier-focused messaging throughout

## Accessibility

### **WCAG AA Compliance**
- High contrast color ratios
- Screen reader friendly navigation
- Keyboard accessibility for all interactive elements
- Semantic HTML structure with proper headings

### **Mobile Experience**
- Touch-friendly button sizes (44px minimum)
- Readable typography at all screen sizes
- Simplified layouts for mobile consumption
- Optimized images for various device densities

---

**Created with**: React + TypeScript + CSS Custom Properties  
**Design Philosophy**: Haute couture meets modern web standards  
**Performance**: Optimized for Core Web Vitals compliance 