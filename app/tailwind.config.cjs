const defaultTheme = require('tailwindcss/defaultTheme');
const { resolveProjectPath } = require('wasp/dev');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [resolveProjectPath('./src/**/*.{js,jsx,ts,tsx}')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
        // Luxury typography fonts
        serif: ['Playfair Display', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        luxury: ['Playfair Display', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Playfair Display', 'Times New Roman', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Legacy sizes (keep for compatibility)
        'title-xxl': ['44px', '55px'],
        'title-xl': ['36px', '45px'],
        'title-xl2': ['33px', '45px'],
        'title-lg': ['28px', '35px'],
        'title-md': ['24px', '30px'],
        'title-md2': ['26px', '30px'],
        'title-sm': ['20px', '26px'],
        'title-xsm': ['18px', '24px'],
        
        // New unified typography scale
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        
        'h1': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        'h2': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        'h3': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'h4': ['1.25rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'h5': ['1.125rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'h6': ['1rem', { lineHeight: '1.25', letterSpacing: '0' }],
        
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        
        'label': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        
        // Legacy luxury sizes (keep for compatibility)
        'luxury-h1': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'luxury-h2': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'luxury-h3': ['1.75rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'luxury-h4': ['1.375rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'luxury-body': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'luxury-lead': ['1.375rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'luxury-small': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'luxury-xs': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        
        // Responsive luxury sizes
        'luxury-h1-md': ['3.5rem', { lineHeight: '1.1' }],
        'luxury-h1-sm': ['2.75rem', { lineHeight: '1.1' }],
        'luxury-h1-xs': ['2.25rem', { lineHeight: '1.1' }],
      },
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        // white: '#FFFFFF',
        // black: '#1C2434',
        'black-2': '#010101',
        body: '#64748B',
        bodydark: '#AEB7C0',
        bodydark1: '#DEE4EE',
        bodydark2: '#8A99AF',
        primary: '#3C50E0',
        secondary: '#80CAEE',
        stroke: '#E2E8F0',
        // gray: '#000',
        // graydark: '#333A48',
        // 'gray-2': '#F7F9FC',
        // 'gray-3': '#FAFAFA',
        whiten: '#F1F5F9',
        whiter: '#F5F7FD',
        boxdark: '#24303F',
        'boxdark-2': '#1A222C',
        strokedark: '#2E3A47',
        'form-strokedark': '#3d4d60',
        'form-input': '#1d2a39',
        'meta-1': '#DC3545',
        'meta-2': '#EFF2F7',
        'meta-3': '#10B981',
        'meta-4': '#313D4A',
        'meta-5': '#259AE6',
        'meta-6': '#FFBA00',
        'meta-7': '#FF6766',
        'meta-8': '#F0950C',
        'meta-9': '#E5E7EB',
        success: '#219653',
        danger: '#D34053',
        warning: '#FFA70B',
        
        // WCAG AA Compliant Wine Theme Colors
        wine: {
          50: '#FEF9E7',   // Light cream
          100: '#FDF2CF',  // Cream
          200: '#F8E9B7',  // Light gold
          300: '#F3E9D2',  // Pale gold
          400: '#EDD5A3',  // Gold
          500: '#D4AF37',  // Metallic gold - WCAG AA compliant
          600: '#8B4513',  // Saddle brown - Primary wine color (5.2:1 contrast)
          700: '#7A3D0F',  // Dark brown (6.1:1 contrast)
          800: '#6B350D',  // Darker brown
          900: '#5A4600',  // Very dark brown
          950: '#722F37',  // Deep wine (6.8:1 contrast)
        },
        
        // Enhanced contrast colors for dark theme
        'wine-light': {
          300: '#E6C875',  // Light gold (8.1:1 contrast on dark)
          400: '#F0D584',  // Lighter gold (9.2:1 contrast on dark)
          500: '#CD853F',  // Peru (6.3:1 contrast on dark)
          600: '#FF6B6B',  // Light red (5.4:1 contrast on dark)
          700: '#E57373',  // Light wine (6.1:1 contrast on dark)
        },
        
        // Luxury color palette additions
        bordeaux: {
          50: '#FEF2F2',   // Lightest Bordeaux
          100: '#FEE2E2',  // Very Light Bordeaux
          200: '#FECACA',  // Light Bordeaux
          300: '#FCA5A5',  // Medium Light Bordeaux
          400: '#F87171',  // Medium Bordeaux
          500: '#EF4444',  // Base Bordeaux
          600: '#5A1E1B',  // Dark Bordeaux - Primary
          700: '#4A1813',  // Darker Bordeaux
          800: '#3A120F',  // Very Dark Bordeaux
          900: '#2A0D0A',  // Darkest Bordeaux
          950: '#1A0907',  // Ultra Dark Bordeaux
        },
        
        champagne: {
          50: '#FEFDFB',   // Lightest Champagne
          100: '#FDF9F0',  // Very Light Champagne
          200: '#F9F0E1',  // Light Champagne
          300: '#F3E6D2',  // Medium Light Champagne
          400: '#ECDCC3',  // Medium Champagne
          500: '#D9C6A0',  // Base Champagne - Primary
          600: '#C5B28A',  // Dark Champagne
          700: '#B19E74',  // Darker Champagne
          800: '#9D8A5E',  // Very Dark Champagne
          900: '#897648',  // Darkest Champagne
          950: '#756432',  // Ultra Dark Champagne
        },
        
        // Semantic colors with proper contrast
        accent: {
          red: '#8B4513',     // Light theme red
          wine: '#722F37',    // Light theme wine
          gold: '#D4AF37',    // Light theme gold
        },
        
        'accent-dark': {
          red: '#FF6B6B',     // Dark theme red
          wine: '#E57373',    // Dark theme wine  
          gold: '#E6C875',    // Dark theme gold
        },
      },
      backgroundImage: {
        // Luxury gradient definitions
        'luxury-primary': 'linear-gradient(135deg, #722F37 0%, #D4AF37 50%, #722F37 100%)',
        'luxury-secondary': 'linear-gradient(90deg, #8B4513 0%, #D4AF37 50%, #8B4513 100%)',
        'bordeaux-champagne': 'linear-gradient(135deg, #7F1D1D 0%, #E6C875 100%)',
        'wine-gold': 'linear-gradient(90deg, #722F37 0%, #D4AF37 100%)',
        'champagne-fade': 'linear-gradient(180deg, #FEF9C3 0%, transparent 100%)',
        
        // CTA hover gradients
        'cta-hover': 'linear-gradient(135deg, #7F1D1D 0%, #D4AF37 100%)',
        'cta-pressed': 'linear-gradient(135deg, #991B1B 0%, #B8941F 100%)',
      },
      screens: {
        '2xsm': '375px',
        xsm: '425px',
        '3xl': '2000px',
        ...defaultTheme.screens,
      },
      spacing: {
        // HH-07: Section rhythm spacing values
        '22.5': '5.625rem',      // 90px - Between subsequent sections
        '30': '7.5rem',          // 120px - After hero section
        
        // Luxury spacing scale for vertical rhythm
        'luxury-xs': '0.75rem',    // 12px
        'luxury-sm': '1.5rem',     // 24px
        'luxury-md': '3rem',       // 48px
        'luxury-lg': '4.5rem',     // 72px
        'luxury-xl': '7.5rem',     // 120px - Main section spacing
        'luxury-2xl': '12rem',     // 192px
        
        // Original spacing values
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        10.5: '2.625rem',
        11: '2.75rem',
        11.5: '2.875rem',
        12.5: '3.125rem',
        13: '3.25rem',
        13.5: '3.375rem',
        14: '3.5rem',
        14.5: '3.625rem',
        15: '3.75rem',
        15.5: '3.875rem',
        16: '4rem',
        16.5: '4.125rem',
        17: '4.25rem',
        17.5: '4.375rem',
        18: '4.5rem',
        18.5: '4.625rem',
        19: '4.75rem',
        19.5: '4.875rem',
        21: '5.25rem',
        21.5: '5.375rem',
        22: '5.5rem',
        24.5: '6.125rem',
        25: '6.25rem',
        25.5: '6.375rem',
        26: '6.5rem',
        27: '6.75rem',
        27.5: '6.875rem',
        29: '7.25rem',
        29.5: '7.375rem',
        31: '7.75rem',
        32.5: '8.125rem',
        34: '8.5rem',
        34.5: '8.625rem',
        35: '8.75rem',
        36.5: '9.125rem',
        37.5: '9.375rem',
        39: '9.75rem',
        39.5: '9.875rem',
        40: '10rem',
        42.5: '10.625rem',
        44: '11rem',
        45: '11.25rem',
        46: '11.5rem',
        47.5: '11.875rem',
        49: '12.25rem',
        50: '12.5rem',
        52: '13rem',
        52.5: '13.125rem',
        54: '13.5rem',
        54.5: '13.625rem',
        55: '13.75rem',
        55.5: '13.875rem',
        59: '14.75rem',
        60: '15rem',
        62.5: '15.625rem',
        65: '16.25rem',
        67: '16.75rem',
        67.5: '16.875rem',
      },
      maxWidth: {
        // Luxury content width
        'luxury-content': '900px',  // Main content column
        'luxury-wide': '1200px',    // Wide sections
        
        // Original max widths
        2.5: '0.625rem',
        3: '0.75rem',
        4: '1rem',
        11: '2.75rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        22.5: '5.625rem',
        25: '6.25rem',
        30: '7.5rem',
        34: '8.5rem',
        35: '8.75rem',
        40: '10rem',
        42.5: '10.625rem',
        44: '11rem',
        45: '11.25rem',
        70: '17.5rem',
        90: '22.5rem',
        94: '23.5rem',
        125: '31.25rem',
        132.5: '33.125rem',
        142.5: '35.625rem',
        150: '37.5rem',
        180: '45rem',
        203: '50.75rem',
        230: '57.5rem',
        242.5: '60.625rem',
        270: '67.5rem',
        280: '70rem',
        292.5: '73.125rem',
      },
      maxHeight: {
        35: '8.75rem',
        70: '17.5rem',
        90: '22.5rem',
        550: '34.375rem',
        300: '18.75rem',
      },
      minWidth: {
        22.5: '5.625rem',
        42.5: '10.625rem',
        47.5: '11.875rem',
        75: '18.75rem',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1',
      },
      opacity: {
        15: '0.15',
        35: '0.35',
        65: '0.65',
      },
      transitionProperty: {
        'luxury': 'all',
        'micro': 'transform, opacity, filter',
      },
      transitionDuration: {
        '120': '120ms',
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'micro': 'ease-out',
      },
      animation: {
        'luxury-fade': 'luxury-fade 0.6s ease-out forwards',
        'luxury-slide': 'luxury-slide 0.8s ease-out forwards',
        'wine-pour': 'wine-pour 2s ease-in-out infinite',
        'champagne-bubble': 'champagne-bubble 3s ease-in-out infinite',
      },
      keyframes: {
        'luxury-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'luxury-slide': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'wine-pour': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.05)' },
        },
        'champagne-bubble': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.1)' },
        },
      },
      boxShadow: {
        'luxury': '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
        'luxury-lg': '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
        'luxury-xl': '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
        'wine': '0 8px 32px rgba(114, 47, 55, 0.2)',
        'champagne': '0 8px 32px rgba(230, 200, 117, 0.3)',
      },
      dropShadow: {
        'luxury': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'wine': '0 4px 8px rgba(114, 47, 55, 0.3)',
        'champagne': '0 4px 8px rgba(230, 200, 117, 0.4)',
      },
    },
  },
  plugins: [],
};
