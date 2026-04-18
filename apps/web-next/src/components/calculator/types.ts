/**
 * Calculator Types
 * Shared types for the Calculator React components
 */

export interface CartItem {
  id: string;
  name: string;
  category: "package" | "mattress" | "accessory";
  quantity: number;
  pricePerDay: number;
  includes?: string[];
}

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

export interface Product {
  id: string;
  name: string;
  shortName: string;
  description: string;
  dimensions?: string;
  capacity?: string;
  pricePerDay: number;
  costPrice: number;
  category: "package" | "mattress" | "accessory";
  image: string;
  includes: string[];
}
