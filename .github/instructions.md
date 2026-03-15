# AI Agent Instructions for Santi Living

## Architecture Overview

**Santi Living** is a monorepo managed by **Turborepo** containing:

- **apps/web**: Frontend application built with **Astro** + **React** islands.
- **apps/proxy**: Backend service built with **Node.js** + **Express** + **tRPC** (bridge to Sync ERP).
- **Core Principles**: Mobile-First, WhatsApp-First (Final Gate for conversions), Zero Cognitive Load.

## Key Patterns

### Frontend (`apps/web`)

- **Framework**: Astro 5.x. Default to `.astro` files for static content. Use React (`.tsx`) **only** for interactive islands (e.g., Checkout, Calculator).
- **State Management**: Use **Nanostores** (`@nanostores/react`) for sharing state between islands or React components. Avoid Context API if possible.
- **Styling**: **Tailwind CSS v4**. Use utility classes.
- **Checkout Flow**: The checkout logic is centralized in specific islands to handle state.
- **Midtrans Snap**:
  - Use `window.snap.embed` for unified payment UI.
  - **Critical**: For QRIS, use `enabled_payments: ["other_qris"]` to ensure correct rendering (see `memory.md`).

### Backend (`apps/proxy`)

- **Framework**: Express with TypeScript.
- **Communication**: Exposes **tRPC** routers for the frontend to consume.
- **Midtrans**: Handles token generation and webhook processing.
- **Validation**: Use **Zod** for all input/output validation.

## Development Workflow

### Commands

| Command             | Action          | Description                              |
| :------------------ | :-------------- | :--------------------------------------- |
| `npm run dev`       | **Start All**   | Runs `turbo run dev` (Web + Proxy)       |
| `npm run build`     | **Build All**   | Runs `turbo run build`                   |
| `npm run typecheck` | **Check Types** | Runs `tsc` and `astro check` across apps |
| `npm run lint`      | **Linting**     | Runs ESLint                              |

### Debugging

- **Proxy Logs**: Check terminal output for `[Midtrans]` or `[Proxy]` tagged logs.
- **Web Logs**: Browser console for Snap/Frontend issues.

## Do's and Don'ts

### ✅ Do

- **Mobile First**: Always design/code for **375px viewport** first.
- **Touch Targets**: Ensure buttons/inputs are at least **44x44px**.
- **Type Safety**: strict TypeScript usage. No `any`. Share types via `packages/*` or tRPC router exports.
- **Dependencies**: Use `npm install` at root (workspaces logic).

### ❌ Don't

- **Don't hardcode URLs**: Use environment variables (e.g., `PUBLIC_API_URL`).
- **Don't mix styling**: Stick to Tailwind. Avoid CSS modules unless necessary for complex animations.
- **Don't over-engineer**: Santi Living values simplicity. Follow "Zero Cognitive Load".

## Key Files Reference

- `.agent/rules/constitution.md` - Core product principles (Authority).
- `.github/memory.md` - Technical decisions and known issues.
- `apps/web/src/scripts/checkout.ts` - Payment logic implementation.
- `apps/proxy/src/services/midtrans-client.ts` - Midtrans backend service.
