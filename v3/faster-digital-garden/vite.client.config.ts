import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: 'index.html'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
}) 