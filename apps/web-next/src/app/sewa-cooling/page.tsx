import type { Metadata } from 'next';
import { sewaCooling } from '@/data/landing-pages/sewa-cooling';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaCooling.meta.title,
  description: sewaCooling.meta.description,
};

export default function SewaCoolingPage() {
  return <LandingPage config={sewaCooling} />;
}
