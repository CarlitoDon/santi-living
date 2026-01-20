// ==========================================================================
// TypeScript Types - Santi Living
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
  includes?: string[]; // Bundle components: ["kasur busa", "sprei", "bantal", "selimut"]
}

/**
 * Calculator state
 */
export interface CalculatorState {
  // Input
  items: CartItem[];
  startDate: string | null;
  duration: number;
  paymentMethod: "qris" | "transfer";

  // Calculated
  endDate: string | null;
  totalQuantity: number;
  subtotal: number;
  total: number;
  deliveryEstimate: string;

  // Discounts
  volumeDiscountAmount: number;
  volumeDiscountLabel: string;
  volumeDiscountPercent: number;
  nextTierUnitsNeeded: number;
  nextTierDiscountPercent: number;

  // Validation
  isValid: boolean;
  deliveryFee: number;
  distance: number;
  errors: Record<string, string>;
}

/**
 * Booking form data
 */
export interface BookingFormData {
  name: string;
  whatsapp: string;
  address: string;
  notes: string;
}

/**
 * Complete booking request (calculator + form)
 */
export interface BookingRequest {
  timestamp: string;

  // Customer Info
  name: string;
  whatsapp: string;
  address: string;
  notes?: string;

  // Booking Details
  mattressType: string;
  quantity: number;
  startDate: string;
  duration: number;
  endDate: string;

  // Pricing
  pricePerDay: number;
  subtotal: number;
  total: number;

  // Tracking
  source: string;
  status: "new" | "contacted" | "confirmed" | "completed";
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
