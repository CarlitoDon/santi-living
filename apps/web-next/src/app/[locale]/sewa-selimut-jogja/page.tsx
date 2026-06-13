import type { Metadata } from 'next';
import { sewaSelimut } from '@/data/landing-pages/sewa-selimut';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaSelimut.meta.title,
  description: sewaSelimut.meta.description,
};

export default function SewaSelimutPage() {
  return <LandingPage config={sewaSelimut} />;
}
