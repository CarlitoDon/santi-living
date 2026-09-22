import type { Metadata } from 'next';
import { sewaKasurLipat } from '@/data/landing-pages/sewa-kasur-lipat';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaKasurLipat, '/sewa-kasur-lipat', locale);
}

export default function SewaKasurLipatPage() {
  return <LandingPage config={ sewaKasurLipat } />;
}
