import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

// Load environment based on mode
// Priority: process.env (Vercel dashboard) > .env files
const mode = process.env.NODE_ENV || 'development';
const fileEnv = loadEnv(mode, process.cwd(), '');

// Merge: process.env takes priority over file env
const env = {
  SANTI_PROXY_URL: process.env.SANTI_PROXY_URL || fileEnv.SANTI_PROXY_URL,
  PROXY_API_SECRET: process.env.PROXY_API_SECRET || fileEnv.PROXY_API_SECRET,
  SYNC_ERP_API_URL: process.env.SYNC_ERP_API_URL || fileEnv.SYNC_ERP_API_URL,
  SYNC_ERP_API_SECRET: process.env.SYNC_ERP_API_SECRET || fileEnv.SYNC_ERP_API_SECRET,
  SYNC_ERP_API_SECRET: process.env.SYNC_ERP_API_SECRET || fileEnv.SYNC_ERP_API_SECRET,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || fileEnv.PUBLIC_SITE_URL,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || fileEnv.MIDTRANS_CLIENT_KEY || 'Mid-client-StayTUBOhdNGsXR4', // Fallback for dev
};

console.log('[Astro Config] NODE_ENV:', mode);
console.log('[Astro Config] SANTI_PROXY_URL:', env.SANTI_PROXY_URL || 'NOT SET');

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://santiliving.com',
  output: 'server', // SSR mode - needed for dynamic routes like /pesanan/[token]
  adapter: vercel(),
  integrations: [react(), sitemap()],
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
      'process.env.PROXY_API_SECRET': JSON.stringify(env.PROXY_API_SECRET),
      'process.env.MIDTRANS_CLIENT_KEY': JSON.stringify(env.MIDTRANS_CLIENT_KEY),
      'import.meta.env.MIDTRANS_CLIENT_KEY': JSON.stringify(env.MIDTRANS_CLIENT_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    plugins: [tailwindcss()]
  },
});