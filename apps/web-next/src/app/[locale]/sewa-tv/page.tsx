import type { Metadata } from 'next';
import { sewaTv } from '@/data/landing-pages/sewa-tv';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: sewaTv.meta.title,
  description: sewaTv.meta.description,
};

export default function SewaTvPage() {
  return <LandingPage config={sewaTv} />;
}
