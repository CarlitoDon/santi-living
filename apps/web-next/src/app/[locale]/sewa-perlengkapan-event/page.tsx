import type { Metadata } from 'next';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaAcara.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaAcara.meta.title, description: sewaAcara.meta.description };
}

export default function SewaAcaraPage() {
  return <LandingPage config={ sewaAcara } />;
}
