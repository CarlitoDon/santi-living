import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';

export const metadata: Metadata = {
  title: 'Edit Pesanan | Santi Living',
};

export default function CartPage() {
  return (
    <main style={{ minHeight: '100vh', padding: 'calc(80px + var(--space-6)) 0 var(--space-6)' }}>
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

        <div style={{ marginTop: 'var(--space-4)' }}>
          <CalculatorSection editMode={true} />
        </div>
      </div>
    </main>
  );
}
