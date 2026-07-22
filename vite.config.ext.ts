import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// This is a separate Vite config specifically for building the Chrome Extension.
// We output to a 'dist-ext' folder so we don't overwrite the main web app's 'dist' folder.
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist-ext',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
