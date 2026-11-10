/**
 * @vitest-environment jsdom
 */
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PriceTable } from './PriceTable';
import type { Product } from '@/types/product';

vi.mock('@/contexts/locale', () => ({
  useLocale: () => ({
    locale: 'id',
    t: (key: string) => {
      const translations: Record<string, string> = {
        'pricing.table_size': 'Ukuran',
        'pricing.table_dimensions': 'Dimensi',
        'pricing.table_capacity': 'Kapasitas',
        'pricing.table_price_day': 'Harga/Hari',
        'pricing.table_price_week': 'Harga/Minggu',
        'pricing.table_price_month': 'Harga/Bulan',
        'pricing.per_day': 'per hari',
      };
      return translations[key] ?? key;
    },
  }),
}));
const mockItems: Product[] = [
  {
    id: 'single',
    name: 'Kasur Single 90x200',
    shortName: 'Single 90',
    description: 'Kasur busa empuk ukuran single',
    dimensions: '90 x 200 x 15 cm',
    capacity: '1 Orang',
    pricePerDay: 40000,
    costPrice: 20000,
    image: '/images/kasur-single.webp',
    includes: ['Kasur Single'],
    category: 'mattress',
  },
];

describe('PriceTable', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders mobile cards with interactive styling and stretched link', () => {
    const { container } = render(
      <PriceTable
        title="Daftar Harga Kasur Busa"
        desc="Harga sewa transparan tanpa biaya tersembunyi"
        items={mockItems}
        type="mattress"
      />
    );

    const mobileContainer = container.querySelector('.md\\:hidden');
    expect(mobileContainer).toBeTruthy();

    const mobileCard = mobileContainer?.querySelector('article');
    expect(mobileCard).toBeTruthy();

    // Verify relative positioning, hover, and active feedback
    expect(mobileCard?.className).toContain('relative');
    expect(mobileCard?.className).toContain('cursor-pointer');
    expect(mobileCard?.className).toContain('active:scale-[0.99]');
    expect(mobileCard?.className).toContain('active:border-emerald-400');
    expect(mobileCard?.className).toContain('transition-all');

    // Verify WhatsAppLink inside the mobile card uses stretched-link pattern
    const mobileLink = mobileCard?.querySelector('a[data-wa-location="pricetable_mobile"]');
    expect(mobileLink).toBeTruthy();
    expect(mobileLink?.className).toContain('before:content-[\'\']');
    expect(mobileLink?.className).toContain('before:absolute');
    expect(mobileLink?.className).toContain('before:inset-0');
    expect(mobileLink?.className).toContain('before:z-0');

    // Verify WhatsAppLink href and attributes
    expect(mobileLink?.getAttribute('href')).toContain('/api/wa?');
    expect(mobileLink?.getAttribute('data-wa-source')).toBe('pricetable_mattress_single');
    expect(mobileLink?.getAttribute('data-product-category')).toBe('kasur');
  });
});
