import { Children, isValidElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from '@/components/seo/JsonLd';
import SewaKursiAcaraPage, { generateMetadata } from './page';

const PRIMARY_SITE_URL = 'https://santiliving.com';
const PAGE_PATH = '/sewa-kursi-acara';

type ChairSchema = {
  '@type': string;
  url: string;
  hasOfferCatalog: {
    itemListElement: Array<{
      itemOffered: {
        name: string;
        description: string;
        url: string;
      };
    }>;
  };
};

async function getChairSchema(locale: 'id' | 'en'): Promise<ChairSchema> {
  const page = await SewaKursiAcaraPage({
    params: Promise.resolve({ locale }),
  });
  const jsonLd = Children.toArray(page.props.children).find(
    (child): child is ReactElement<{ data: ChairSchema }> =>
      isValidElement(child) && child.type === JsonLd,
  );

  if (!jsonLd) throw new Error('Chair page JSON-LD was not rendered');
  return jsonLd.props.data;
}

describe('sewa kursi acara SEO output', () => {
  it.each([
    ['id', 'Sewa Kursi Acara Jogja', 'id_ID'],
    ['en', 'Event Chair Rental Yogyakarta', 'en_US'],
  ] as const)('renders primary-domain metadata for %s', async (locale, title, ogLocale) => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale }),
    });
    const pageUrl = `${PRIMARY_SITE_URL}/${locale}${PAGE_PATH}`;

    expect(metadata.title).toBe(title);
    expect(metadata.alternates?.canonical).toBe(pageUrl);
    expect(metadata.alternates?.languages).toEqual({
      id: `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
      en: `${PRIMARY_SITE_URL}/en${PAGE_PATH}`,
      'x-default': `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
    });
    expect(metadata.openGraph).toMatchObject({ url: pageUrl, locale: ogLocale });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it.each([
    ['id', ['Kursi lipat', 'Kursi susun besi spons', 'Kursi plastik']],
    ['en', ['Folding chair', 'Stackable padded steel chair', 'Plastic chair']],
  ] as const)('keeps the verified chair catalog in %s JSON-LD', async (locale, chairNames) => {
    const schema = await getChairSchema(locale);
    const pageUrl = `${PRIMARY_SITE_URL}/${locale}${PAGE_PATH}`;
    const offers = schema.hasOfferCatalog.itemListElement;

    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.url).toBe(pageUrl);
    expect(offers.map(({ itemOffered }) => itemOffered.name)).toEqual(chairNames);
    expect(offers.every(({ itemOffered }) => itemOffered.url === pageUrl)).toBe(true);
    expect(JSON.stringify(schema)).not.toMatch(/price|availability|instock/i);
  });
});
