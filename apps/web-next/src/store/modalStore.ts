'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ProductItem } from '@/types';

interface ModalState {
  isOpen: boolean;
  product: ProductItem | null;
  open: (product: ProductItem) => void;
  close: () => void;
}

// Simple module-level state for cross-component communication
let _listeners: Array<() => void> = [];
let _isOpen = false;
let _product: ProductItem | null = null;

function emitChange() {
  for (const listener of _listeners) {
    listener();
  }
}

export function openModal(product: ProductItem) {
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
