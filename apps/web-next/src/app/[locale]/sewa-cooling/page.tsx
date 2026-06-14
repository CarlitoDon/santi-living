import type { Metadata } from 'next';
import { sewaCooling } from '@/data/landing-pages/sewa-cooling';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaCooling.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaCooling.meta.title, description: sewaCooling.meta.description };
}

export default function SewaCoolingPage() {
  return <LandingPage config={ sewaCooling } />;
}
