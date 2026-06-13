import type { Metadata } from 'next';
import { sewaKasurLipat } from '@/data/landing-pages/sewa-kasur-lipat';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaKasurLipat.meta.title,
  description: sewaKasurLipat.meta.description,
};

export default function SewaKasurLipatPage() {
  return <LandingPage config={sewaKasurLipat} />;
}
