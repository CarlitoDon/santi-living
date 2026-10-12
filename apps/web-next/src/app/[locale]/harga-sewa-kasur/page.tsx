import type { Metadata } from 'next';
import { createLandingMetadata } from '@/lib/landing-metadata';
import { HargaSewaKasurContent } from './HargaSewaKasurContent';

const PAGE_PATH = '/harga-sewa-kasur';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'en' ? 'en' : 'id';
  const isEn = locale === 'en';

  const title = locale === 'en'
    ? 'Mattress Rental Prices in Jogja — 2026'
    : 'Harga Sewa Kasur Jogja Mulai 30rb | Tarif Harian & Bulanan 2026';
  const description = isEn
    ? 'Transparent and affordable mattress rental prices in Yogyakarta. Complete with bedsheets, pillows, and free delivery options.'
    : 'Daftar harga sewa kasur Jogja mulai Rp30.000/hari & Rp900.000/bulan. Kasur busa tebal 20 cm steril UV-C, sprei wangi laundry, gratis ongkir 3 km. Cek tarif lengkap!';

  return createLandingMetadata({
    path: PAGE_PATH,
    locale,
    title,
    description,
    keywords: [
      'harga sewa kasur jogja',
      'tarif sewa kasur busa jogja',
      'biaya rental kasur jogja',
      'sewa kasur murah jogja',
      'ongkir sewa kasur jogja',
    ],
    image: '/images/stok-kasur.webp',
    imageAlt: title,
  });
}

export default function HargaSewaKasurPage() {
  return <HargaSewaKasurContent />;
}
