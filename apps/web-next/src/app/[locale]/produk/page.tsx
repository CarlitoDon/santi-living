import type { Metadata } from 'next';
import { createLandingMetadata } from '@/lib/landing-metadata';
import { ProdukContent } from './ProdukContent';

const PAGE_PATH = '/produk';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'en' ? 'en' : 'id';
  const isEn = locale === 'en';

  const title = isEn
    ? 'Product Catalog — Santi Living Mattress & Accessories Rental'
    : 'Katalog Produk Sewa Kasur & Perlengkapan Tidur | Santi Living';
  const description = isEn
    ? 'Browse our complete catalog of rental mattresses, complete packages, single mattresses, and bedding accessories in Yogyakarta.'
    : 'Katalog lengkap pilihan sewa kasur busa harian Jogja: paket lengkap, kasur saja, dan aksesoris sprei bantal selimut.';

  return createLandingMetadata({
    path: PAGE_PATH,
    locale,
    title,
    description,
    keywords: [
      'katalog produk santi living',
      'daftar ukuran kasur sewa jogja',
      'sewa kasur single jogja',
      'sewa kasur queen jogja',
      'sewa sprei bantal jogja',
    ],
    image: '/images/stok-kasur.png',
    imageAlt: title,
  });
}

export default function ProdukPage() {
  return <ProdukContent />;
}
