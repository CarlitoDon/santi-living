/**
 * Calculator Types
 * Shared types for the Calculator React components
 */

import type { CartItem } from '@/types';
import type { Product } from '@/types/product';

export type { CartItem, Product };

export interface AddressFields {
  street: string;
  kelurahan: string;
  kelurahanKode: string;
  kecamatan: string;
  kecamatanKode: string;
  kota: string;
  kotaKode: string;
  provinsi: string;
  provinsiKode: string;
  zip: string;
  lat: string;
  lng: string;
}

export interface CalculatorState {
  items: CartItem[];
  startDate: string | null;
  duration: number;
  paymentMethod: "qris" | "transfer";
  endDate: string | null;
  totalQuantity: number;
  subtotal: number;
  total: number;
  deliveryEstimate: string;
  deliveryFee: number;
  distance: number;
  volumeDiscountAmount: number;
  volumeDiscountLabel: string;
  volumeDiscountPercent: number;
  durationDiscountAmount: number;
  durationDiscountPercent: number;
  nextTierUnitsNeeded: number;
  nextTierDiscountPercent: number;
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CustomerData {
  name: string;
  whatsapp: string;
  address: AddressFields;
  notes: string;
}

