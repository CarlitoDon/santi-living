This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy the local environment file and configure the services used by the app. Delivery quotes in WhatsApp messages require a server-only Google Maps Platform key with the Routes API enabled:

```bash
GOOGLE_MAPS_API_KEY=your_server_only_key
```

Do not expose that server key through a `NEXT_PUBLIC_` variable. Restrict it to the Routes and Places APIs and set Google Cloud quotas before production use. The app also limits quotes per client, rejects destinations outside the service radius, and caches nearby coordinate quotes for six hours. If the Routes API is unavailable, the WhatsApp message still includes the customer's precise Google Maps link, but intentionally omits an automatic delivery-fee amount.

The interactive location picker uses a separate browser key:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=your_referrer_restricted_browser_key
```

Restrict this key to Maps JavaScript API and to the production/preview website origins. Never reuse the server Routes/Places key in the browser.

Notion article data is cached indefinitely and refreshed by content events rather than a timer. Configure a long random secret and use it in the Notion webhook URL (`/api/notion/revalidate?secret=...`):

```bash
NOTION_REVALIDATE_SECRET=your_random_webhook_secret
NOTION_WEBHOOK_VERIFICATION_TOKEN=token_from_notion_subscription_handshake
```

Subscribe the existing Notion connection to page-created, page-content-updated, page-properties-updated, page-moved, page-deleted, and page-undeleted events. The handler invalidates the old and current article slugs plus the article indexes and sitemap. If Notion cannot reveal a deleted page's slug, it safely expires all article-detail data entries once instead of leaving a permanent stale route.

During subscription setup, read the one-time `verification_token` from the private Vercel function log and paste it into Notion. Then add that value as `NOTION_WEBHOOK_VERIFICATION_TOKEN` and redeploy the already-approved production SHA. Subsequent deliveries are checked with Notion's HMAC signature as well as the private URL secret.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
