import type { Metadata } from 'next';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaAcara.meta.title,
  description: sewaAcara.meta.description,
};

export default function SewaAcaraPage() {
  return <LandingPage config={sewaAcara} />;
}
