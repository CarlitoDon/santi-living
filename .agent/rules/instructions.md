---
trigger: model_decision
---

# AI Agent Instructions for Santi Living

## Architecture Overview

**Santi Living** is a mobile-first mattress rental website for Yogyakarta, designed to maximize WhatsApp conversions with minimal friction.

```
santi-living/
├── src/                      # Astro frontend
│   ├── pages/                # Routes (index.astro)
│   ├── components/           # UI components (.astro files)
│   ├── scripts/              # Client-side TypeScript logic
│   ├── data/                 # Static JSON data sources
│   ├── styles/               # Global CSS
│   └── types/                # TypeScript types
├── apps/bot-service/         # WhatsApp automation backend
│   └── src/                  # Express + whatsapp-web.js
├── specs/                    # Feature documentation
└── .agent/                   # AI workflows & rules
    ├── rules/                # constitution.md, memory.md
    └── workflows/            # Development workflows
```

**Tech Stack**:

- **Frontend**: Astro 5.x (static + minimal client JS) + Vanilla TypeScript + Vanilla CSS
- **Backend**: Node.js Express + whatsapp-web.js (bot-service)
- **Data**: Static JSON files (products, config, areas, testimonials)
- **Maps**: Leaflet for location picking
- **No frameworks**: Zero React/Vue/Svelte to maximize performance

## Core Principles (from Constitution)

### 1. Mobile-First (≥80% mobile traffic)

- Design starts at 375px viewport
- Touch targets ≥ 44x44px
- Use correct input types (`type="tel"`, `inputmode="numeric"`)
- Desktop is scaled-up mobile, not separate design

### 2. One Intent, One Page

- Single-scroll landing page answers: price, how to rent, availability, how to order
- No complex navigation or multi-page flows
- CTA visible above the fold

### 3. Zero Cognitive Load

- Short, local language (Indonesian)
- No long marketing copy
- Minimal dropdowns
- Instant visual feedback on interactions

### 4. WhatsApp as Final Gate

- All conversion flows end at WhatsApp
- Forms auto-compose structured WhatsApp messages
- No payment gateway or user login in Phase 1

## Key Patterns

### 1. Vanilla DOM Manipulation (No React)

We use standard DOM APIs for all interactivity.

**State Management**:

```typescript
// Example: src/scripts/calculator.ts
let state: CalculatorState = {
  items: [],
  startDate: null,
  duration: 1,
  total: 0,
  // ... other fields
};

function updateCalculation() {
  // Mutate state
  state.total = calculateTotal();
  // Update DOM
  updateResultPanel();
}
```

**Event Binding**:

```typescript
export function initCalculator() {
  const btn = document.getElementById("btn-submit");
  btn?.addEventListener("click", handleSubmit);
}
```

### 2. Astro Component Architecture

Components are `.astro` files (HTML-like syntax with optional JS frontmatter).

**Component Example**:

```astro
---
// Frontmatter: runs at build time
import config from '@/data/config.json';
const { title } = Astro.props;
---

<section class="hero">
  <h1>{title}</h1>
</section>

<script>
  // Client-side script (runs in browser)
  document.querySelector('.hero')?.addEventListener('click', () => {
    console.log('clicked');
  });
</script>
```

**Key Rules**:

- Frontmatter runs at build time (server-side)
- `<script>` tags run in browser (client-side)
- Use `client:*` directives only when necessary (we avoid them)

### 3. WhatsApp Message Composition

See `src/scripts/whatsapp-compose.ts` for the canonical pattern.

```typescript
import { composeWhatsAppUrl } from "./whatsapp-compose";

const booking = {
  items: state.items,
  startDate: state.startDate,
  duration: state.duration,
  total: state.total,
  name: formData.name,
  address: formData.address,
  notes: formData.notes,
};

const url = composeWhatsAppUrl(booking);
window.open(url, "_blank");
```

### 4. Static JSON Data Sources

All product and config data live in `src/data/*.json`:

- `products.json`: Mattress types, prices, images
- `config.json`: WhatsApp number, bot API settings, delivery config
- `areas.json`: Service areas in Yogyakarta
- `testimonials.json`: Customer reviews

**Importing**:

```typescript
import config from "@/data/config.json";
import products from "@/data/products.json";
```

### 5. Form Validation

See `src/scripts/form-validation.ts` for validation logic.

```typescript
import { validateForm } from "./form-validation";

const isValid = validateForm(formData, showError);
if (!isValid) {
  // Scroll to first error
  return;
}
```

### 6. Geolocation & Distance Calculation

`src/scripts/geolocation.ts` handles:

- Getting user's current location
- Reverse geocoding (coords → address)
- Distance calculation for delivery fee

`src/scripts/map-picker.ts` integrates Leaflet for interactive location selection.

## Development Workflow

### Commands

**Frontend**:

