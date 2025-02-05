import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  build: {
    target: 'esnext',
    ssr: true,
    rollupOptions: {
      input: 'src/server-edge.ts',
      output: {
        format: 'es'
      },
      external: [
        'formidable',
        'express',
        'node:stream',
        'node:stream/promises',
        'fs',
        'path',
        'spotify-web-api-node',
        /\.css$/
      ]
    }
  },
  ssr: {
    noExternal: ['@tanstack/react-router', '@tanstack/start'],
    external: [/\.css$/, /\.scss$/, /\.sass$/, /\.less$/, /\.styl$/]
  },
  optimizeDeps: {
    exclude: ['*.css']
  }
}) 