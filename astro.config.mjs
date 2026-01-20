import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://santiliving.com',
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  vite: {
    build: {
      cssMinify: true
    }
  },

  integrations: [sitemap()]
});