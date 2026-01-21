/**
 * Calculator Business Logic
 */

import type { CartItem } from "@/types";

interface DeliveryZone {
  maxDistance: number;
  price: number;
}

export interface VolumeDiscountTier {
  minQty: number;
  maxQty: number;
  discount: number;
  label: string;
}

export interface VolumeDiscountConfig {
  volumeDiscounts?: VolumeDiscountTier[];
}

interface DeliveryConfig {
  storeLocation?: { lat: number; lng: number };
  deliveryZones?: DeliveryZone[];
  deliveryPricePerKm?: number;
  minDeliveryPrice?: number;
}

/**
 * Calculate delivery fee based on distance and configuration
 */
export function calculateDeliveryFee(
  distance: number,
  config: DeliveryConfig,
): number {
  if (distance <= 0) return 0;

  const zones = config.deliveryZones || [];

  // Find matching zone
  const zone = zones.find((z) => distance <= z.maxDistance);

  if (zone) {
    return zone.price;
  }

  // Exceeds max zone - calculate per km
  if (zones.length === 0) return 0; // Fallback if no zones defined

  const lastZone = zones[zones.length - 1];
  const extraDist = distance - lastZone.maxDistance;
  const baseFee = lastZone.price;
  const extraFee = Math.ceil(extraDist) * (config.deliveryPricePerKm || 0);
  let fee = baseFee + extraFee;

  // Ensure minimum price if set
  if (config.minDeliveryPrice && fee < config.minDeliveryPrice) {
    fee = config.minDeliveryPrice;
  }

  // Round to nearest 1000
  return Math.ceil(fee / 1000) * 1000;
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
