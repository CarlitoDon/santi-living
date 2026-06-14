import type { Metadata } from 'next';
import { sewaKarpetJogja } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKarpetJogja.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKarpetJogja.meta.title, description: sewaKarpetJogja.meta.description };
}

export default function SewaKarpetJogjaPage() {
  return <LandingPage config={ sewaKarpetJogja } />;
}
