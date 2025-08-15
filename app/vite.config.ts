import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/client/components'),
      '@utils': resolve(__dirname, 'src/client/utils'),
      '@hooks': resolve(__dirname, 'src/client/hooks'),
      '@pages': resolve(__dirname, 'src/client/pages'),
      '@styles': resolve(__dirname, 'src/client/styles'),
      '@static': resolve(__dirname, 'src/client/static'),
    }
  },
  
  // Development optimizations
  server: {
    port: 3000,
    host: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: false
    }
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'date-fns',
      'lodash'
    ]
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Asset handling
  assetsInclude: ['**/*.webp', '**/*.avif'],
  
  // Performance optimizations
  esbuild: {
    target: 'es2015',
    jsx: 'automatic'
  }
})
