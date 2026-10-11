import { describe, expect, it } from 'vitest';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import { buildAcaraMetadata } from './acara-seo';
import { buildKarpetMetadata } from './karpet-seo';

describe('SEO primary-domain policy', () => {
  it('localises carpet metadata without specialist hosts', () => {
    const metadata = buildKarpetMetadata(
      sewaKarpetPermadani,
      '/sewa-karpet-permadani-jogja',
      'en',
    );

    expect(metadata.alternates?.canonical).toBe(
      'https://santiliving.com/en/sewa-karpet-permadani-jogja',
    );
    expect(metadata.openGraph?.url).toBe(
      'https://santiliving.com/en/sewa-karpet-permadani-jogja',
    );
  });

  it('localises event metadata to the primary domain', () => {
    const metadata = buildAcaraMetadata(sewaAcara, 'id');

    expect(metadata.alternates?.canonical).toBe(
      'https://santiliving.com/id/sewa-perlengkapan-event',
    );
    expect(metadata.openGraph?.url).toBe(
      'https://santiliving.com/id/sewa-perlengkapan-event',
    );
  });
});
