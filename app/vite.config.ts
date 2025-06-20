import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    open: true,
    fs: {
      // Allow serving files from one level up to enable access to .wasp/out/sdk modules.
      allow: [
        // Current directory (web-app root after merge).
        path.resolve(__dirname, '.'),
        // One level up (allows .wasp/out path).
        path.resolve(__dirname, '..'),
      ],
    },
  },
})
