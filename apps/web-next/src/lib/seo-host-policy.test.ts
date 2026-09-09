import { describe, expect, it } from 'vitest';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import {
  buildAcaraMetadata,
  buildAcaraServiceSchema,
} from './acara-seo';
import {
  buildKarpetBreadcrumbSchema,
  buildKarpetMetadata,
  buildKarpetServiceSchema,
} from './karpet-seo';

describe('SEO primary-domain policy', () => {
  it('localises carpet metadata and schemas without specialist hosts', () => {
    const metadata = buildKarpetMetadata(
      sewaKarpetPermadani,
      '/sewa-karpet-permadani-jogja',
      'en',
    );
    const service = buildKarpetServiceSchema(
      sewaKarpetPermadani,
      '/sewa-karpet-permadani-jogja',
      'Decorative rug rental',
      'en',
    );
    const breadcrumb = buildKarpetBreadcrumbSchema([
      { name: 'Home', path: '' },
      { name: 'Decorative rugs', path: '/sewa-karpet-permadani-jogja' },
    ], 'en');

    expect(metadata.alternates?.canonical).toBe(
      'https://santiliving.com/en/sewa-karpet-permadani-jogja',
    );
    expect(metadata.openGraph?.url).toBe(
      'https://santiliving.com/en/sewa-karpet-permadani-jogja',
    );
    expect(JSON.stringify({ service, breadcrumb })).not.toMatch(
      /(?:karpet|permadani|acara|kipas-angin)\.santiliving\.com/,
    );
  });

  it('localises event metadata and schema to the primary domain', () => {
    const metadata = buildAcaraMetadata(sewaAcara, 'id');
    const schema = buildAcaraServiceSchema(sewaAcara, 'id');

    expect(metadata.alternates?.canonical).toBe(
      'https://santiliving.com/id/sewa-perlengkapan-event',
    );
    expect(JSON.stringify(schema)).toContain(
      'https://santiliving.com/id/sewa-perlengkapan-event',
    );
    expect(JSON.stringify(schema)).not.toMatch(
      /(?:karpet|permadani|acara|kipas-angin)\.santiliving\.com/,
    );
  });
});
