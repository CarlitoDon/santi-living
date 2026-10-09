/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingPage } from './LandingPage';
import { sewaExtraBedJogja } from '@/data/landing-pages/sewa-extra-bed-jogja';

vi.mock('@/contexts/locale', () => ({
  useLocale: () => ({ locale: 'id' }),
  useT: () => (key: string) => key,
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

describe('LandingPage JSON-LD Schemas', () => {
  it('renders Service and FAQPage schema scripts when priceCards and faqs are present', () => {
    const { container } = render(<LandingPage config={sewaExtraBedJogja} />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');

    expect(scripts.length).toBeGreaterThanOrEqual(2);

    const schemas = Array.from(scripts).map((s) => JSON.parse(s.textContent || '{}'));
    const serviceSchema = schemas.find((s) => s['@type'] === 'Service');
    const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');

    expect(serviceSchema).toBeDefined();
    expect(serviceSchema?.name).toBe(sewaExtraBedJogja.hero.title);
    expect(serviceSchema?.provider).toEqual({
      '@type': 'LocalBusiness',
      name: 'Santi Living',
      telephone: '+6289519119092',
      url: 'https://santiliving.com',
    });
    expect(serviceSchema?.hasOfferCatalog?.itemListElement?.length).toBe(
      sewaExtraBedJogja.priceCards?.length,
    );

    expect(faqSchema).toBeDefined();
    expect(faqSchema?.mainEntity?.length).toBe(sewaExtraBedJogja.faqs?.length);
  });
});
