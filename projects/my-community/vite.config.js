import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-first-website/my-community/',
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
