import type { Metadata } from 'next';
import { config } from '@/data/config';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';
import type { LandingPageConfig } from '@/types/landing';

export interface LandingMetadataOptions {
  path: string;
  locale: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
}

export function createLandingMetadata(options: LandingMetadataOptions): Metadata {
  const currentLocale = options.locale === 'en' ? 'en' : 'id';
  const pageUrl = localizedSiteUrl(options.path, currentLocale);
  const imageUrl = options.image
    ? (options.image.startsWith('http') ? options.image : primarySiteUrl(options.image))
    : primarySiteUrl('/logo.png');

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: options.title,
    description: options.description,
    ...(options.keywords ? { keywords: options.keywords } : {}),
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(options.path, 'id'),
        en: localizedSiteUrl(options.path, 'en'),
        'x-default': localizedSiteUrl(options.path, 'id'),
      },
    },
    openGraph: {
      type: 'website',
      locale: currentLocale === 'en' ? 'en_US' : 'id_ID',
      url: pageUrl,
      siteName: config.businessName,
      title: options.title,
      description: options.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: options.imageAlt || options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export function buildConfigLandingMetadata(
  pageConfig: LandingPageConfig,
  path: string,
  locale: string,
  keywords?: string[],
): Metadata {
  const isEn = locale === 'en';
  const en = pageConfig.en;
  const title = (isEn && en?.meta?.title) ? en.meta.title : pageConfig.meta.title;
  const description = (isEn && en?.meta?.description) ? en.meta.description : pageConfig.meta.description;
  const image = (isEn && en?.hero?.bgImage) ? en.hero.bgImage : pageConfig.hero.bgImage;
  const imageAlt = (isEn && en?.hero?.bgImageAlt)
    ? en.hero.bgImageAlt
    : (pageConfig.hero.bgImageAlt || pageConfig.hero.title);

  return createLandingMetadata({
    path,
    locale,
    title,
    description,
    keywords,
    image,
    imageAlt,
  });
}
