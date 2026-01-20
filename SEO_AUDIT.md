# SEO Deep Analysis Report: Santi Living

**Repository**: `santi-living`
**Branch**: `001-seo-living-marketing`
**Date**: 2026-01-20

## 1. Executive Summary

The codebase allows for basic SEO but lacks automation and deeper optimization properties required for a competitive edge in "Sewa Kasur Jogja". The structure is semantically sound, but critical technical SEO elements like **Canonical Tags** and **Automated Sitemaps** are missing.

---

## 2. Audit Findings

### ✅ Strengths

- **Semantic HTML**: Proper use of `<h1`> in Hero and `<h2>` in sections.
- **Basic Meta Tags**: Title, Description, Keywords, and Robots are present in `MainLayout.astro`.
- **Open Graph / Twitter Cards**: Implemented with fallback images.
- **Initial JSON-LD**: A basic `LocalBusiness` schema is injected.

### ⚠️ Critical Gaps (High Priority)

1.  **Missing Canonical URL**:
    - **Issue**: `MainLayout.astro` does not define `<link rel="canonical">`.
    - **Risk**: Duplicate content penalties if parameters are used (e.g., `?source=ig`).
2.  **Manual Sitemap**:
    - **Issue**: `public/sitemap.xml` is a static file and `astro.config.mjs` lacks `@astrojs/sitemap`.
    - **Risk**: New pages won't be indexed automatically.
3.  **Hardcoded OG Image**:
    - **Issue**: `MainLayout` hardcodes `og-cover.jpg`.
    - **Risk**: Specific pages (like blog posts or product details) won't show relevant previews.
4.  **Basic JSON-LD**:
    - **Issue**: Missing `sameAs` (social links), `image`, and `priceRange` is generic.

### ℹ️ Opportunities (Medium Priority)

- **Image Optimization**: Verify usage of `<Image />` from `astro:assets` to ensure WebP conversion and proper sizing.
- **Robots.txt**: Currently static. Can be generated dynamically if site structure becomes complex.

---

## 3. SEO Optimization Plan

### Phase 1: Technical SEO Core (Immediate)

- [ ] **Install `@astrojs/sitemap`**: Automate sitemap generation.
- [ ] **Add Canonical Tag**: Update `MainLayout.astro` to dynamically generate canonical links.
- [ ] **Enhance JSON-LD**: specific `LocalBusiness` schema improvements.

### Phase 2: Content & Meta Enhancements

- [ ] **Dynamic OG Images**: Allow passing `image` prop to `MainLayout`.
- [ ] **Page-Specific Meta**: Ensure `index.astro` and others pass unique titles/descriptions.

### Phase 3: Performance & Assets

- [ ] **Image Audit**: Replace standard `<img>` with Astro's `<Image />` where applicable.
- [ ] **Robots.txt**: update to point to the generated `sitemap-index.xml`.

---

## 4. Implementation Details

### Sitemap Configuration in `astro.config.mjs`

```javascript
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // ...
  integrations: [sitemap()],
  site: "https://santiliving.com",
});
```

### Canonical Tag in `MainLayout.astro`

```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// In <head>
<link rel="canonical" href={canonicalURL} />
```
