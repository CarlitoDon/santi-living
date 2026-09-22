import type { Metadata } from 'next';
import { sewaKasurBulanan } from '@/data/landing-pages/sewa-kasur-bulanan';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaKasurBulanan, '/sewa-kasur-bulanan', locale);
}

export default function SewaKasurBulananPage() {
  return <LandingPage config={ sewaKasurBulanan } />;
}
