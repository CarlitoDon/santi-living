import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';
import sitemap from './sitemap';

vi.mock('@/lib/notion', () => ({ getNotionPosts: vi.fn().mockResolvedValue([]) }));
vi.mock('@/lib/blog', () => ({ getAllPosts: vi.fn().mockReturnValue([]) }));

describe('sitemap canonical hygiene', () => {
  it('does not contain bare root URL that 307 redirects to /id', async () => {
    const entries = await sitemap();
    const nakedRoot = entries.find((e) => e.url === 'https://santiliving.com');
    expect(nakedRoot).toBeUndefined();
  });

  it('contains localized homepages with 200 OK', async () => {
    const entries = await sitemap();
    expect(entries.some((e) => e.url === 'https://santiliving.com/id')).toBe(true);
    expect(entries.some((e) => e.url === 'https://santiliving.com/en')).toBe(true);
  });

  it('does not contain non-indexed order page /pesan', async () => {
    const entries = await sitemap();
    expect(entries.some((e) => e.url.endsWith('/pesan'))).toBe(false);
  });

  it('does not contain redirected page /sewa-karpet', async () => {
    const entries = await sitemap();
    expect(entries.some((e) => e.url.endsWith('/sewa-karpet'))).toBe(false);
    expect(entries.some((e) => e.url.endsWith('/sewa-karpet-jogja'))).toBe(true);
  });
});

describe('landing page metadata canonical & alternates', () => {
  const landingPages = [
    { name: 'sewa-extra-bed-jogja', path: '/sewa-extra-bed-jogja', mod: () => import('./[locale]/sewa-extra-bed-jogja/page') },
    { name: 'sewa-cooling', path: '/sewa-cooling', mod: () => import('./[locale]/sewa-cooling/page') },
    { name: 'sewa-kasur-terdekat', path: '/sewa-kasur-terdekat', mod: () => import('./[locale]/sewa-kasur-terdekat/page') },
    { name: 'sewa-kipas-angin', path: '/sewa-kipas-angin', mod: () => import('./[locale]/sewa-kipas-angin/page') },
    { name: 'sewa-tv', path: '/sewa-tv', mod: () => import('./[locale]/sewa-tv/page') },
    { name: 'sewa-kasur-lipat', path: '/sewa-kasur-lipat', mod: () => import('./[locale]/sewa-kasur-lipat/page') },
    { name: 'sewa-selimut-jogja', path: '/sewa-selimut-jogja', mod: () => import('./[locale]/sewa-selimut-jogja/page') },
    { name: 'sewa-bantal-jogja', path: '/sewa-bantal-jogja', mod: () => import('./[locale]/sewa-bantal-jogja/page') },
    { name: 'sewa-kasur-bulanan', path: '/sewa-kasur-bulanan', mod: () => import('./[locale]/sewa-kasur-bulanan/page') },
    { name: 'sewa-karpet-merah-jogja', path: '/sewa-karpet-merah-jogja', mod: () => import('./[locale]/sewa-karpet-merah-jogja/page') },
    { name: 'sewa-karpet-permadani-jogja', path: '/sewa-karpet-permadani-jogja', mod: () => import('./[locale]/sewa-karpet-permadani-jogja/page') },
    { name: 'sewa-perlengkapan-event', path: '/sewa-perlengkapan-event', mod: () => import('./[locale]/sewa-perlengkapan-event/page') },
    { name: 'sewa-karpet-jogja', path: '/sewa-karpet-jogja', mod: () => import('./[locale]/sewa-karpet-jogja/page') },
    { name: 'sewa-kursi-acara', path: '/sewa-kursi-acara', mod: () => import('./[locale]/sewa-kursi-acara/page') },
    { name: 'harga-sewa-kasur', path: '/harga-sewa-kasur', mod: () => import('./[locale]/harga-sewa-kasur/page') },
    { name: 'about', path: '/about', mod: () => import('./[locale]/about/page') },
    { name: 'produk', path: '/produk', mod: () => import('./[locale]/produk/page') },
  ];

  for (const page of landingPages) {
    it(`generates correct canonical, alternates, and OG url for ${page.name}`, async () => {
      const pageMod = (await page.mod()) as {
        generateMetadata?: (arg: { params: Promise<{ locale: string }> }) => Promise<Metadata>;
      };
      const generateMetadata = pageMod.generateMetadata;
      expect(generateMetadata).toBeDefined();
      if (!generateMetadata) return;

      const metaId = await generateMetadata({ params: Promise.resolve({ locale: 'id' }) });
      expect(metaId.alternates?.canonical).toBe(`https://santiliving.com/id${page.path}`);
      expect((metaId.alternates?.languages as Record<string, string>)?.id).toBe(`https://santiliving.com/id${page.path}`);
      expect((metaId.alternates?.languages as Record<string, string>)?.en).toBe(`https://santiliving.com/en${page.path}`);
      expect((metaId.alternates?.languages as Record<string, string>)?.[ 'x-default' ]).toBe(`https://santiliving.com/id${page.path}`);
      expect(metaId.openGraph?.url).toBe(`https://santiliving.com/id${page.path}`);
      expect(metaId.robots).toEqual({ index: true, follow: true });

      const metaEn = await generateMetadata({ params: Promise.resolve({ locale: 'en' }) });
      expect(metaEn.alternates?.canonical).toBe(`https://santiliving.com/en${page.path}`);
      expect(metaEn.openGraph?.url).toBe(`https://santiliving.com/en${page.path}`);
    });
  }
});

describe('non-indexed pages have robots noindex nofollow', () => {
  const nonIndexedPages = [
    { name: 'cart', mod: () => import('./[locale]/cart/page') },
    { name: 'checkout', mod: () => import('./[locale]/checkout/page') },
    { name: 'pesan', mod: () => import('./[locale]/pesan/page') },
    { name: 'thank-you', mod: () => import('./[locale]/thank-you/page') },
    { name: 'pesanan/[token]', mod: () => import('./[locale]/pesanan/[token]/page') },
    { name: 'pesanan/[token]/terima-kasih', mod: () => import('./[locale]/pesanan/[token]/terima-kasih/page') },
  ];

  for (const page of nonIndexedPages) {
    it(`${page.name} specifies robots: { index: false, follow: false }`, async () => {
      const pageMod = await page.mod();
      const metadata = (pageMod as { metadata?: { robots?: unknown } }).metadata;
      expect(metadata?.robots).toEqual({ index: false, follow: false });
    });
  }
});
