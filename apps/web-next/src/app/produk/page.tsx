'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import { ProductCard, ProductModal } from '@/components/produk/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { generateProductSchemaList } from '@/utils/seo';
import type { Product } from '@/types/product';

export default function ProdukPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Katalog Sewa Kasur Jogja - Santi Living",
    "description": "Daftar lengkap kasur busa, springbed harian, dan perlengkapan tidur untuk disewa di Yogyakarta.",
    "itemListElement": [
      ...generateProductSchemaList(products.mattressPackages, 1),
      ...generateProductSchemaList(products.mattressOnly, products.mattressPackages.length + 1)
    ]
  };

  const openModal = (product: Product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <main className="pt-[80px]">
      <JsonLd data={productSchema} />
      <PageHero 
        title="Katalog Produk" 
        subtitle="Semua ukuran kasur busa & aksesoris untuk kebutuhan Anda" 
      />

      <section className="py-8 pb-12">
        <div className="container">
          <h2 className="text-2xl mb-1 text-slate-900 font-bold">📦 Paket Lengkap</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">Kasur Busa + Sprei + Bantal + Selimut</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.mattressPackages.map((p) => (
              <ProductCard key={p.id} product={{...p, category: 'package'}} onClick={() => openModal({...p, category: 'package'})} />
            ))}
          </div>

          <h2 className="text-2xl mb-1 text-slate-900 font-bold mt-12">🛏️ Kasur Saja</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">Tanpa perlengkapan (Bantal/Selimut)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.mattressOnly.map((p) => (
              <ProductCard key={p.id} product={{...p, category: 'mattress'}} onClick={() => openModal({...p, category: 'mattress'})} />
            ))}
          </div>

          <h2 className="text-2xl mb-1 text-slate-900 font-bold mt-12">✨ Aksesoris</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">Bantal, guling, sprei, dan perlengkapan tidur lainnya</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {products.accessories.map((p) => (
              <ProductCard key={p.id} product={{...p, category: 'accessory'}} onClick={() => openModal({...p, category: 'accessory'})} />
            ))}
          </div>

        </div>
      </section>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={closeModal} 
      />
    </main>
  );
}
