'use client';

import Image from 'next/image';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { products } from '@/data/products';
import type { Product } from '@/components/calculator/types';
import { useState } from 'react';
import { ProductModal } from '@/components/produk/ProductCard';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID').format(amount);

// Map catalog to Calculator Product type
const allCategories: { label: string; products: Product[] }[] = [
  {
    label: 'Paket Kasur (Kasur + Bantal + Selimut)',
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

function ProductCard({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onDetail,
}: {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDetail: () => void;
}) {
  return (
    <div
      className="product-picker-card"
      data-product-id={product.id}
    >
      <button
        type="button"
        onClick={onDetail}
        className="product-picker-thumb"
        aria-label={`Detail ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      </button>

      <div className="product-picker-info" onClick={onDetail} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onDetail()}>
        <p className="product-picker-name">{product.shortName || product.name}</p>
        {product.dimensions && (
          <p className="product-picker-dim">{product.dimensions}</p>
        )}
        <p className="product-picker-price">
          Rp{formatCurrency(product.pricePerDay)}<span>/hari</span>
        </p>
      </div>

      <div className="product-picker-stepper">
        {quantity > 0 ? (
          <>
            <button type="button" onClick={onDecrement} className="stepper-btn" aria-label="Kurangi">−</button>
            <span className="stepper-qty">{quantity}</span>
            <button type="button" onClick={onIncrement} className="stepper-btn stepper-btn-add" aria-label="Tambah">+</button>
          </>
        ) : (
          <button type="button" onClick={onIncrement} className="stepper-btn-single" aria-label="Tambahkan">
            + Tambah
          </button>
        )}
      </div>
    </div>
  );
}

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
        {allCategories.map((cat) => (
          <div key={cat.label} className="product-picker-category">
            <h3 className="product-picker-category-title">{cat.label}</h3>
            <div className="product-picker-grid">
              {cat.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={actions.getItemQuantity(product.id)}
                  onIncrement={() => handleAdd(product)}
                  onDecrement={() => actions.removeItem(product.id)}
                  onDetail={() => setModalProduct(product)}
                />
              ))}
            </div>
          </div>
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
