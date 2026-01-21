// ==========================================================================
// Shared Types - Santi Living
// ==========================================================================

/**
 * Product Item (from JSON)
 */
export interface ProductItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  pricePerDay: number;
  dimensions?: string;
  capacity?: string;
  image: string;
  includes?: string[];
}

/**
 * Cart item
 */
export interface CartItem {
  id: string;
  name: string;
  category: "package" | "mattress" | "accessory";
  quantity: number;
  pricePerDay: number;
  includes?: string[]; // Bundle components
}

/**
 * Order Item (for API)
 */
export interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pricePerDay: number;
  unitPrice?: number;
  subtotal?: number;
  includes?: string[];
}

/**
 * Address Fields
 */
export interface AddressFields {
  street?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  zip?: string;
  lat?: string;
  lng?: string;
}

/**
 * Order Data (checkout flow)
 */
export interface OrderData {
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  addressFields?: AddressFields;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  endDate?: string;
  duration: number;
  deliveryFee: number;
  paymentMethod?: "qris" | "transfer";
  notes?: string;
  volumeDiscountAmount?: number;
  volumeDiscountLabel?: string;
}

/**
 * Calculator state
 */
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
  volumeDiscountAmount: number;
  volumeDiscountLabel: string;
  volumeDiscountPercent: number;
  nextTierUnitsNeeded: number;
  nextTierDiscountPercent: number;
  isValid: boolean;
  deliveryFee: number;
  distance: number;
  errors: Record<string, string>;
}

/**
 * Service Area (from JSON)
 */
export interface ServiceArea {
  id: string;
  name: string;
  districts: string[];
  deliveryNote?: string;
}

/**
 * Testimonial (from JSON)
 */
export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  verified?: boolean;
}

/**
 * Coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Formatted Address
 */
export interface FormattedAddress {
  street: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  postcode: string;
  fullAddress: string;
}
