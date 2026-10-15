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
    : 'Harga Sewa Kasur Jogja Mulai 30rb/Hari';
  const description = isEn
    ? 'Transparent and affordable mattress rental prices in Yogyakarta. Complete with bedsheets, pillows, and free delivery options.'
    : 'Daftar harga sewa kasur Jogja mulai Rp30.000/hari & Rp900rb/bulan. Busa 20cm steril, sprei laundry, gratis ongkir 3km. Cek tarif!';

  return createLandingMetadata({
    path: PAGE_PATH,
    locale,
    title,
    description,
    keywords: [
      'harga sewa kasur jogja',
      'harga sewa kasur',
      'sewa kasur',
      'tarif sewa kasur busa jogja',
      'sewa kasur murah jogja',
      'sewa extra bed jogja',
      'biaya rental kasur jogja',
      'ongkir sewa kasur jogja',
    ],
    image: '/images/stok-kasur.webp',
    imageAlt: title,
  });
}

export default function HargaSewaKasurPage() {
  return <HargaSewaKasurContent />;
}
