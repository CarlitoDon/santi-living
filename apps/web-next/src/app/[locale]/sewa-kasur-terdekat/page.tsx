import type { Metadata } from 'next';
import { sewaKasurTerdekat } from '@/data/landing-pages/sewa-kasur-terdekat';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKasurTerdekat.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKasurTerdekat.meta.title, description: sewaKasurTerdekat.meta.description };
}

export default function SewaKasurTerdekatPage() {
  return <LandingPage config={ sewaKasurTerdekat } />;
}
