'use client';

import { useModalStore } from '@/store/modalStore';
import { ProductModal } from '@/components/produk/ProductCard';

export function GlobalModal() {
  const { isOpen, product, close } = useModalStore();

  return (
    <ProductModal
      product={product}
      isOpen={isOpen}
      onClose={close}
    />
  );
}
