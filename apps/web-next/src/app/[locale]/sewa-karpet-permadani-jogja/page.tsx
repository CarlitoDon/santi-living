import type { Metadata } from 'next';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildKarpetMetadata, PERMADANI_SITE_URL } from '@/lib/karpet-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseMeta = buildKarpetMetadata(sewaKarpetPermadani, '/sewa-karpet-permadani-jogja', PERMADANI_SITE_URL);
  if (locale === 'en' && sewaKarpetPermadani.en?.meta?.title) {
    return { ...baseMeta, title: sewaKarpetPermadani.en.meta.title, description: sewaKarpetPermadani.en.meta.description };
  }
  return baseMeta;
}

export default function SewaKarpetPermadaniPage() {
  return <LandingPage config={ sewaKarpetPermadani } />;
}
