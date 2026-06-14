import type { Metadata } from 'next';
import { sewaTv } from '@/data/landing-pages/sewa-tv';
import { LandingPage } from '@/components/landing/LandingPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = sewaTv.en;
  if (locale === 'en' && en?.meta?.title) {
    return { title: en.meta.title, description: en.meta.description };
  }
  return { title: sewaTv.meta.title, description: sewaTv.meta.description };
}

export default function SewaTvPage() {
  return <LandingPage config={ sewaTv } />;
}
