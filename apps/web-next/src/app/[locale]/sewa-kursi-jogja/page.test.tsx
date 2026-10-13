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

describe('Sewa Kursi Jogja Page', () => {
  describe('Static params', () => {
    it('generates static params for id and en locales', () => {
      const params = generateStaticParams();
      expect(params).toEqual([{ locale: 'id' }, { locale: 'en' }]);
    });
  });

  describe('SEO & Metadata', () => {
    it('renders metadata correctly for Indonesian (id) locale', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'id' }),
      });
      const pageUrl = `${PRIMARY_SITE_URL}/id${PAGE_PATH}`;

      expect(metadata.title).toBe(
        'Sewa Kursi Jogja — Kursi Plastik, Lipat & Susun Mulai Rp3.000/Unit | Santi Living',
      );
      expect(metadata.description).toBe(
        'Sewa kursi Jogja murah dan siap antar untuk hajatan, pengajian, rapat & pernikahan di Sleman, Kota Jogja, Bantul, Kulon Progo. Stok ratusan unit siap kirim hari ini.',
      );
      expect(metadata.keywords).toEqual([
        'sewa kursi jogja',
        'rental kursi jogja',
        'sewa kursi plastik jogja',
        'sewa kursi lipat jogja',
        'sewa kursi hajatan jogja',
        'sewa kursi futura jogja',
      ]);
      expect(metadata.alternates?.canonical).toBe(pageUrl);
      expect(metadata.alternates?.languages).toEqual({
        id: `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
        en: `${PRIMARY_SITE_URL}/en${PAGE_PATH}`,
        'x-default': `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
      });
      expect(metadata.openGraph).toMatchObject({
        title: 'Sewa Kursi Jogja — Kursi Plastik, Lipat & Susun Mulai Rp3.000/Unit | Santi Living',
        url: pageUrl,
        locale: 'id_ID',
        siteName: 'Santi Living',
      });
      expect(metadata.robots).toEqual({ index: true, follow: true });
    });

    it('renders metadata correctly for English (en) locale', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: 'en' }),
      });
      const pageUrl = `${PRIMARY_SITE_URL}/en${PAGE_PATH}`;

      expect(metadata.title).toBe(
        'Event Chair Rental Yogyakarta — Plastic, Folding & Banquet Chairs | Santi Living',
      );
      expect(metadata.description).toBe(
        'Affordable event chair rental in Yogyakarta for celebrations, gatherings, meetings & weddings in Sleman, Yogyakarta City, Bantul, Kulon Progo. Hundreds of units ready for delivery.',
      );
      expect(metadata.alternates?.canonical).toBe(pageUrl);
      expect(metadata.alternates?.languages).toEqual({
        id: `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
        en: `${PRIMARY_SITE_URL}/en${PAGE_PATH}`,
        'x-default': `${PRIMARY_SITE_URL}/id${PAGE_PATH}`,
      });
      expect(metadata.openGraph).toMatchObject({
        title: 'Event Chair Rental Yogyakarta — Plastic, Folding & Banquet Chairs | Santi Living',
        url: pageUrl,
        locale: 'en_US',
      });
    });
  });

  describe('JSON-LD Structured Data', () => {
    it('renders Product and FAQ schemas in JSON-LD', async () => {
      const page = await SewaKursiJogjaPage({
        params: Promise.resolve({ locale: 'id' }),
      });

      const jsonLdElements = Children.toArray(page.props.children).filter(
        (child): child is JsonLdComponent =>
          isValidElement(child) && child.type === JsonLd,
      );

      expect(jsonLdElements).toHaveLength(2);

      const productSchema = jsonLdElements[0].props.data;
      const faqSchema = jsonLdElements[1].props.data;

      // Product Schema assertions
      expect(productSchema['@type']).toBe('Product');
      expect(productSchema.name).toContain('Sewa Kursi Jogja');
      expect(productSchema.brand).toEqual({ '@type': 'Brand', name: 'Santi Living' });
      const offers = productSchema.offers as {
        '@type': string;
        lowPrice: number;
        highPrice: number;
        offerCount: number;
        offers: Array<{ name: string; price: number }>;
      };
      expect(offers['@type']).toBe('AggregateOffer');
      expect(offers.lowPrice).toBe(3000);
      expect(offers.highPrice).toBe(25000);
      expect(offers.offerCount).toBe(4);
      expect(offers.offers.map((o) => o.name)).toEqual([
        'Kursi Plastik Napolly Biru/Merah',
        'Kursi Lipat Chitose Besi',
        'Kursi Susun Futura Busa Padded',
        'Meja Acara / Prasmanan',
      ]);

      // FAQ Schema assertions
      expect(faqSchema['@type']).toBe('FAQPage');
      const mainEntity = faqSchema.mainEntity as Array<{
        '@type': string;
        name: string;
        acceptedAnswer: { text: string };
      }>;
      expect(mainEntity).toHaveLength(5);
      expect(mainEntity[0].name).toContain('tarif sewa kursi');
      expect(mainEntity[2].name).toContain('Wilayah mana saja');
      expect(mainEntity[2].acceptedAnswer.text).toContain('tidak melayani pengiriman ke Gunungkidul maupun Solo');
    });
  });

  describe('Page Rendering & Content', () => {
    it('renders hero, form, catalog, packages, delivery zones, and FAQs', async () => {
      const page = await SewaKursiJogjaPage({
        params: Promise.resolve({ locale: 'id' }),
      });

      render(page);

      // Hero assertions
      expect(screen.getByRole('heading', { level: 1, name: /sewa kursi jogja/i })).toBeTruthy();
      expect(screen.getByText(/100\+ ulasan maps/i)).toBeTruthy();
      expect(screen.getByText(/siap antar se-diy/i)).toBeTruthy();
      expect(screen.getAllByText(/mulai rp3\.000\/unit/i)[0]).toBeTruthy();

      // Lead capture form assertions
      expect(screen.getByLabelText(/nama lengkap/i)).toBeTruthy();
      expect(screen.getByLabelText(/nomor whatsapp/i)).toBeTruthy();

      // Catalog assertions
      expect(screen.getByText('Kursi Plastik Napolly Biru/Merah')).toBeTruthy();
      expect(screen.getByText('Kursi Lipat Chitose Besi')).toBeTruthy();
      expect(screen.getByText('Kursi Susun Futura Busa Padded')).toBeTruthy();
      expect(screen.getByText('Meja Acara / Prasmanan')).toBeTruthy();

      // Package assertions
      expect(screen.getByText('Paket 50 Unit')).toBeTruthy();
      expect(screen.getByText('Rp150.000')).toBeTruthy();
      expect(screen.getByText('Paket 100 Unit')).toBeTruthy();
      expect(screen.getByText('Rp300.000')).toBeTruthy();
      expect(screen.getByText('Paket 200 Unit')).toBeTruthy();
      expect(screen.getByText('Rp600.000')).toBeTruthy();

      // Delivery zones assertions (Sleman, Kota Jogja, Bantul, Kulon Progo - without Gunungkidul/Solo)
      expect(screen.getByText(/✓ Sleman/i)).toBeTruthy();
      expect(screen.getByText(/✓ Kota Jogja/i)).toBeTruthy();
      expect(screen.getByText(/✓ Bantul/i)).toBeTruthy();
      expect(screen.getByText(/✓ Kulon Progo/i)).toBeTruthy();
      expect(
        screen.getByText(/tidak melayani pengiriman ke wilayah gunungkidul maupun solo/i),
      ).toBeTruthy();

      // 5 FAQs
      expect(screen.getByText(/pertanyaan seputar sewa kursi jogja/i)).toBeTruthy();
      expect(screen.getByText(/berapa tarif sewa kursi di jogja via santi living\?/i)).toBeTruthy();
      expect(screen.getByText(/wilayah mana saja yang dicakup untuk pengiriman kursi\?/i)).toBeTruthy();
    });
  });
});
