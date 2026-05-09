import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/churasumu-/',
  build: {
    outDir: 'docs',
    target: ['es2020', 'safari14', 'ios14'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
