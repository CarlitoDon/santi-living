'use client';

import Link from 'next/link';
import { products } from '@/data/products';
import { config } from '@/data/config';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Product } from '@/types/product';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function PriceTable({ title, items, type }: { title: string; items: Product[]; type: string }) {
  return (
    <div className="price-section">
      <h2 className="price-section-title">{title}</h2>
      <div className="price-table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Ukuran</th>
              <th>Dimensi</th>
              <th>Harga/Hari</th>
              <th>Kapasitas</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="product-name">{item.shortName}</td>
                <td>{item.dimensions}</td>
                <td className="price-cell">{formatPrice(item.pricePerDay)}</td>
                <td>{item.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {type === 'package' && (
        <p className="package-note">
          * Paket termasuk: kasur busa + sprei + bantal + selimut
        </p>
      )}
    </div>
  );
}

export default function HargaSewaKasurPage() {
  const itemListSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'OfferCatalog' as const,
    name: 'Daftar Harga Sewa Kasur Busa Jogja',
    description: 'Harga sewa kasur busa harian di Yogyakarta - Santi Living',
    numberOfItems: products.mattressPackages.length + products.mattressOnly.length,
    itemListElement: [
      ...products.mattressPackages.map((p, i) => ({
        '@type': 'ListItem' as const,
        position: i + 1,
        item: {
          '@type': 'Product' as const,
          name: p.name,
          description: p.description,
          offers: {
            '@type': 'Offer' as const,
            price: p.pricePerDay,
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization' as const, name: 'Santi Living' },
          },
        },
      })),
    ],
  };

  return (
    <main style={{ paddingTop: '70px' }}>
      <JsonLd data={itemListSchema} />

      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        padding: 'var(--space-10) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'white', marginBottom: 'var(--space-2)' }}>
            Harga Sewa Kasur Busa Jogja
          </h1>
          <p style={{ opacity: 0.9 }}>
            Mulai dari {formatPrice(products.mattressOnly[0].pricePerDay)}/hari — bersih, nyaman, antar jemput.
          </p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container">
          <PriceTable title="Paket Lengkap (Kasur + Sprei + Bantal + Selimut)" items={products.mattressPackages} type="package" />
          <PriceTable title="Kasur Saja (Tanpa Perlengkapan)" items={products.mattressOnly} type="mattress" />
          <PriceTable title="Aksesoris Tambahan" items={products.accessories} type="accessory" />

          {/* Volume Discount Info */}
          <div className="discount-info">
            <h3>💡 Hemat Lebih Banyak!</h3>
            <ul>
              {config.volumeDiscounts.filter(d => d.discount > 0).map((d, i) => (
                <li key={i}>
                  Sewa {d.minQty}+ unit: <strong>{d.label}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link href="/#calculator" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Hitung Biaya Sewa Sekarang
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .price-section { margin-bottom: var(--space-8); }
        .price-section-title { font-size: var(--font-size-lg); margin-bottom: var(--space-4); padding-bottom: var(--space-2); border-bottom: 2px solid var(--color-primary); }
        .price-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .price-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
        .price-table th { background: var(--color-surface); padding: var(--space-3); text-align: left; font-weight: var(--font-weight-semibold); border-bottom: 2px solid var(--color-border); white-space: nowrap; }
        .price-table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); }
        .product-name { font-weight: var(--font-weight-medium); }
        .price-cell { color: var(--color-primary); font-weight: var(--font-weight-bold); white-space: nowrap; }
        .package-note { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-2); }
        .discount-info { background: var(--color-primary-light); padding: var(--space-5); border-radius: var(--radius-lg); margin-top: var(--space-6); }
        .discount-info h3 { margin-bottom: var(--space-3); }
        .discount-info ul { list-style: disc; padding-left: var(--space-6); }
        .discount-info li { margin-bottom: var(--space-1); font-size: var(--font-size-sm); }
      `}</style>
    </main>
  );
}
