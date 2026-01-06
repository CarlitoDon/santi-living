# Research: Automated WhatsApp Notification

**Feature**: `002-auto-wa-sender`
**Date**: 2026-01-06

## Decisions Log

### 1. Delivery Architecture

**Decision**: **Hybrid Architecture (Static Frontend + Separate Node.js Bot Service)**
**Rationale**:

- `whatsapp-web.js` (and `baileys`) requires a persistent, long-running Node.js process to maintain the WebSocket connection with WhatsApp servers.
- The current project is an Astro static site (`output: "static"` in build). Static hosting (Vercel/Netlify/GitHub Pages) cannot host a persistent process.
- Serverless functions (Lambdas) will timeout and kill the WebSocket session, requiring re-authentication (QR scan) frequently, which is unacceptable for an admin-facing tool.
- Therefore, we need a separate, lightweight Node.js service (e.g., on a $5 DigitalOcean droplet, Railway, or standard VPS) that runs the bot.
- The Static Frontend will send data to this Bot Service via a secured HTTP webhook/API.

**Alternatives Considered**:

- **Astro SSR**: Even with `output: "server"`, Vercel/Netlify host these as Functions/Lambdas, which still face the timeout/persistence issue for WebSocket clients.
- **Third-Party API (Twilio/Waboxapp)**: Expensive ($0.005+ per msg) or unreliable. The requirement implies using the Admin's own number ("WA qr login"), which points to a library-based self-hosted solution.
- **Browser-based Bot**: Impractical to keep Admin's browser open 24/7 to relay messages.

### 2. WhatsApp Library

**Decision**: **`whatsapp-web.js`**
**Rationale**:

- High stability and widely used community library.
- Simpler API for "Connect via QR" -> "Send Message".
- Good documentation for session restoration (saving authentication data to disk).
- **Baileys** is an alternative (no headless browser, uses WebSocket directly), which is lighter resource-wise, but `whatsapp-web.js` is often more robust against protocol changes as it uses the actual Web client source. Given the "low volume" constraint, the overhead of Puppeteer (used by whatsapp-web.js) is acceptable for easier development.

### 3. Session Persistence Strategy

**Decision**: **Local File Storage (RemoteAuth / LocalAuth)**
**Rationale**:

- `whatsapp-web.js` supports `LocalAuth` out of the box.
- Since we are deploying a stateful service (VPS/Container), we can mount a volume or just use the local disk to store the session tokens (`.wwebjs_auth` folder).
- No need for Redis or Database just for session storage in this MVP scale.

### 4. API Security

**Decision**: **Simple Shared Secret (API Key)**
**Rationale**:

- The Static Frontend needs to POST order details to the Bot Service.
- We will protect this endpoint with a high-entropy `Authorization: Bearer <SECRET>` header.
- The Secret will be an environment variable in both the Astro build and the Bot Service.
- Sufficient for MVP.

## Unknowns Resolved

- **Target Platform**: Confirmed need for a persistent Node.js environment (e.g., VPS, Railway, Render with persistent disk).
- **Storage**: Local filesystem is sufficient for `LocalAuth`.
- **Language**: TypeScript is preferred to match existing project.
