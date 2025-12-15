/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  build: {
    target: 'esnext',
  },

  server: {
    port: 3000,
  },

  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/_index.scss" as *;`,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
