import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    server: {
      deps: {
        inline: ['@ionic/angular', '@ionic/core'],
      },
    },
  },
  resolve: {
    alias: {
      '@ionic/core/loader': '@ionic/core/loader/index.js',
      '@ionic/core/components': '@ionic/core/components/index.js',
    },
  },
}));
