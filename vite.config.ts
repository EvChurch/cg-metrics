import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/cg-metrics/' : '/',
  build: {
    // Preserve Vite 5's browser targets instead of adopting Vite 8's newer defaults.
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        test: 'test.html',
      },
    },
  },
});
