import type { Metadata } from 'next';
import { sewaKarpet } from '@/data/landing-pages/sewa-karpet';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaKarpet.meta.title,
  description: sewaKarpet.meta.description,
};

export default function SewaKarpetPage() {
  return <LandingPage config={sewaKarpet} />;
}
