# Implementation Plan: Santi Living - Website Sewa Kasur Jogja

**Branch**: `001-seo-living-marketing` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-seo-living-marketing/spec.md`

## Summary

Website sewa kasur Jogja dengan fokus **conversion to WhatsApp**. Single-page landing dengan kalkulator sewa real-time dan WhatsApp auto-compose. Static site menggunakan Astro untuk performa optimal (< 2 detik load time) dan SEO lokal. Tanpa backend custom di MVP - form data ke Google Sheets.

## Technical Context

**Language/Version**: TypeScript 5.x, HTML5, CSS3  
**Primary Dependencies**: Astro 4.x (static site generator), Vanilla CSS  
**Storage**: N/A (Phase 1 MVP) - Form data via Google Sheets API / Airtable  
**Testing**: Playwright (E2E), Vitest (unit)  
**Target Platform**: Web (Mobile-first, responsive desktop)  
**Project Type**: Web - Static site (single project)  
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals "Good")  
**Constraints**: LCP < 2.5s on mobile 3G, bundle size < 100KB (critical path)  
**Scale/Scope**: Single landing page, ~5-20 orders/day target

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                      | Check                                             | Status  |
| ------------------------------ | ------------------------------------------------- | ------- |
| **I. Mobile-First**            | Design starts from 375px, touch targets ≥44px     | ✅ Pass |
| **II. One Intent, One Page**   | Single-page linear scroll, CTA above fold         | ✅ Pass |
| **III. Zero Cognitive Load**   | Minimal form fields, no dropdowns, kalimat pendek | ✅ Pass |
| **IV. WhatsApp as Final Gate** | All conversion ends at WA auto-compose            | ✅ Pass |

**MVP Scope Compliance**:

- ✅ Landing Page dengan Hero + CTA
- ✅ Trust Signals (foto, area, testimoni)
- ✅ Kalkulator Sewa (real-time pricing)
- ✅ Pre-Booking Form (minimal fields)
- ✅ WhatsApp Auto-Compose

**Prohibited Items Check**:

- ❌ Login user - Not included
- ❌ Payment gateway - Not included
- ❌ Real-time stok - Not included
- ❌ Blog SEO panjang - Not included
- ❌ Chatbot - Not included

**Result**: ✅ All gates passed

## Project Structure

### Documentation (this feature)

```text
specs/001-seo-living-marketing/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for static site)
│   └── README.md        # Explanation why no API contracts
├── checklists/
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/          # Astro components
│   ├── Hero.astro
│   ├── PriceList.astro
│   ├── Calculator.astro
│   ├── HowToRent.astro
│   ├── ServiceArea.astro
│   ├── Testimonials.astro
│   ├── BookingForm.astro
│   ├── WhatsAppButton.astro
│   └── StickyWhatsApp.astro
├── layouts/
│   └── MainLayout.astro
├── pages/
│   └── index.astro      # Single landing page
├── scripts/
│   ├── calculator.ts    # Calculator logic
│   ├── form-validation.ts
│   └── whatsapp-compose.ts
├── styles/
│   ├── global.css       # Design system
│   ├── components/      # Component-specific styles
│   └── utilities.css    # Utility classes
├── data/
│   ├── products.json    # Mattress types & prices
│   ├── areas.json       # Service areas
│   └── testimonials.json
└── assets/
    └── images/          # Optimized product photos

public/
├── favicon.ico
├── robots.txt
└── sitemap.xml

astro.config.mjs
package.json
tsconfig.json
```

**Structure Decision**: Single Astro project (static site) dengan component-based architecture. Tidak ada backend folder karena MVP menggunakan external services (Google Sheets) untuk form submission.

## Complexity Tracking

> No violations - all implementations align with constitution principles.

| Decision                      | Rationale                                                      | Alternative Considered                                        |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| Astro over Next.js            | Simpler, better performance for static content, smaller bundle | Next.js adds SSR complexity not needed for MVP                |
| Google Sheets over custom API | Zero backend maintenance, instant setup                        | Custom API adds hosting cost and complexity                   |
| Vanilla CSS over Tailwind     | Full control, smaller CSS, aligns with design system approach  | Tailwind requires build config, utility bloat for simple site |
