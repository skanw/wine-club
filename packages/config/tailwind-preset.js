module.exports = {
  theme: {
    extend: {
      colors: {
        // White-wine luxury palette
        ivory: '#FBFAF7',
        shell: '#F7F4EE', 
        porcelain: '#EEE9DF',
        champagne: '#E9D9A6',
        chablis: '#DCCB8A',
        'grape-seed': '#6E664C',
        cave: '#2C2A24',
      },
      borderRadius: {
        'card': '28px',
        'hero': '36px',
      },
      boxShadow: {
        'wc': '0 8px 30px rgba(0,0,0,.07)',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display-fluid': 'clamp(2.5rem, 5vw, 4rem)',
        'hero-fluid': 'clamp(1.875rem, 4vw, 3rem)',
      },
    },
  },
  plugins: [],
}
