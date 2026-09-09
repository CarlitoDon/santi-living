import type { Metadata } from 'next';
import type { LandingPageConfig } from '@/types/landing';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

// Compatibility export for callers that used the old specialist host.
export const ACARA_SITE_URL = PRIMARY_SITE_URL;
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

export function buildAcaraServiceSchema(config: LandingPageConfig, locale = 'id') {
  const currentLocale = safeLocale(locale);
  const url = localizedSiteUrl(ACARA_PATH, currentLocale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.hero.title,
    serviceType: 'Sewa perlengkapan event Jogja',
    description: config.meta.description,
    url,
    image: DEFAULT_IMAGE,
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
      name: 'Opsi perlengkapan event Santi Living',
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

export function buildAcaraItemListSchema(config: LandingPageConfig, locale = 'id') {
  const currentLocale = safeLocale(locale);
  const url = localizedSiteUrl(ACARA_PATH, currentLocale);
  const items = config.priceCards ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rekomendasi paket perlengkapan event Santi Living',
    description:
      'Daftar opsi konsultasi yang membedakan item inti Santi Living dan item by-request untuk kebutuhan event di Yogyakarta.',
    url,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: card.name,
        description: `${card.size}. ${card.note}. ${card.daily}`,
        serviceType: 'Konsultasi perlengkapan event',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Santi Living',
          url: primarySiteUrl(),
        },
      },
    })),
  };
}

export function buildAcaraFaqSchema(config: LandingPageConfig) {
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

export function buildAcaraBreadcrumbSchema(locale = 'id') {
  const currentLocale = safeLocale(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: localizedSiteUrl('', currentLocale),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sewa Perlengkapan Event Jogja',
        item: localizedSiteUrl(ACARA_PATH, currentLocale),
      },
    ],
  };
}
