import { defineConfig } from 'astro/config';

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
  }
});
