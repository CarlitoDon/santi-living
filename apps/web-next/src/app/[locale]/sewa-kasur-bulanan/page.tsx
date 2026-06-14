import type { Metadata } from 'next';
import { sewaKasurBulanan } from '@/data/landing-pages/sewa-kasur-bulanan';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKasurBulanan.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKasurBulanan.meta.title, description: sewaKasurBulanan.meta.description };
}

export default function SewaKasurBulananPage() {
  return <LandingPage config={ sewaKasurBulanan } />;
}
