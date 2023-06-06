import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: true,
    port: 3005,
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        pathRewrite: {
          '^api': '/api'
        }
      }
    }
  }
})
