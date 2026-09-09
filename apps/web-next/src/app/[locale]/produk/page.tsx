'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import { ProductModal } from '@/components/produk/ProductCard';
import { ProductCategorySection } from '@/components/produk/ProductCategorySection';
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
    <main className="site-main-offset">
      <JsonLd data={productSchema} />
      <PageHero 
        title={t('produk.title')} 
        subtitle={t('produk.subtitle')} 
      />

      <section className="py-8 pb-12">
        <div className="container">
          <ProductCategorySection
            title={t('produk.paket_lengkap_title')}
            description={t('produk.paket_lengkap_desc')}
            items={products.mattressPackages}
            category="package"
            onSelect={openModal}
          />
          <ProductCategorySection
            className="mt-12"
            title={t('produk.kasur_only_title')}
            description={t('produk.kasur_only_desc')}
            items={products.mattressOnly}
            category="mattress"
            onSelect={openModal}
          />
          <ProductCategorySection
            className="mt-12"
            title={t('produk.aksesoris_title')}
            description={t('produk.aksesoris_desc')}
            items={products.accessories}
            category="accessory"
            onSelect={openModal}
          />

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
