import type { Metadata } from 'next';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildKarpetMetadata } from '@/lib/karpet-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildKarpetMetadata(sewaKarpetPermadani, '/sewa-karpet-permadani-jogja', locale);
  if (locale === 'en' && sewaKarpetPermadani.en?.meta?.title) {
    const title = sewaKarpetPermadani.en.meta.title;
    const description = sewaKarpetPermadani.en.meta.description;
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

export default function SewaKarpetPermadaniPage() {
  return <LandingPage config={ sewaKarpetPermadani } />;
}
