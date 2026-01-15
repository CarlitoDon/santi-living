import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://santiliving.com',
  output: 'server', // SSR mode - needed for dynamic routes like /pesanan/[token]
  adapter: vercel(),
  integrations: [react()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
});
