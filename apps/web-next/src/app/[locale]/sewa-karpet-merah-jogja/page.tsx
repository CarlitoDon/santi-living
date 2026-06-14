import type { Metadata } from 'next';
import { sewaKarpetMerah } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKarpetMerah.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKarpetMerah.meta.title, description: sewaKarpetMerah.meta.description };
}

export default function SewaKarpetMerahPage() {
  return <LandingPage config={ sewaKarpetMerah } />;
}
