import type { Metadata } from 'next';
import { createLandingMetadata } from '@/lib/landing-metadata';
import { AboutContent } from './AboutContent';

const PAGE_PATH = '/about';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'en' ? 'en' : 'id';
  const isEn = locale === 'en';

  // ponytail: distinguish about page intent from homepage transactional queries to prevent keyword cannibalization.
  const title = isEn
    ? 'About Us — Santi Living Profile & Workshop'
    : 'Tentang Kami — Profil & Workshop Santi Living Jogja';
  const description = isEn
    ? 'Learn more about Santi Living, a trusted mattress and event equipment rental service in Yogyakarta born from Santi Mebel Godean.'
    : 'Kenali lebih dekat Santi Living, layanan sewa kasur dan perlengkapan event di Yogyakarta yang lahir dari pengalaman puluhan tahun Santi Mebel Godean.';

  return createLandingMetadata({
    path: PAGE_PATH,
    locale,
    title,
    description,
    keywords: [
      'tentang santi living',
      'profil santi living jogja',
      'workshop santi living godean',
      'sejarah santi living jogja',
    ],
    image: '/images/stok-kasur.png',
    imageAlt: title,
  });
}

export default function AboutPage() {
  return <AboutContent />;
}
