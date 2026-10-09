import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '' }),
  Noto_Serif: () => ({ variable: '' }),
}));
import idDict from '@/locales/id.json';
import { config } from '@/data/config';
import { generateMetadata as generateHargaSewaKasurMetadata } from './[locale]/harga-sewa-kasur/page';
import { generateMetadata as generateArtikelMetadata } from './[locale]/artikel/page';
import { generateMetadata as generateProdukMetadata } from './[locale]/produk/page';
import { metadata as thankYouMetadata } from './[locale]/thank-you/page';
import { metadata as cartMetadata } from './[locale]/cart/page';
import { metadata as pesananTokenMetadata } from './[locale]/pesanan/[token]/page';
import { metadata as pesananTokenTerimaKasihMetadata } from './[locale]/pesanan/[token]/terima-kasih/page';
import { generateMetadata as generateSewaKarpetMetadata } from './[locale]/sewa-karpet-jogja/page';
import { generateMetadata as generateLayoutMetadata } from './[locale]/layout';

describe('SEO Action Plan fixes', () => {
  describe('1. Title duplication fixes', () => {
    it('harga-sewa-kasur does not duplicate site name in title property', async () => {
      const metaId = await generateHargaSewaKasurMetadata({ params: Promise.resolve({ locale: 'id' }) });
      expect(metaId.title).toBe('Harga Sewa Kasur di Jogja — Update 2026');

      const metaEn = await generateHargaSewaKasurMetadata({ params: Promise.resolve({ locale: 'en' }) });
      expect(metaEn.title).toBe('Mattress Rental Prices in Jogja — 2026');
    });

    it('artikel does not duplicate site name in title property', async () => {
      const metaId = await generateArtikelMetadata({ params: Promise.resolve({ locale: 'id' }) });
      expect(metaId.title).toBe('Artikel & Tips');

      const metaEn = await generateArtikelMetadata({ params: Promise.resolve({ locale: 'en' }) });
      expect(metaEn.title).toBe('Articles & Tips');
    });

    it('produk does not duplicate site name in title property', async () => {
      const metaId = await generateProdukMetadata({ params: Promise.resolve({ locale: 'id' }) });
      expect(metaId.title).toBe('Katalog Produk Sewa Kasur & Perlengkapan Tidur');

      const metaEn = await generateProdukMetadata({ params: Promise.resolve({ locale: 'en' }) });
      expect(metaEn.title).toBe('Mattress & Sleep Gear Rental Catalog');
    });

    it('thank-you has trimmed title', () => {
      expect(thankYouMetadata.title).toBe('Terima Kasih');
    });

    it('cart has trimmed title', () => {
      expect(cartMetadata.title).toBe('Edit Pesanan');
    });

    it('pesanan token has trimmed title', () => {
      expect(pesananTokenMetadata.title).toBe('Detail Pesanan');
    });

    it('pesanan token terima-kasih has trimmed title', () => {
      expect(pesananTokenTerimaKasihMetadata.title).toBe('Terima Kasih - Pesanan Dikonfirmasi');
    });
  });

  describe('2. Meta description trim and typo fix', () => {
    it('sewa-karpet-jogja has corrected typo Antar jemput and trimmed text', async () => {
      const meta = await generateSewaKarpetMetadata({ params: Promise.resolve({ locale: 'id' }) });
      expect(meta.description).toBe(
        'Sewa karpet & permadani Jogja mulai Rp25.000/hari untuk tahlilan, aqiqah, pengajian, dan pernikahan di Sleman, Kota Jogja, Bantul. Antar jemput & free konsultasi.'
      );
      expect(meta.description).not.toContain('Anta jemput');
    });

    it('id.json seo.home_desc matches trimmed text', () => {
      expect(idDict.seo.home_desc).toBe(
        'Sewa kasur, kursi acara, dan karpet di Jogja. Praktis, bersih, steril, dan siap antar jemput cepat ke Sleman, Kota Jogja, Bantul via WhatsApp Santi Living.'
      );
    });
    it('layout fallback description matches trimmed text', async () => {
      const meta = await generateLayoutMetadata({
        params: Promise.resolve({ locale: 'id' }),
        children: null,
      });
      expect(meta.description).toBe(
        'Sewa kasur, kursi acara, dan karpet di Jogja. Praktis, bersih, steril, dan siap antar jemput cepat ke Sleman, Kota Jogja, Bantul via WhatsApp Santi Living.'
      );
    });
  });

  describe('5. Config whatsappUrl is configured', () => {
    it('config exports whatsappUrl', () => {
      expect(config.whatsappUrl).toBe('https://wa.me/6289519119092');
    });
  });
});
