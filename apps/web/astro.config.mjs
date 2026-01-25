import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

// Load environment based on mode
// Use VERCEL_ENV (auto-set by Vercel: production/preview/development) for Vercel deployments
// Fall back to NODE_ENV for local development
const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development' | undefined
console.log('--- ASTRO BUILD ENV DEBUG ---');
console.log('process.env.VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('process.env.MIDTRANS_IS_PRODUCTION:', process.env.MIDTRANS_IS_PRODUCTION);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('-----------------------------');

const nodeEnv = process.env.NODE_ENV || 'development';

// Determine which .env file to load
// - On Vercel production: use 'production'
// - On Vercel preview: use 'staging' (our .env.staging maps to preview)
// - Local: use NODE_ENV
let envMode = nodeEnv;
if (vercelEnv === 'production') {
  envMode = 'production';
} else if (vercelEnv === 'preview') {
  envMode = 'staging'; // Map preview to staging
}

console.log('[Astro Config] VERCEL_ENV:', vercelEnv || 'NOT SET (local)');
console.log('[Astro Config] Resolved envMode:', envMode);

const fileEnv = loadEnv(envMode, process.cwd(), '');

// Determine if Midtrans should use production
// Priority: 1. VERCEL_ENV='production', 2. MIDTRANS_IS_PRODUCTION='true'
const clientKey = (process.env.MIDTRANS_CLIENT_KEY || fileEnv.MIDTRANS_CLIENT_KEY || '').replace(/["']/g, "");
const isMidtransProduction = vercelEnv === 'production' || (process.env.MIDTRANS_IS_PRODUCTION === 'true' || fileEnv.MIDTRANS_IS_PRODUCTION === 'true');

// Merge: process.env takes priority over file env
const env = {
  SANTI_PROXY_URL: process.env.SANTI_PROXY_URL || fileEnv.SANTI_PROXY_URL,
  PROXY_API_SECRET: process.env.PROXY_API_SECRET || fileEnv.PROXY_API_SECRET,
  SYNC_ERP_API_URL: process.env.SYNC_ERP_API_URL || fileEnv.SYNC_ERP_API_URL,
  SYNC_ERP_API_SECRET: process.env.SYNC_ERP_API_SECRET || fileEnv.SYNC_ERP_API_SECRET,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || fileEnv.PUBLIC_SITE_URL,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY || fileEnv.MIDTRANS_CLIENT_KEY || '', // No fallback to avoid false prod detection
  MIDTRANS_IS_PRODUCTION: String(isMidtransProduction), // 'true' or 'false'
};

console.log('[Astro Config] SANTI_PROXY_URL:', env.SANTI_PROXY_URL || 'NOT SET');
console.log('[Astro Config] MIDTRANS_IS_PRODUCTION:', env.MIDTRANS_IS_PRODUCTION);

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
      'process.env.MIDTRANS_CLIENT_KEY': JSON.stringify(env.MIDTRANS_CLIENT_KEY),
      'import.meta.env.MIDTRANS_CLIENT_KEY': JSON.stringify(env.MIDTRANS_CLIENT_KEY),
      'import.meta.env.MIDTRANS_IS_PRODUCTION': JSON.stringify(env.MIDTRANS_IS_PRODUCTION),
      'import.meta.env.VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV || 'LOCAL_OR_UNDEFINED'),
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    },

    plugins: [tailwindcss()],

    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok.io']
    }
  },
});