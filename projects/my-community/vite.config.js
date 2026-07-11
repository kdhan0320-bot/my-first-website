import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dohan-portfolio/my-community/',
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
