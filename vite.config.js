import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local builds use '/'. The Pages workflow sets VITE_BASE_PATH to /<repo>/.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
