import type { Metadata } from 'next';
import { sewaKarpetJogja } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildKarpetMetadata } from '@/lib/karpet-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildKarpetMetadata(sewaKarpetJogja, '/sewa-karpet-jogja');
  if (locale === 'en' && sewaKarpetJogja.en?.meta?.title) {
    return { ...baseMeta, title: sewaKarpetJogja.en.meta.title, description: sewaKarpetJogja.en.meta.description };
  }
  return baseMeta;
}

export default function SewaKarpetJogjaPage() {
  return <LandingPage config={ sewaKarpetJogja } />;
}