```bash
npm run dev      # Start Astro dev server (localhost:4321)
npm run build    # Build for production
npm run preview  # Preview production build
```

**Bot Service**:

```bash
cd apps/bot-service
npm install
npm run dev      # Start with nodemon + ts-node
npm run start    # Production (requires build)
```

**First-time Bot Setup**:

- Create `apps/bot-service/.env` with `PORT=3000` and `API_SECRET=<secret>`
- Run `npm run dev`
- Scan QR code in terminal with WhatsApp (Linked Devices)

### Key Files to Understand

| File                              | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `src/scripts/calculator.ts`       | Main business logic (cart, pricing, date handling) |
| `src/scripts/whatsapp-compose.ts` | WhatsApp message formatting                        |
| `src/components/Calculator.astro` | Main calculator UI component                       |
| `src/data/products.json`          | Product catalog                                    |
| `.agent/rules/constitution.md`    | Project principles & scope decisions               |

## Do's and Don'ts

### ✅ Do

- **Check Constitution First**: Read `.agent/rules/constitution.md` before adding features
- **Mobile-First Always**: Design/test on 375px viewport first
- **Use TypeScript Strictly**: Avoid `any`, use proper types from `src/types/index.ts`
- **Keep Load Times < 2s**: Optimize images, minimize JS, avoid heavy animations
- **Use Vanilla Patterns**: Standard DOM APIs, no React/Vue/Svelte unless explicitly requested
- **Follow Existing Patterns**: See `calculator.ts` for state management, event handling, validation
- **Use Static JSON**: For data that doesn't change frequently (products, config)
- **End Flows at WhatsApp**: All conversion flows redirect to WhatsApp

### ❌ Don't

- **No Client Frameworks**: Never add React, Vue, or Svelte (violates core architecture)
- **No Backend Database** (Phase 1): Don't set up Postgres/MySQL unless order volume justifies it (>5/day)
- **No User Login**: Don't create authentication (Phase 1 scope)
- **No Payment Gateway**: CS handles payments manually via WhatsApp
- **No Complex Navigation**: Keep single-page scroll experience
- **No Long Marketing Copy**: Use short, local language
- **No Heavy Animations**: Avoid animations that hurt performance or distract users
- **No Cognitive Load**: Avoid dropdowns, multi-step forms, unclear CTAs

## Common Tasks

### Adding a New Product

1. Add entry to `src/data/products.json` with required fields
2. Add product image to `public/images/`
3. Test in calculator to ensure pricing calculates correctly

### Modifying Calculation Logic

1. Edit `src/scripts/calculator.ts`
2. Update `updateCalculation()` function
3. Update `updateResultPanel()` to reflect changes in UI
4. Test across different product combinations

### Changing WhatsApp Message Format

1. Edit `src/scripts/whatsapp-compose.ts`
2. Modify `composeWhatsAppMessage()` function
3. Test with various cart scenarios

### Updating Bot Service

1. Navigate to `apps/bot-service/`
2. Edit `src/index.ts` for API changes
3. Test with frontend by sending requests to bot API

## Testing Guidelines

- **Manual Testing**: Primary method (no automated tests currently)
- **Test on Mobile**: Use browser DevTools mobile emulation (375px)
- **Test WhatsApp Flow**: Verify message composition and link opening
- **Test Calculator**: Various product combinations, dates, durations
- **Test Forms**: Validation, error display, success paths
- **Test Maps**: Location picking, distance calculation, delivery fee

## Performance Targets

- Page load: < 2 seconds
- Core Web Vitals: All "Good" (per constitution)
- Bundle size: Minimal (Astro's island architecture helps)
- Images: Use WebP format, optimize file sizes

## Integration Points

### Frontend ↔ Bot Service

- Frontend calls bot API via fetch to `/api/send-message`
- API requires authentication via `API_SECRET` header
- Bot service sends WhatsApp messages via whatsapp-web.js

### Frontend ↔ External Services

- **Leaflet**: Map tiles from OpenStreetMap
- **WhatsApp**: Deep links via `wa.me` URLs

## Constitution Compliance Checklist

Before merging any feature, verify:

- [ ] Does feature support North Star objective (convert traffic → WhatsApp orders)?
- [ ] Is feature aligned with 4 Core Principles (Mobile-First, One Intent, Zero Cognitive Load, WhatsApp as Gate)?
- [ ] Is feature NOT in the "TIDAK PERLU" (Not Needed) list?
- [ ] Does feature avoid adding cognitive load?

## Workflow Reference

The `.agent/workflows/` directory contains specific workflows:

- `/speckit.*`: Feature planning, specification, implementation workflows
- `/init-agent`: Regenerate this file
- `/memory`: Update project memory with decisions

Invoke workflows with `@[/workflow-name]` in chat.

---

**Version**: 2.0.0 | **Last Updated**: 2026-01-08 | **Aligned with Constitution**: 1.0.0
