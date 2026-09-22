import type { Metadata } from 'next';
import { sewaKasurTerdekat } from '@/data/landing-pages/sewa-kasur-terdekat';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaKasurTerdekat, '/sewa-kasur-terdekat', locale);
}

export default function SewaKasurTerdekatPage() {
  return <LandingPage config={ sewaKasurTerdekat } />;
}
