import { URL, fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'skrib - Markdown Only',
        short_name: 'skrib',
        description: 'Configurable Markdown editor',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@/': fileURLToPath(new URL('./src/', import.meta.url)) + '/',
      '#styles': fileURLToPath(new URL('./src/styles', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          '@codemirror': [
            '@codemirror/autocomplete',
            '@codemirror/commands',
            '@codemirror/state',
            '@codemirror/search',
            '@codemirror/view',
            '@codemirror/language-data',
            '@codemirror/language'
          ],
          '@lezer': [
            '@lezer/common',
            '@lezer/python',
            '@lezer/highlight',
            '@lezer/cpp',
            '@lezer/rust'
          ]
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/globals" as *;\n`
      }
    }
  }
})
