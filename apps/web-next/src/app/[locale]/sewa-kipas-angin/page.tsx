import type { Metadata } from 'next';
import { sewaKipasAngin } from '@/data/landing-pages/sewa-kipas-angin';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaKipasAngin, '/sewa-kipas-angin', locale);
}

export default function SewaKipasAnginPage() {
  return <LandingPage config={ sewaKipasAngin } />;
}
