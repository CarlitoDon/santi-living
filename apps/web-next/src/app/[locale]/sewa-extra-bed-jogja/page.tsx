import type { Metadata } from 'next';
import { sewaExtraBedJogja } from '@/data/landing-pages/sewa-extra-bed-jogja';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaExtraBedJogja, '/sewa-extra-bed-jogja', locale);
}

export default function SewaExtraBedJogjaPage() {
  return <LandingPage config={ sewaExtraBedJogja } />;
}
