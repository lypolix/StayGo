import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // подтянет алиасы из tsconfig
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // 🔑 алиасы подтянутся автоматически
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
