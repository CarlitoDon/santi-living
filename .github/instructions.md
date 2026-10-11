# AI Agent Instructions for Santi Living

## Architecture Overview

**Santi Living** is a monorepo containing:

- **apps/web-next**: Sole frontend application built with **Next.js** (App Router) + **React** + **Tailwind CSS**. Deployed to Vercel.
- **apps/proxy**: Backend service built with **Node.js** + **Express** + **tRPC** (bridge to Sync ERP).
- **Core Principles**: Mobile-First, WhatsApp-First (Final Gate for conversions), Zero Cognitive Load.

## Key Patterns

### Frontend (`apps/web-next`)

- **Framework**: Next.js 16 (App Router) with React 19.
- **Content Management**: Notion CMS for blog articles.
- **State Management**: React state / Context where appropriate. Avoid bloated state libraries.
- **Styling**: **Tailwind CSS v4**. Use utility classes.
- **Checkout Flow**: Centralized checkout and order wizard flow (`apps/web-next/src/components/checkout/CheckoutFlow.tsx`).
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
| `npm run dev`       | **Start All**   | Starts frontend development server       |
| `npm run build`     | **Build All**   | Builds `apps/web-next`                   |
| `npm run typecheck` | **Check Types** | Runs `tsc --noEmit` on `apps/web-next`   |
| `npm run lint`      | **Linting**     | Runs ESLint                              |
| `npm test`          | **Test**        | Runs Vitest on `apps/web-next`           |
### Debugging

- **Proxy Logs**: Check terminal output for `[Midtrans]` or `[Proxy]` tagged logs.
- **Web Logs**: Browser console / terminal for Next.js issues.

## Do's and Don'ts

### ✅ Do

- **Mobile First**: Always design/code for **375px viewport** first.
- **Touch Targets**: Ensure buttons/inputs are at least **44x44px**.
- **Type Safety**: strict TypeScript usage. No `any`. Share types via `packages/*` or tRPC router exports.
- **Dependencies**: Use `npm install` at root (workspaces logic).

### ❌ Don't

- **Don't hardcode URLs**: Use environment variables (e.g., `NEXT_PUBLIC_API_URL`).
- **Don't mix styling**: Stick to Tailwind. Avoid CSS modules unless necessary for complex animations.
- **Don't over-engineer**: Santi Living values simplicity. Follow "Zero Cognitive Load".

## Key Files Reference

- `.agent/rules/constitution.md` - Core product principles (Authority).
- `.github/memory.md` - Technical decisions and known issues.
- `apps/web-next/src/components/checkout/CheckoutFlow.tsx` - Checkout flow implementation.
- `apps/proxy/src/services/midtrans-client.ts` - Midtrans backend service.
