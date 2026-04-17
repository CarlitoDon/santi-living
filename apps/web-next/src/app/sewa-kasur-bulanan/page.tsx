import type { Metadata } from 'next';
import { sewaKasurBulanan } from '@/data/landing-pages/sewa-kasur-bulanan';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaKasurBulanan.meta.title,
  description: sewaKasurBulanan.meta.description,
};

export default function SewaKasurBulananPage() {
  return <LandingPage config={sewaKasurBulanan} />;
}
