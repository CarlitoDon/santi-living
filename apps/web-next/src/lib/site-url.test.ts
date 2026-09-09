import { describe, expect, it } from 'vitest';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from './site-url';

describe('site URL policy', () => {
  it('keeps the primary origin stable', () => {
    expect(PRIMARY_SITE_URL).toBe('https://santiliving.com');
    expect(primarySiteUrl('/artikel')).toBe('https://santiliving.com/artikel');
  });

  it('adds exactly one supported locale prefix', () => {
    expect(localizedSiteUrl('/sewa-kursi-acara', 'id')).toBe(
      'https://santiliving.com/id/sewa-kursi-acara',
    );
    expect(localizedSiteUrl('sewa-karpet-jogja/', 'en')).toBe(
      'https://santiliving.com/en/sewa-karpet-jogja',
    );
    expect(localizedSiteUrl('/about', 'fr')).toBe('https://santiliving.com/id/about');
  });
});
