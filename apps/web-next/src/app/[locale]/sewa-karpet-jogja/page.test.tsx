import { Children, isValidElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import SewaKarpetJogjaPage, { generateMetadata } from './page';

const PRIMARY_SITE_URL = 'https://santiliving.com';
const PAGE_PATH = '/sewa-karpet-jogja';
const PAGE_TITLE = 'Sewa Karpet & Permadani Jogja — Harga Mulai Rp25.000/Hari';

type JsonLdScript = ReactElement<{
  dangerouslySetInnerHTML?: { __html?: string };
}>;

async function getJsonLd(locale: 'id' | 'en') {
  const page = await SewaKarpetJogjaPage({
    params: Promise.resolve({ locale }),
  });

  return Children.toArray(page.props.children)
    .filter(
      (child): child is JsonLdScript =>
        isValidElement(child) && child.type === 'script',
    )
    .map((script) => JSON.parse(script.props.dangerouslySetInnerHTML?.__html ?? '{}'));
}

describe('sewa karpet Jogja SEO output', () => {
  it.each(['id', 'en'] as const)('uses the layout brand template once for %s', async (locale) => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale }),
    });
    const pageUrl = `${PRIMARY_SITE_URL}/${locale}${PAGE_PATH}`;

    expect(metadata.title).toBe(PAGE_TITLE);
    expect(String(metadata.title)).not.toMatch(/\|\s*Santi Living\s*$/);
    expect(`${metadata.title} | Santi Living`).toBe(`${PAGE_TITLE} | Santi Living`);
    expect(metadata.alternates?.canonical).toBe(pageUrl);
    expect(metadata.openGraph).toMatchObject({
      title: PAGE_TITLE,
      url: pageUrl,
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('keeps JSON-LD URLs on the primary domain for both locales', async () => {
    for (const locale of ['id', 'en'] as const) {
      const schemas = await getJsonLd(locale);
      const pageUrl = `${PRIMARY_SITE_URL}/${locale}${PAGE_PATH}`;

      expect(schemas).toHaveLength(3);
      expect(JSON.stringify(schemas)).not.toMatch(
        /(?:karpet|permadani|acara|kipas-angin)\.santiliving\.com/,
      );
      expect(schemas).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ '@type': 'Service', url: pageUrl }),
          expect.objectContaining({ '@type': 'BreadcrumbList' }),
          expect.objectContaining({ '@type': 'FAQPage' }),
        ]),
      );
    }
  });
});
