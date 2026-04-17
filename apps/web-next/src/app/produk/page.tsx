'use client';

import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import type { Product } from '@/types/product';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Image src={product.image} alt={product.name} width={300} height={200} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        {product.dimensions && <p className="product-dims">{product.dimensions} • {product.capacity}</p>}
        <div className="product-price">{formatPrice(product.pricePerDay)}<span>/hari</span></div>
        {product.includes && product.includes.length > 0 && (
          <ul className="product-includes">
            {product.includes.map((item, i) => (
              <li key={i}>✓ {item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        padding: 'var(--space-8) 0',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 'var(--space-2)' }}>Katalog Produk</h1>
          <p style={{ opacity: 0.9 }}>Semua ukuran kasur busa & aksesoris untuk kebutuhan Anda</p>
        </div>
      </section>

      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container">
          <h2 className="cat-title">Paket Lengkap</h2>
          <p className="cat-note">Kasur + Sprei + Bantal + Selimut</p>
          <div className="product-grid">
            {products.mattressPackages.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <h2 className="cat-title" style={{ marginTop: 'var(--space-10)' }}>Kasur Saja</h2>
          <p className="cat-note">Tanpa perlengkapan</p>
          <div className="product-grid">
            {products.mattressOnly.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <h2 className="cat-title" style={{ marginTop: 'var(--space-10)' }}>Aksesoris</h2>
          <div className="product-grid product-grid-small">
            {products.accessories.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link href="/#calculator" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Hitung Biaya Sewa
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .cat-title { font-size: var(--font-size-xl); margin-bottom: var(--space-1); }
        .cat-note { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-6); }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-4); }
        .product-grid-small { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
        .product-card { background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; }
        .product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .product-image-wrapper { background: var(--color-surface); }
        .product-info { padding: var(--space-4); }
        .product-name { font-size: var(--font-size-base); margin-bottom: var(--space-1); }
        .product-desc { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-2); }
        .product-dims { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-2); }
        .product-price { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-primary); }
        .product-price span { font-size: var(--font-size-sm); font-weight: var(--font-weight-normal); color: var(--color-text-secondary); }
        .product-includes { list-style: none; padding: 0; margin-top: var(--space-3); border-top: 1px solid var(--color-border); padding-top: var(--space-2); }
        .product-includes li { font-size: var(--font-size-xs); color: var(--color-text-secondary); padding: 2px 0; }
      `}</style>
    </main>
  );
}
