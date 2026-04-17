import type { Metadata } from 'next';
import { sewaKasurTerdekat } from '@/data/landing-pages/sewa-kasur-terdekat';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaKasurTerdekat.meta.title,
  description: sewaKasurTerdekat.meta.description,
};

export default function SewaKasurTerdekatPage() {
  return <LandingPage config={sewaKasurTerdekat} />;
}
