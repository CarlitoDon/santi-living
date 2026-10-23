/**
 * @vitest-environment jsdom
 */
import { Children, isValidElement, type ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from '@/components/seo/JsonLd';
import SewaKursiJogjaPage, { generateMetadata, generateStaticParams } from './page';

const PRIMARY_SITE_URL = 'https://santiliving.com';
const PAGE_PATH = '/sewa-kursi-jogja';

type JsonLdComponent = ReactElement<{ data: Record<string, unknown> }>;

type ServiceSchema = {
  '@type': string;
  '@id': string;
  url: string;
  areaServed: Array<{ name: string }>;
  provider: { address: { streetAddress: string } };
  hasOfferCatalog: {
    '@type': string;
    itemListElement: Array<{
      price: number;
      priceSpecification: { unitText: string };
      itemOffered: { name: string };
    }>;
  };
};

function collectStrings(value: unknown, seen = new Set<object>()): string {
  if (typeof value === 'string') return value;
  if (value === null || typeof value !== 'object') return '';
  if (seen.has(value)) return '';
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => collectStrings(item, seen)).join(' ');
  return Object.values(value).map((item) => collectStrings(item, seen)).join(' ');
}

describe('Sewa Kursi Jogja Page', () => {
  it('generates static params for id and en locales', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'id' }, { locale: 'en' }]);
  });

  it('keeps the exact canonical title and enables indexing for Indonesian', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'id' }) });
    const pageUrl = `${PRIMARY_SITE_URL}/id${PAGE_PATH}`;

    expect(metadata.title).toBe('Sewa Kursi Jogja — Kursi Plastik, Lipat & Hotel Mulai Rp3.000/Unit');
    expect(metadata.alternates?.canonical).toBe(pageUrl);
    expect(metadata.alternates?.languages).toEqual({
      id: `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
      en: `${PRIMARY_SITE_URL}/en${PAGE_PATH}`,
      'x-default': `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
    });
    expect(metadata.openGraph).toMatchObject({ url: pageUrl, locale: 'id_ID' });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('keeps English metadata on the same canonical path', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });
    const pageUrl = `${PRIMARY_SITE_URL}/en${PAGE_PATH}`;

    expect(metadata.title).toBe('Event Chair Rental Yogyakarta — Plastic, Folding & Hotel Chairs');
    expect(metadata.alternates?.canonical).toBe(pageUrl);
    expect(metadata.openGraph).toMatchObject({ url: pageUrl, locale: 'en_US' });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('emits Service, OfferCatalog, and FAQPage schema', async () => {
    const page = await SewaKursiJogjaPage({ params: Promise.resolve({ locale: 'id' }) });
    const jsonLdElements = Children.toArray(page.props.children).filter(
      (child): child is JsonLdComponent => isValidElement(child) && child.type === JsonLd,
    );

    expect(jsonLdElements).toHaveLength(2);

    const service = jsonLdElements[0].props.data as unknown as ServiceSchema;
    const faq = jsonLdElements[1].props.data as { '@type': string; mainEntity: Array<{ name: string }> };

    expect(service['@type']).toBe('Service');
    expect(service.url).toBe(`${PRIMARY_SITE_URL}/id${PAGE_PATH}`);
    expect(service.provider.address.streetAddress).toBe('Jl. Godean KM 10');
    expect(service.areaServed.map((area) => area.name)).toEqual([
      'Sleman',
      'Kota Jogja',
      'Bantul',
      'Kulon Progo',
    ]);

    expect(service.hasOfferCatalog['@type']).toBe('OfferCatalog');
    const offers = service.hasOfferCatalog.itemListElement;
    expect(offers.map((offer) => offer.itemOffered.name)).toEqual([
      'Kursi Plastik',
      'Kursi Lipat Seminar',
      'Kursi Hotel VIP',
    ]);
    expect(offers.map((offer) => offer.price)).toEqual([3000, 5000, 7000]);
    expect(offers.every((offer) => offer.priceSpecification.unitText === 'per unit per hari')).toBe(true);

    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(10);
    expect(faq.mainEntity.map((entry) => entry.name)).toEqual(
      expect.arrayContaining([
        'Jenis kursi apa yang bisa ditanyakan?',
        'Berapa minimal order sewa kursi dan bagaimana pengirimannya?',
        'Sebaiknya pesan berapa lama sebelumnya?',
      ]),
    );
  });

  it('renders the merged content, prices, delivery scope, and WhatsApp CTA', async () => {
    const page = await SewaKursiJogjaPage({ params: Promise.resolve({ locale: 'id' }) });
    render(page);

    expect(screen.getByRole('heading', { level: 1, name: 'Sewa Kursi Jogja' })).toBeTruthy();
    expect(screen.getByLabelText(/nama lengkap/i)).toBeTruthy();
    expect(screen.getByLabelText(/nomor whatsapp/i)).toBeTruthy();

    expect(screen.getByText('Kursi Plastik')).toBeTruthy();
    expect(screen.getByText('Kursi Lipat Seminar')).toBeTruthy();
    expect(screen.getByText('Kursi Hotel VIP')).toBeTruthy();
    expect(screen.getByText('Meja Acara / Prasmanan')).toBeTruthy();
    expect(screen.getByText('Karpet Permadani')).toBeTruthy();

    expect(screen.getAllByText('Rp3.000/unit/hari').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rp5.000/unit/hari').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rp7.000/unit/hari').length).toBeGreaterThan(0);

    expect(screen.getByText(/✓ Sleman/i)).toBeTruthy();
    expect(screen.getByText(/✓ Kota Jogja/i)).toBeTruthy();
    expect(screen.getByText(/✓ Bantul/i)).toBeTruthy();
    expect(screen.getAllByText(/jl\. godean km 10/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/tidak melayani pengiriman ke gunungkidul maupun solo/i).length).toBeGreaterThan(0);

    const waLink = screen.getByRole('link', { name: /cek stok via whatsapp/i });
    expect(waLink.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/6289519119092\?text=/);
    expect(screen.getAllByText(/0895-1911-9092/).length).toBeGreaterThan(0);
  });

  it('keeps price and address invariants across both locales', async () => {
    for (const locale of ['id', 'en'] as const) {
      const page = await SewaKursiJogjaPage({ params: Promise.resolve({ locale }) });
      const rendered = collectStrings(page);

      expect(rendered).not.toMatch(/chitose|futura|napolly|tiffany/i);
      expect(rendered).not.toMatch(/km\s*4\b/i);
      expect(rendered).toContain('Jl. Godean KM 10');
      expect(rendered).toContain(locale === 'en' ? 'Rp3,000/unit/day' : 'Rp3.000/unit/hari');
      expect(rendered).toContain(locale === 'en' ? 'Rp5,000/unit/day' : 'Rp5.000/unit/hari');
      expect(rendered).toContain(locale === 'en' ? 'Rp7,000/unit/day' : 'Rp7.000/unit/hari');
    }
  });
});
