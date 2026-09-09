import type { Metadata } from 'next';
import { sewaKarpetMerah } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildKarpetMetadata } from '@/lib/karpet-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildKarpetMetadata(sewaKarpetMerah, '/sewa-karpet-merah-jogja', locale);
  if (locale === 'en' && sewaKarpetMerah.en?.meta?.title) {
    const title = sewaKarpetMerah.en.meta.title;
    const description = sewaKarpetMerah.en.meta.description;
    return {
      ...baseMeta,
      title,
      description,
      openGraph: { ...baseMeta.openGraph, title, description },
      twitter: { ...baseMeta.twitter, title, description },
    };
  }
  return baseMeta;
}

export default function SewaKarpetMerahPage() {
  return <LandingPage config={ sewaKarpetMerah } />;
}
