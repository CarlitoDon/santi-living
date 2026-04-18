'use client';

import { useState, useCallback } from 'react';
import type { Product } from '@/types/product';

interface ModalState {
  isOpen: boolean;
  product: Product | null;
  open: (product: Product) => void;
  close: () => void;
}

// Simple module-level state for cross-component communication
const _listeners: Array<() => void> = [];
let _isOpen = false;
let _product: Product | null = null;

function emitChange() {
  for (const listener of _listeners) {
    listener();
  }
}

export function openModal(product: Product) {
  _isOpen = true;
  _product = product;
  emitChange();
}

export function closeModal() {
  _isOpen = false;
  _product = null;
  emitChange();
}

export function useModalStore(): ModalState {
  const [, setTick] = useState(0);

  // Subscribe to changes
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  // Register listener on mount (caller should wrap in useEffect if needed)
  if (typeof window !== 'undefined' && !_listeners.includes(forceUpdate)) {
    _listeners.push(forceUpdate);
  }

  return {
    isOpen: _isOpen,
    product: _product,
    open: openModal,
    close: closeModal,
  };
}
