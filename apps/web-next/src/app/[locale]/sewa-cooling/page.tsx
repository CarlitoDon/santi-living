import type { Metadata } from 'next';
import { sewaCooling } from '@/data/landing-pages/sewa-cooling';
import { LandingPage } from '@/components/landing/LandingPage';
import { buildConfigLandingMetadata } from '@/lib/landing-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildConfigLandingMetadata(sewaCooling, '/sewa-cooling', locale);
}

export default function SewaCoolingPage() {
  return <LandingPage config={ sewaCooling } />;
}
