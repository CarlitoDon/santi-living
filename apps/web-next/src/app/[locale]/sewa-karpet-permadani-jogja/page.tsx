import type { Metadata } from 'next';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaKarpetPermadani.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaKarpetPermadani.meta.title, description: sewaKarpetPermadani.meta.description };
}

export default function SewaKarpetPermadaniPage() {
  return <LandingPage config={ sewaKarpetPermadani } />;
}
