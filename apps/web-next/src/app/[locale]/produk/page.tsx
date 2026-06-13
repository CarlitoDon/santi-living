'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import { ProductCard, ProductModal } from '@/components/produk/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { generateProductSchemaList } from '@/utils/seo';
import type { Product } from '@/types/product';
import { useT } from '@/contexts/locale';

export default function ProdukPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const t = useT();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('produk.title'),
    "description": t('produk.subtitle'),
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
        title={t('produk.title')} 
        subtitle={t('produk.subtitle')} 
      />

      <section className="py-8 pb-12">
        <div className="container">
          <h2 className="text-2xl mb-1 text-slate-900 font-bold">{t('produk.paket_lengkap_title')}</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">{t('produk.paket_lengkap_desc')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.mattressPackages.map((p) => (
              <ProductCard key={p.id} product={{...p, category: 'package'}} onClick={() => openModal({...p, category: 'package'})} />
            ))}
          </div>

          <h2 className="text-2xl mb-1 text-slate-900 font-bold mt-12">{t('produk.kasur_only_title')}</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">{t('produk.kasur_only_desc')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.mattressOnly.map((p) => (
              <ProductCard key={p.id} product={{...p, category: 'mattress'}} onClick={() => openModal({...p, category: 'mattress'})} />
            ))}
          </div>

          <h2 className="text-2xl mb-1 text-slate-900 font-bold mt-12">{t('produk.aksesoris_title')}</h2>
          <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200">{t('produk.aksesoris_desc')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
