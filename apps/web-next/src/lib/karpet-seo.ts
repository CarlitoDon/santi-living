import type { Metadata } from 'next';
import type { LandingPageConfig } from '@/types/landing';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

// Compatibility exports for callers that used the old specialist hosts.
// New canonical URLs and structured data always use the primary domain.
export const KARPET_SITE_URL = PRIMARY_SITE_URL;
export const PERMADANI_SITE_URL = PRIMARY_SITE_URL;
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
    ],
    alternates: {
      canonical: url,
      languages: {
        id: localizedSiteUrl(path, 'id'),
        en: localizedSiteUrl(path, 'en'),
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

export function buildKarpetServiceSchema(
  config: LandingPageConfig,
  path: string,
  serviceType: string,
  locale = 'id',
) {
  const currentLocale = safeLocale(locale);
  const url = localizedSiteUrl(path, currentLocale);
  const image = getImageUrl(config);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.hero.title,
    serviceType,
    description: config.meta.description,
    url,
    image,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Santi Living',
      url: primarySiteUrl(),
      telephone: '+6289519119092',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Godean KM 10 Geneng, RT.05/RW.04, Sidoagung, Kec. Godean',
        addressLocality: 'Sleman',
        addressRegion: 'DI Yogyakarta',
        postalCode: '55264',
        addressCountry: 'ID',
      },
    },
    areaServed: SERVICE_AREAS.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+6289519119092',
        contactType: 'customer service',
        availableLanguage: currentLocale === 'en' ? 'English' : 'Indonesian',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${config.hero.title} - opsi konsultasi`,
      itemListElement: config.priceCards?.map((card) => ({
        '@type': 'Offer',
        name: card.name,
        description: `${card.size}. ${card.note}`,
        availability: 'https://schema.org/LimitedAvailability',
        priceSpecification: {
          '@type': 'PriceSpecification',
          description: card.daily,
        },
      })),
    },
  };
}

export function buildKarpetFaqSchema(config: LandingPageConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildKarpetBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  locale = 'id',
) {
  const currentLocale = safeLocale(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: localizedSiteUrl(item.path, currentLocale),
    })),
  };
}
