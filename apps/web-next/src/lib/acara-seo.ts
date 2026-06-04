import type { Metadata } from 'next';
import type { LandingPageConfig } from '@/types/landing';

export const ACARA_SITE_URL = 'https://acara.santiliving.com';
const ACARA_PATH = '/sewa-perlengkapan-event';
const DEFAULT_IMAGE = `${ACARA_SITE_URL}/logo.png`;

const SERVICE_AREAS = ['Sleman', 'Kota Yogyakarta', 'Bantul', 'Kulon Progo'];

export function buildAcaraMetadata(config: LandingPageConfig): Metadata {
  const url = `${ACARA_SITE_URL}${ACARA_PATH}`;

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
    },
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      url,
      type: 'website',
      locale: 'id_ID',
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

export function buildAcaraServiceSchema(config: LandingPageConfig) {
  const url = `${ACARA_SITE_URL}${ACARA_PATH}`;

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
      url: ACARA_SITE_URL,
      telephone: '+628****9092',
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
        telephone: '+628****9092',
        contactType: 'customer service',
        availableLanguage: 'Indonesian',
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

export function buildAcaraItemListSchema(config: LandingPageConfig) {
  const url = `${ACARA_SITE_URL}${ACARA_PATH}`;
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
          url: ACARA_SITE_URL,
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

export function buildAcaraBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: ACARA_SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sewa Perlengkapan Event Jogja',
        item: `${ACARA_SITE_URL}${ACARA_PATH}`,
      },
    ],
  };
}
