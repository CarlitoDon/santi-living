import type { Metadata } from 'next';
import { sewaSelimut } from '@/data/landing-pages/sewa-selimut';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaSelimut.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaSelimut.meta.title, description: sewaSelimut.meta.description };
}

export default function SewaSelimutPage() {
  return <LandingPage config={ sewaSelimut } />;
}
