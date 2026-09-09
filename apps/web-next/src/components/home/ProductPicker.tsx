'use client';

import Image from 'next/image';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { products } from '@/data/products';
import type { Product } from '@/components/calculator/types';
import { useState } from 'react';
import { ProductModal } from '@/components/produk/ProductCard';
import { CatalogItemCard } from '@/components/home/CatalogItemCard';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID').format(amount);

// Map catalog to Calculator Product type
const allCategories: { label: string; products: Product[] }[] = [
  {
    label: 'Paket Kasur (Kasur + Sprei + Bantal)',
    products: products.mattressPackages.map((p) => ({ ...p, category: 'package' as const })),
  },
  {
    label: 'Kasur Saja',
    products: products.mattressOnly.map((p) => ({ ...p, category: 'mattress' as const })),
  },
  {
    label: 'Ekstra Tambahan',
    products: products.accessories.map((p) => ({ ...p, category: 'accessory' as const })),
  },
];

export function ProductPicker() {
  const { actions } = useCalculatorContext();
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const handleAdd = (product: Product) => {
    actions.addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      pricePerDay: product.pricePerDay,
      includes: product.includes,
    });
  };

  return (
    <>
      <div className="product-picker">
        {allCategories.map((cat, categoryIndex) => (
          <section key={cat.label} className="product-picker-category" aria-labelledby={`product-category-${categoryIndex}`}>
            <h3 id={`product-category-${categoryIndex}`} className="product-picker-category-title">
              {cat.label}
              <span>{cat.products.length} pilihan</span>
            </h3>
            <div className="product-picker-grid">
              {cat.products.map((product) => (
                <div className="product-picker-card-wrap" key={product.id}>
                  <CatalogItemCard
                    productId={product.id}
                    title={product.shortName || product.name}
                    meta={product.dimensions}
                    price={<>Rp{formatCurrency(product.pricePerDay)}<span>/hari</span></>}
                    thumbnail={<Image src={product.image} alt={product.name} width={80} height={80} className="object-cover rounded-lg" />}
                    onDetail={() => setModalProduct(product)}
                    action={actions.getItemQuantity(product.id) > 0 ? (
                      <>
                        <button type="button" onClick={() => actions.removeItem(product.id)} className="stepper-btn" aria-label="Kurangi">−</button>
                        <span className="stepper-qty">{actions.getItemQuantity(product.id)}</span>
                        <button type="button" onClick={() => handleAdd(product)} className="stepper-btn stepper-btn-add" aria-label="Tambah">+</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => handleAdd(product)} className="stepper-btn-single" aria-label="Tambahkan">+ Tambah</button>
                    )}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ProductModal
        product={modalProduct}
        isOpen={!!modalProduct}
        onClose={() => setModalProduct(null)}
        quantity={modalProduct ? actions.getItemQuantity(modalProduct.id) : 0}
        onIncrement={() => {
          if (modalProduct) handleAdd(modalProduct);
        }}
        onDecrement={() => {
          if (modalProduct) actions.removeItem(modalProduct.id);
        }}
        onSewaClick={() => {
          if (modalProduct) {
            if (actions.getItemQuantity(modalProduct.id) === 0) {
              handleAdd(modalProduct);
            }
            setModalProduct(null);
          }
        }}
      />
    </>
  );
}
