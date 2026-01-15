# AI Agent Instructions for santi-living

## Architecture Overview

`santi-living` is a hybrid monorepo containing a main Astro website and two support microservices.

**Structure:**

- **Root (Frontend)**: Astro + React + Nanostores. Located in `src/`. Serves the landing page and rental interface.
- **Bot Service**: `apps/bot-service`. Node.js + `whatsapp-web.js`. Handles WhatsApp automation.
- **ERP Service**: `apps/erp-service`. Node.js + Express + Midtrans. Acts as a bridge between the frontend and the external Sync ERP.

## Key Patterns

### 1. Frontend (Astro + React)

- **Hybrid Rendering**: Uses Astro for static content (SEO) and React for interactive islands (Booking Form, Calculator).
- **State Management**: Uses `nanostores` for shared state between Astro and React components.
- **Styling**: Tailwind CSS (globally applied).
- **API**: `src/services/` contains typed wrappers for API calls (e.g., `erp-api.ts`).

### 2. Services

- **Bot Service**: Standalone Express app. Uses `whatsapp-web.js` for "Puppeteer-like" WhatsApp automation.
- **ERP Service**: Proxy/Bridge. Validates requests from Frontend -> Forwards to Sync ERP -> Handle Payments (Midtrans).

### 3. Development Flow

- **Concurrent Start**: `npm run dev` in root starts ALL services (Frontend + Bot + Sync Service) via `concurrently`.
- **Ports**:
  - Frontend: `4321` (default Astro) or `3000`
  - Bot Service: Check `apps/bot-service/src/index.ts`
  - ERP Service: Check `apps/erp-service/src/index.ts`

## Development Workflow

- **Start All**: `npm run dev` (Recommended)
- **Start Bot Only**: `npm run dev:bot`
- **Start Sync Only**: `npm run dev:sync`
- **Build**: `npm run build` (Builds Astro only)

## Do's and Don'ts

- **DO** use `npm run dev` to ensure all inter-dependent services are running.
- **DO** check `apps/*/package.json` for service-specific dependencies.
- **DON'T** put business logic in Astro components if it belongs in the `erp-service` (keep frontend dumb).
- **DON'T** modify `whatsapp-web.js` internals unless necessary; wrap logic in service handlers.

## Key Files Reference

- **Root Config**: `package.json`, `astro.config.mjs`
- **ERP API Wrapper**: `src/services/erp-api.ts`
- **Bot Entry**: `apps/bot-service/src/index.ts`
- **ERP Service Entry**: `apps/erp-service/src/index.ts`
