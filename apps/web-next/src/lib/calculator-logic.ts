/**
 * Calculator Business Logic
 */

import type { CartItem } from "@/types";

export interface VolumeDiscountTier {
  minQty: number;
  maxQty: number;
  discount: number;
  label: string;
}

export interface VolumeDiscountConfig {
  volumeDiscounts?: VolumeDiscountTier[];
}

/**
 * Calculate delivery fee based on fuel cost.
 * Formula: distance × 4 (antar PP + ambil PP) ÷ 10 (km/liter) × 6800 (harga solar/liter)
 * Rounded up to nearest Rp1.000
 */
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 0) return 0;

  const ROUND_TRIPS = 4; // antar berangkat + pulang, ambil berangkat + pulang
  const KM_PER_LITER = 10;
  const FUEL_PRICE = 6800; // harga solar per liter
  const rawFee = ((distanceKm * ROUND_TRIPS) / KM_PER_LITER) * FUEL_PRICE;
  return Math.ceil(rawFee / 1000) * 1000; // round up to nearest Rp1.000
}

/**
 * Calculate distance between two coordinates in km using Haversine formula
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate volume discount based on mattress quantity
 */
export function calculateVolumeDiscount(
  mattressQty: number,
  config: VolumeDiscountConfig,
) {
  const volumeDiscounts = config.volumeDiscounts || [];
  const volumeTier = volumeDiscounts.find(
    (t) => mattressQty >= t.minQty && mattressQty <= t.maxQty,
  );

  const discount = volumeTier?.discount || 0;
  const label = volumeTier?.label || "";

  // Calculate next tier info
  const currentTierIndex = volumeDiscounts.findIndex(
    (t) => mattressQty >= t.minQty && mattressQty <= t.maxQty,
  );
  const nextTier = volumeDiscounts[currentTierIndex + 1];

  let nextTierUnitsNeeded = 0;
  let nextTierDiscountPercent = 0;

  if (nextTier && mattressQty > 0) {
    nextTierUnitsNeeded = nextTier.minQty - mattressQty;
    nextTierDiscountPercent = Math.round(nextTier.discount * 100);
  }

  return {
    discount, // e.g. 0.05
    label,
    percent: discount * 100,
    nextTierUnitsNeeded,
    nextTierDiscountPercent,
  };
}

/**
 * Duration discount tiers
 * 3+ days = 5% extra discount on mattress subtotal
 */
const DURATION_DISCOUNT_TIERS = [
  { minDays: 3, discount: 0.05, label: "3+ hari" },
];

/**
 * Calculate duration-based discount
 */
export function calculateDurationDiscount(duration: number) {
  // Find the highest matching tier (sorted desc to support future tiers)
  const tier = [...DURATION_DISCOUNT_TIERS]
    .sort((a, b) => b.minDays - a.minDays)
    .find((t) => duration >= t.minDays);

  return {
    discount: tier?.discount || 0,
    percent: (tier?.discount || 0) * 100,
    label: tier?.label || "",
  };
}

/**
 * Calculate cart totals
 */
export function calculateTotals(
  items: CartItem[],
  duration: number,
  deliveryFee: number,
  volumeDiscountRate: number,
  durationDiscountRate: number = 0,
) {
  // Calculate subtotals by category
  const mattressSubtotal = items
    .filter((i) => i.category !== "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  const accessorySubtotal = items
    .filter((i) => i.category === "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  // Volume discount (only on mattresses)
  const volumeDiscountAmount = Math.round(
    mattressSubtotal * volumeDiscountRate,
  );

  // Duration discount (on mattress subtotal AFTER volume discount)
  const afterVolumeDiscount = mattressSubtotal - volumeDiscountAmount;
  const durationDiscountAmount = Math.round(
    afterVolumeDiscount * durationDiscountRate,
  );

  const subtotal = mattressSubtotal + accessorySubtotal;
  const total =
    subtotal - volumeDiscountAmount - durationDiscountAmount + deliveryFee;

  return {
    mattressSubtotal,
    accessorySubtotal,
    subtotal,
    discountAmount: volumeDiscountAmount,
    durationDiscountAmount,
    total,
  };
}
