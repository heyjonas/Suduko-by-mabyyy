import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Sudoku by Mabyyy',
        short_name: 'Sudoku',
        description: 'A fun and challenging Sudoku game',
        theme_color: '#f59e0b',
        background_color: '#fef3c7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist'
  },
  server: {
    fs: {
      allow: ['.']
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});