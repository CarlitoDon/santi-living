import type { Metadata } from 'next';
import { sewaKipasAngin } from '@/data/landing-pages/sewa-kipas-angin';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaKipasAngin.meta.title,
  description: sewaKipasAngin.meta.description,
};

export default function SewaKipasAnginPage() {
  return <LandingPage config={sewaKipasAngin} />;
}
