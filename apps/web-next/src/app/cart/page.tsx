import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Pesanan | Santi Living',
};

export default function CartPage() {
  return (
    <main style={{ paddingTop: '70px', minHeight: '100vh', padding: 'var(--space-6) 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ padding: '0 var(--space-4)' }}>
          <Link
            href="/checkout"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) 0',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-sm)',
              minHeight: '44px',
            }}
          >
            ← Kembali ke Checkout
          </Link>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginTop: 'var(--space-2)' }}>
            Edit Pesanan
          </h1>
        </div>

        {/* Calculator component placeholder — will be migrated with the full Calculator React component */}
        <div style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--space-4)',
        }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            🔧 Calculator component — will be migrated from existing React component
          </p>
        </div>
      </div>
    </main>
  );
}
