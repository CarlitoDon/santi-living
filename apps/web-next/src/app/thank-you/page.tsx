import type { Metadata } from 'next';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export const metadata: Metadata = {
  title: 'Terima Kasih | Santi Living',
  description: 'Pesanan Anda telah kami terima. Tim Santi Living akan segera menghubungi Anda.',
};

export default function ThankYouPage() {
  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎉</div>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Terima Kasih!</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Pesanan Anda telah kami terima. Tim kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            <a
              href={getWhatsAppUrl()}
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
