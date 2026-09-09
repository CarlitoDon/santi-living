import type { Metadata } from 'next';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildAcaraMetadata } from '@/lib/acara-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildAcaraMetadata(sewaAcara, locale);
  if (locale === 'en' && sewaAcara.en?.meta?.title) {
    const title = sewaAcara.en.meta.title;
    const description = sewaAcara.en.meta.description;
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

export default function SewaAcaraPage() {
  return <LandingPage config={ sewaAcara } />;
}
