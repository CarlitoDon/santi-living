import { describe, expect, it } from 'vitest';
import { mainSiteHref } from './mainSiteHref';

describe('mainSiteHref', () => {
  it.each([
    'karpet.santiliving.com',
    'acara.santiliving.com',
    'permadani.santiliving.com',
    'kipas-angin.santiliving.com',
  ])('returns the primary production host from %s', (hostname) => {
    expect(mainSiteHref('/', 'id', { hostname })).toBe('https://santiliving.com/id');
    expect(mainSiteHref('/artikel', 'en', { hostname })).toBe('https://santiliving.com/en/artikel');
    expect(mainSiteHref('/#service-area', 'id', { hostname })).toBe('https://santiliving.com/id#service-area');
  });

  it('keeps primary-host navigation relative', () => {
    expect(mainSiteHref('/produk', 'id', { hostname: 'santiliving.com' })).toBe('/id/produk');
  });

  it('returns to the local primary host during subdomain development', () => {
    expect(mainSiteHref('/', 'en', {
      hostname: 'karpet.localhost',
      protocol: 'http:',
      port: '3000',
    })).toBe('http://localhost:3000/en');
  });

  it('does not alter external links', () => {
    expect(mainSiteHref('https://acara.santiliving.com/sewa-perlengkapan-event', 'id', {
      hostname: 'karpet.santiliving.com',
    })).toBe('https://acara.santiliving.com/sewa-perlengkapan-event');
  });
});
