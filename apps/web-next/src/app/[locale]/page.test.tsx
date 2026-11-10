/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/components/home/ServiceCatalog', () => ({ ServiceCatalog: () => null }));
vi.mock('@/components/home/CartBar', () => ({ CartBar: () => null }));
vi.mock('@/components/home/AutoLocationTrigger', () => ({ AutoLocationTrigger: () => null }));
vi.mock('@/components/home/HeroBackground', () => ({ HeroBackground: () => null }));
import HomePage from './page';

describe('HomePage', () => {
  it('renders LCP hero image preload links for mobile and desktop', async () => {
    const jsx = await HomePage({
      params: Promise.resolve({ locale: 'id' }),
    });

    const { container } = render(jsx);

    const mobilePreload = document.querySelector(
      'link[rel="preload"][href="/images/hero-pengiriman-santi-living-mobile.webp"]'
    );
    expect(mobilePreload).toBeTruthy();
    expect(mobilePreload?.getAttribute('as')).toBe('image');
    expect(mobilePreload?.getAttribute('media')).toBe('(max-width: 767px)');
    expect(mobilePreload?.getAttribute('fetchpriority')).toBe('high');

    const desktopPreload = document.querySelector(
      'link[rel="preload"][href="/images/hero-pengiriman-santi-living.webp"]'
    );
    expect(desktopPreload).toBeTruthy();
    expect(desktopPreload?.getAttribute('as')).toBe('image');
    expect(desktopPreload?.getAttribute('media')).toBe('(min-width: 768px)');
    expect(desktopPreload?.getAttribute('fetchpriority')).toBe('high');
  });
});
