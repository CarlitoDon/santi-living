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
 * Calculate cart totals
 */
export function calculateTotals(
  items: CartItem[],
  duration: number,
  deliveryFee: number,
  volumeDiscountRate: number,
) {
  // Calculate subtotals by category
  const mattressSubtotal = items
    .filter((i) => i.category !== "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  const accessorySubtotal = items
    .filter((i) => i.category === "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  // Calculate discount amount (only on mattresses)
  const discountAmount = Math.round(mattressSubtotal * volumeDiscountRate);

  const subtotal = mattressSubtotal + accessorySubtotal;
  const total = subtotal - discountAmount + deliveryFee;

  return {
    mattressSubtotal,
    accessorySubtotal,
    subtotal,
    discountAmount,
    total,
  };
}
