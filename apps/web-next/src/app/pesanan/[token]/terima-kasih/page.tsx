import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/data/config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terima Kasih - Pesanan Dikonfirmasi | Santi Living',
};

export default async function TerimakasihPage() {
  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎉</div>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Pembayaran Dikonfirmasi!</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Terima kasih! Tim kami akan segera memproses pesanan Anda. Kami akan menghubungi via WhatsApp untuk konfirmasi jadwal pengiriman.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              className="btn btn-whatsapp btn-lg"
              target="_blank"
              rel="noopener"
              style={{ width: '100%', maxWidth: '280px', textDecoration: 'none' }}
            >
              💬 Chat WhatsApp
            </a>
            <Link href="/" className="btn btn-primary" style={{ width: '100%', maxWidth: '280px', textDecoration: 'none' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
