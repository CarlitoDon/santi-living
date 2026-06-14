import type { Metadata } from 'next';
import { sewaKasurLipat } from '@/data/landing-pages/sewa-kasur-lipat';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKasurLipat.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKasurLipat.meta.title, description: sewaKasurLipat.meta.description };
}

export default function SewaKasurLipatPage() {
  return <LandingPage config={ sewaKasurLipat } />;
}
