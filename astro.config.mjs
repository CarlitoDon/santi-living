import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

// Load environment based on mode
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://santiliving.com',
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
    },
    define: {
      'process.env.SYNC_ERP_API_URL': JSON.stringify(env.SYNC_ERP_API_URL),
      'process.env.SYNC_ERP_API_SECRET': JSON.stringify(env.SYNC_ERP_API_SECRET),
      'process.env.SANTI_PROXY_URL': JSON.stringify(env.SANTI_PROXY_URL),
      'process.env.PROXY_API_SECRET': JSON.stringify(env.PROXY_API_SECRET),
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  }
});
