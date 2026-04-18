import { getProxyBaseUrl } from '@/lib/proxy-config';
import { OrderSchema, type Order } from '@/types/order';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ token: string }>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu Pembayaran' },
  PENDING: { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu Pembayaran' },
  CONFIRMED: { bg: '#DBEAFE', text: '#1E40AF', label: 'Dikonfirmasi' },
  ACTIVE: { bg: '#D1FAE5', text: '#065F46', label: 'Aktif (Sedang Disewa)' },
  COMPLETED: { bg: '#E5E7EB', text: '#374151', label: 'Selesai' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B', label: 'Dibatalkan' },
};

async function fetchOrder(token: string): Promise<Order | null> {
  try {
    const apiUrl = getProxyBaseUrl();
    const input = encodeURIComponent(JSON.stringify({ '0': { json: { token } } }));
    const fetchUrl = `${apiUrl}/api/trpc/order.getByToken?batch=1&input=${input}`;

    console.log(`[SSR] Fetching order token: ${token} from ${apiUrl}`);

    const response = await fetch(fetchUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[SSR] Fetch failed: ${response.status}`);
      return null;
    }

    const raw: unknown = await response.json();

    // tRPC batch response: [{ result: { data: { json: Order } } }]
    const parsed = OrderSchema.safeParse(
      (raw as Array<{ result: { data: { json: unknown } } }>)?.[0]?.result?.data?.json
    );

    if (!parsed.success) {
      console.error('[SSR] Order validation failed:', parsed.error.message);
      return null;
    }

    return parsed.data;
  } catch (e) {
    console.error('[SSR] Exception:', e);
    return null;
  }
}

function getDisplayStatus(status: string, paymentStatus: string) {
  if (status === 'CANCELLED') return statusColors.CANCELLED;
  if (status === 'COMPLETED') return statusColors.COMPLETED;
  if (status === 'ACTIVE') return statusColors.ACTIVE;
  if (status === 'CONFIRMED') return statusColors.CONFIRMED;
  if (paymentStatus === 'AWAITING_CONFIRM') return { bg: '#DBEAFE', text: '#1E40AF', label: 'Pembayaran Diverifikasi' };
  if (paymentStatus === 'CONFIRMED') return { bg: '#D1FAE5', text: '#065F46', label: 'Menunggu Konfirmasi Admin' };
  if (paymentStatus === 'FAILED') return { bg: '#FEE2E2', text: '#991B1B', label: 'Pembayaran Gagal' };
  return statusColors.DRAFT;
}

export default async function PesananPage({ params }: PageProps) {
  const { token } = await params;
  const order = await fetchOrder(token);

  if (!order) {
    return (
      <main style={{ paddingTop: '70px' }}>
        <div className="container" style={{ maxWidth: '600px', padding: 'var(--space-16) var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>❌</div>
          <h1>Pesanan Tidak Ditemukan</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Link pesanan tidak valid atau sudah kadaluarsa.
          </p>
          <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }

  const status = order.status || 'PENDING';
  const paymentStatus = order.rentalPaymentStatus || 'PENDING';
  const statusInfo = getDisplayStatus(status, paymentStatus);

  return (
    <main style={{ minHeight: '100vh', padding: 'calc(80px + var(--space-4)) var(--space-4) var(--space-4)', background: 'linear-gradient(to bottom, var(--color-primary-light) 0%, var(--color-background) 30%)' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Nomor Pesanan</span>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>{order.orderNumber}</span>
            </div>
            <div style={{ background: statusInfo.bg, color: statusInfo.text, padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
              {statusInfo.label}
            </div>
          </div>

          {/* Dates */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>📅 Periode Sewa</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) 0' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Mulai</span>
              <span>{formatDate(order.rentalStartDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) 0' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Selesai</span>
              <span>{formatDate(order.rentalEndDate)}</span>
            </div>
          </div>

          {/* Address */}
          {order.deliveryAddress && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>📍 Alamat Pengiriman</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', background: 'var(--color-background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                {order.deliveryAddress}
              </p>
            </div>
          )}

          {/* Items */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>📦 Detail Pesanan</h3>
            <div style={{ background: 'var(--color-background)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', fontSize: 'var(--font-size-sm)', borderBottom: i < order.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ color: 'var(--color-text-muted)', marginRight: 'var(--space-3)' }}>{item.quantity}x</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{formatCurrency(item.subtotal ?? item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ background: 'var(--color-background)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) 0' }}>
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) 0', color: 'var(--color-success)' }}>
                  <span>Diskon {order.discountLabel ?? ''}</span><span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              {order.deliveryFee && order.deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) 0' }}>
                  <span>Biaya Antar</span><span>{formatCurrency(order.deliveryFee)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <a
              href={getWhatsAppUrl()}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener"
              style={{ textDecoration: 'none', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}
            >
              💬 Hubungi Kami
            </a>
            <Link href="/" className="btn" style={{ textDecoration: 'none', textAlign: 'center', padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
