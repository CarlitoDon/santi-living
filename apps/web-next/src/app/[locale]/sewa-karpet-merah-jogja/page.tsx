import type { Metadata } from 'next';
import { sewaKarpetMerah } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildKarpetMetadata } from '@/lib/karpet-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildKarpetMetadata(sewaKarpetMerah, '/sewa-karpet-merah-jogja');
  if (locale === 'en' && sewaKarpetMerah.en?.meta?.title) {
    return { ...baseMeta, title: sewaKarpetMerah.en.meta.title, description: sewaKarpetMerah.en.meta.description };
  }
  return baseMeta;
}

export default function SewaKarpetMerahPage() {
  return <LandingPage config={ sewaKarpetMerah } />;
}
