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

  const title = isEn
    ? 'Mattress Rental Prices in Jogja — 2026 | Santi Living'
    : 'Harga Sewa Kasur di Jogja — Update 2026 | Santi Living';
  const description = isEn
    ? 'Transparent and affordable mattress rental prices in Yogyakarta. Complete with bedsheets, pillows, and free delivery options.'
    : 'Daftar harga sewa kasur busa harian dan bulanan di Jogja. Kasur bersih, sprei, bantal, dan opsi gratis ongkir antar jemput.';

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
    image: '/images/stok-kasur.png',
    imageAlt: title,
  });
}

export default function HargaSewaKasurPage() {
  return <HargaSewaKasurContent />;
}
