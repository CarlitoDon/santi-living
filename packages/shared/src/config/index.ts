// ==========================================================================
// Shared Configuration - Santi Living
// ==========================================================================

/**
 * Business configuration constants
 */
export const BUSINESS_CONFIG = {
  businessName: "Sewa Kasur Jogja by Santi Mebel",
  city: "Yogyakarta",
  minDuration: 1,
  maxDuration: 30,
  minQuantity: 1,
  maxQuantity: 50,
  minBookingDays: 0,
  operatingHours: "08:00 - 21:00",
  cutoffHour: 15,
  priceRange: "Rp 25.000 - Rp 50.000",
} as const;

/**
 * Volume discount tiers
 */
export const VOLUME_DISCOUNTS = [
  { minQty: 1, maxQty: 2, discount: 0, label: "" },
  { minQty: 3, maxQty: 5, discount: 0.1, label: "Hemat 10%" },
  { minQty: 6, maxQty: 999, discount: 0.15, label: "Hemat 15%" },
] as const;

/**
 * Delivery zones and pricing
 */
export const DELIVERY_ZONES = [
  { maxDistance: 3, price: 0 },
  { maxDistance: 8, price: 15000 },
  { maxDistance: 15, price: 25000 },
] as const;

export const DELIVERY_PRICE_PER_KM = 1500;
export const MIN_DELIVERY_PRICE = 30000;

/**
 * Store location (Godean)
 */
export const STORE_LOCATION = {
  lat: -7.76777,
  lng: 110.293886,
  name: "Santi Mebel Godean",
} as const;
