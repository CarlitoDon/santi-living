import { atom } from "nanostores";
import type { ProductItem } from "@/types";

interface ModalState {
  isOpen: boolean;
  product: ProductItem | null;
}

export const isModalOpen = atom(false);
export const modalProduct = atom<ProductItem | null>(null);

export function openModal(product: ProductItem) {
  modalProduct.set(product);
  isModalOpen.set(true);
}

export function closeModal() {
  isModalOpen.set(false);
  // Optional: clear product after delay to allow animation
  setTimeout(() => {
    modalProduct.set(null);
  }, 300);
}
