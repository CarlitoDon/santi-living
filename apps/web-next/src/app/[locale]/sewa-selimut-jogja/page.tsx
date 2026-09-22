import type { Metadata } from 'next';
import { sewaSelimut } from '@/data/landing-pages/sewa-selimut';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaSelimut, '/sewa-selimut-jogja', locale);
}

export default function SewaSelimutPage() {
  return <LandingPage config={ sewaSelimut } />;
}
