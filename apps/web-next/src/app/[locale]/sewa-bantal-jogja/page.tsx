import type { Metadata } from 'next';
import { sewaBantal } from '@/data/landing-pages/sewa-bantal';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaBantal.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaBantal.meta.title, description: sewaBantal.meta.description };
}

export default function SewaBantalPage() {
  return <LandingPage config={ sewaBantal } />;
}
