// ==========================================================================
// TypeScript Types - Santi Living
// ==========================================================================

/**
 * Mattress type available for rent
 */
export interface MattressType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  pricePerDay: number;
  packagePricePerDay: number;
  dimensions: string;
  capacity: string;
  image: string;
  includes: string[];
  packageIncludes: string[];
  available: boolean;
}

/**
 * Service area with districts
 */
export interface ServiceArea {
  id: string;
  name: string;
  districts: string[];
  deliveryNote?: string;
}

/**
 * Customer testimonial
 */
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
  verified: boolean;
}

/**
 * Business configuration
 */
export interface BusinessConfig {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  city: string;
  minDuration: number;
  maxDuration: number;
  minQuantity: number;
  maxQuantity: number;
  minBookingDays: number;
  operatingHours: string;
  cutoffHour: number;
}

/**
 * Cart item (mattress type with quantity)
 */
export interface CartItem {
  type: string;
  name: string;
  quantity: number;
  pricePerDay: number;
  packagePricePerDay: number;
}

/**
 * Calculator state
 */
export interface CalculatorState {
  // Input
  items: CartItem[];
  startDate: string | null;
  duration: number;
  isPackage: boolean;

  // Calculated
  endDate: string | null;
  totalQuantity: number;
  subtotal: number;
  total: number;
  deliveryEstimate: string;

  // Validation
  isValid: boolean;
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
