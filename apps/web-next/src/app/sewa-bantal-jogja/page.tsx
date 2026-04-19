import type { Metadata } from 'next';
import { sewaBantal } from '@/data/landing-pages/sewa-bantal';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaBantal.meta.title,
  description: sewaBantal.meta.description,
};

export default function SewaBantalPage() {
  return <LandingPage config={sewaBantal} />;
}
