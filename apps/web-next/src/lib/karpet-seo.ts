import type { Metadata } from 'next';
import type { LandingPageConfig } from '@/types/landing';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

const DEFAULT_IMAGE = primarySiteUrl('/images/karpet-hero.webp');

const SERVICE_AREAS = [
  'Sleman',
  'Kota Yogyakarta',
  'Bantul',
  'Godean',
  'Mlati',
  'Gamping',
  'Depok',
  'Malioboro',
  'Sekitar UGM',
];

function safeLocale(locale: string | undefined): 'id' | 'en' {
  return locale === 'en' ? 'en' : 'id';
}

function getImageUrl(config: LandingPageConfig): string {
  const image = config.hero.bgImage;

  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  return primarySiteUrl(image);
}

export function buildKarpetMetadata(
  config: LandingPageConfig,
  path: string,
  locale = 'id',
): Metadata {
  const currentLocale = safeLocale(locale);
  const url = localizedSiteUrl(path, currentLocale);
  const image = getImageUrl(config);

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: config.meta.title,
    description: config.meta.description,
    keywords: [
      'sewa karpet jogja',
      'rental karpet jogja',
      'persewaan karpet jogja',
      'jasa sewa karpet jogja',
      'sewa karpet merah jogja',
      'sewa karpet permadani jogja',
      'sewa karpet pernikahan jogja',
      'sewa karpet pengajian jogja',
      'sewa karpet seminar jogja',
      'sewa karpet pameran jogja',
      'karpet tahlilan',
      'karpet pengajian',
      'sewa karpet tahlilan jogja',
      'karpet buat tahlilan',
    ],
    alternates: {
      canonical: url,
      languages: {
        id: localizedSiteUrl(path, 'id'),
        en: localizedSiteUrl(path, 'en'),
        'x-default': localizedSiteUrl(path, 'id'),
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
          url: image,
          width: 1200,
          height: 630,
          alt: config.hero.bgImageAlt || config.hero.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.meta.title,
      description: config.meta.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

