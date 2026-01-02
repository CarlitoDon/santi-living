# Quickstart: Santi Living - Website Sewa Kasur Jogja

**Feature**: 001-seo-living-marketing  
**Date**: 2026-01-02

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm
- Git
- Code editor (VS Code recommended)

## Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/CarlitoDon/santi-living.git
cd santi-living

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Website akan berjalan di `http://localhost:4321`

### 3. Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## Project Structure

```
santi-living/
├── src/
│   ├── components/       # Astro components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Routes (index.astro = landing page)
│   ├── scripts/          # Client-side TypeScript
│   ├── styles/           # CSS files
│   ├── data/             # Static JSON data
│   └── assets/           # Images and static files
├── public/               # Static files (favicon, robots.txt)
├── astro.config.mjs      # Astro configuration
├── package.json
└── tsconfig.json
```

## Development Workflow

### Adding/Editing Content

1. **Harga Kasur**: Edit `src/data/products.json`
2. **Area Layanan**: Edit `src/data/areas.json`
3. **Testimoni**: Edit `src/data/testimonials.json`
4. **Konfigurasi Bisnis**: Edit `src/data/config.json`

### Component Development

```bash
# Create new component
touch src/components/MyComponent.astro

# Component structure
---
// Frontmatter (server-side)
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<div class="my-component">
  <h2>{title}</h2>
</div>

<style>
  .my-component { /* styles */ }
</style>
```

### Adding Interactivity (Calculator)

For interactive components, use client-side scripts:

```astro
---
// Calculator.astro
---
<div id="calculator">
  <!-- Calculator HTML -->
</div>

<script>
  // Client-side JavaScript runs in browser
  const calculator = document.getElementById('calculator');
  // Add event listeners, update DOM, etc.
</script>
```

## Testing Scenarios

### Manual Test: Full Conversion Flow

1. Open `http://localhost:4321`
2. Scroll through landing page - verify all sections load
3. Select kasur type in calculator
4. Enter quantity: 2
5. Pick start date (today or future)
6. Enter duration: 3 days
7. Verify total price updates real-time
8. Fill booking form (name, WA, address)
9. Click "Pesan via WhatsApp"
10. Verify WhatsApp opens with pre-filled message

### Checklist: Mobile Responsiveness

- [ ] Hero section readable on 375px width
- [ ] Price cards stack vertically on mobile
- [ ] Calculator form usable with touch
- [ ] Touch targets ≥ 44x44px
- [ ] Sticky WhatsApp button visible
- [ ] No horizontal scroll

### Checklist: Core Web Vitals

```bash
# Build and serve production
npm run build
npm run preview

# Test with Lighthouse in Chrome DevTools
# Target scores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or connect GitHub repo to Vercel for auto-deploy.

### Environment Variables

Tidak ada environment variables yang diperlukan untuk MVP.

Jika nanti menambahkan Google Sheets integration:

```bash
# .env (local only, do not commit)
GOOGLE_SHEETS_API_KEY=your_key_here
GOOGLE_SHEETS_ID=your_sheet_id
```

## Common Tasks

### Update WhatsApp Number

Edit `src/data/config.json`:

```json
{
  "whatsappNumber": "6281234567890"
}
```

### Add New Mattress Type

Edit `src/data/products.json`, add new object:

```json
{
  "id": "king",
  "name": "Kasur King Size",
  "pricePerDay": 60000,
  ...
}
```

### Add New Service Area

Edit `src/data/areas.json`, add new object:

```json
{
  "id": "klaten",
  "name": "Klaten",
  "districts": ["Prambanan", "..."],
  "deliveryNote": "Ongkir Rp 20.000"
}
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .astro
npm install
npm run build
```

### Images Not Loading

- Ensure images are in `src/assets/images/`
- Use Astro's Image component for optimization
- Check file extensions (use .webp for best performance)

### Calculator Not Working

- Check browser console for JavaScript errors
- Ensure script is loaded with `is:inline` or as separate file
- Verify DOM elements have correct IDs

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Project Spec](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
