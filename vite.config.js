import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ogl': ['ogl'],
          'vendor-lenis': ['lenis'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false,
    host: true
  }
});

