# Quickstart: Automated WhatsApp Notification

## Prerequisites

- Node.js v18+
- Use a dedicated terminal for the bot service (it needs to stay alive).
- `whatsapp-web.js` needs Chromium (installed via Puppeteer).

## Setup Bot Service

1. Create a new directory for the service (or use `apps/bot` if monorepo).
2. Install dependencies:
   ```bash
   npm init -y
   npm install whatsapp-web.js qrcode-terminal express body-parser cors dotenv
   npm install -D typescript @types/node @types/express @types/qrcode-terminal
   ```
3. Create `.env`:
   ```env
   PORT=3000
   API_SECRET=your_super_secret_key
   ```

## Running the Bot

1. Start the service:
   ```bash
   npm run start
   ```
2. Watch the terminal. It will generate a QR Code.
3. Open WhatsApp on your phone > Linked Devices > Link a Device.
4. Scan the QR code.
5. Wait for "Client is ready!" message in console.

## Connecting Frontend

1. Update `config.json` or `.env` in Astro project with:
   ```env
   BOT_API_URL=http://localhost:3000
   BOT_API_SECRET=your_super_secret_key
   ```
2. The Calculator submission will now POST to this URL instead of opening `wa.me`.

## Deployment (Production)

- Deploy the Bot Service to a VPS (DigitalOcean Droplet / EC2) or a container service with persistent storage (Railway / Render with Disk).
- **Do not** use Vercel/Netlify for the bot service.
- Use `pm2` or `docker` to keep the bot running.
