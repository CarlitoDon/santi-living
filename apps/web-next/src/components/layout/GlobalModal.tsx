'use client';

import { useModalStore } from '@/store/modalStore';
import { ProductModal } from '@/components/produk/ProductCard';
import type { Product } from '@/types/product';

export function GlobalModal() {
  const { isOpen, product, close } = useModalStore();

  const productData: Product | null = product ? {
    id: product.id,
    name: product.name,
    shortName: product.shortName || product.name,
    description: product.description || '',
    pricePerDay: product.pricePerDay,
    costPrice: 0, // Fallback since ProductItem doesn't track wholesale pricing
    category: 'package', // Default fallback for modal store interface
    dimensions: product.dimensions,
    capacity: product.capacity,
    image: product.image,
    includes: product.includes || [],
  } : null;

  return (
    <ProductModal
      product={productData}
      isOpen={isOpen}
      onClose={close}
    />
  );
}
