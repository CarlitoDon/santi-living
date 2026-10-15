import type { Metadata } from 'next';
import { sewaAirCoolerJogja } from '@/data/landing-pages/sewa-air-cooler-jogja';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaAirCoolerJogja, '/sewa-air-cooler-jogja', locale);
}

export default function SewaAirCoolerJogjaPage() {
  return <LandingPage config={ sewaAirCoolerJogja } />;
}
