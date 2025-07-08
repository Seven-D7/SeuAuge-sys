import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',       // permite acesso via IP local (0.0.0.0)
    port: 5173,       // garante que porta padrão está setada
    strictPort: true,
    allowedHosts: 'all'
  },
});
