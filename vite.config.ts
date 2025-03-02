import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // より短いチャンク名ではなく、完全なハッシュを使用してキャッシュバスティングを強化
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  server: {
    // 開発サーバーでHTTPヘッダーを設定して、ブラウザのキャッシュを無効化
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  },
});
