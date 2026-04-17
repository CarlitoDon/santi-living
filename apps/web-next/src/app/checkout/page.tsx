import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Checkout - Sewa Kasur Busa Jogja',
};

// SSR — this page uses dynamic rendering
export const dynamic = 'force-dynamic';

const isProduction =
  process.env.PUBLIC_IS_PRODUCTION_MODE === 'true' ||
  process.env.MIDTRANS_IS_PRODUCTION === 'true';

const snapUrl = isProduction
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? '';

export default function CheckoutPage() {
  return (
    <main style={{ paddingTop: '70px', minHeight: '100vh', padding: 'var(--space-6) 0', background: 'var(--color-background)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          Checkout
        </h1>

        {/* Midtrans Snap.js */}
        <Script
          src={snapUrl}
          data-client-key={clientKey}
          strategy="afterInteractive"
        />

        {/* Checkout flow placeholder — will be migrated from existing checkout script */}
        <div style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            🔧 Checkout flow component — will be migrated from existing checkout script
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            Midtrans environment: {isProduction ? 'Production' : 'Sandbox'}
          </p>
        </div>
      </div>
    </main>
  );
}
