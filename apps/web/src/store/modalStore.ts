import { atom } from "nanostores";
import type { ProductItem } from "@/types";

export const isModalOpen = atom(false);
export const modalProduct = atom<ProductItem | null>(null);
export const modalQuantityGetter = atom<(() => number) | null>(null);

export function openModal(product: ProductItem, getQuantity?: () => number) {
  modalProduct.set(product);
  modalQuantityGetter.set(getQuantity || null);
  isModalOpen.set(true);
}

export function closeModal() {
  isModalOpen.set(false);
  // Optional: clear product after delay to allow animation
  setTimeout(() => {
    modalProduct.set(null);
    modalQuantityGetter.set(null);
  }, 300);
}

// Dispatch increment/decrement events for Calculator to handle
export function dispatchModalIncrement(productId: string) {
  window.dispatchEvent(
    new CustomEvent("modal-product-increment", { detail: { productId } }),
  );
}

export function dispatchModalDecrement(productId: string) {
  window.dispatchEvent(
    new CustomEvent("modal-product-decrement", { detail: { productId } }),
  );
}
