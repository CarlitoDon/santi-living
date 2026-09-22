import type { Metadata } from 'next';
import { sewaBantal } from '@/data/landing-pages/sewa-bantal';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaBantal, '/sewa-bantal-jogja', locale);
}

export default function SewaBantalPage() {
  return <LandingPage config={ sewaBantal } />;
}
