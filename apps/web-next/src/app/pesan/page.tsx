import type { Metadata } from 'next';
import { OrderWizard } from '@/components/order/OrderWizard';

export const metadata: Metadata = {
  title: 'Pesan Kasur - Santi Living',
  description: 'Isi data pemesanan sewa kasur Anda dalam beberapa langkah mudah.',
  robots: { index: false },
};

export default function PesanPage() {
  return (
    <main style={{ minHeight: '100dvh', background: '#f8fafc' }}>
      <OrderWizard />
    </main>
  );
}
