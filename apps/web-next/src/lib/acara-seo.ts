import type { Metadata } from 'next';
import type { LandingPageConfig } from '@/types/landing';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

const ACARA_PATH = '/sewa-perlengkapan-event';
const DEFAULT_IMAGE = primarySiteUrl('/logo.png');

const SERVICE_AREAS = ['Sleman', 'Kota Yogyakarta', 'Bantul', 'Kulon Progo'];

function safeLocale(locale: string | undefined): 'id' | 'en' {
  return locale === 'en' ? 'en' : 'id';
}

export function buildAcaraMetadata(config: LandingPageConfig, locale = 'id'): Metadata {
  const currentLocale = safeLocale(locale);
  const url = localizedSiteUrl(ACARA_PATH, currentLocale);

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: config.meta.title,
    description: config.meta.description,
    keywords: [
      'sewa perlengkapan event jogja',
      'rental perlengkapan event yogyakarta',
      'sewa kasur rest area event jogja',
      'sewa air cooler event jogja',
      'sewa tv display event jogja',
      'paket perlengkapan acara jogja',
    ],
    alternates: {
      canonical: url,
      languages: {
        id: localizedSiteUrl(ACARA_PATH, 'id'),
        en: localizedSiteUrl(ACARA_PATH, 'en'),
        'x-default': localizedSiteUrl(ACARA_PATH, 'id'),
      },
    },
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      url,
      type: 'website',
      locale: currentLocale === 'en' ? 'en_US' : 'id_ID',
      siteName: 'Santi Living',
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Santi Living - sewa perlengkapan event Jogja',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.meta.title,
      description: config.meta.description,
      images: [DEFAULT_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


