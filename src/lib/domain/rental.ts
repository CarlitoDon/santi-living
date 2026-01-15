import type { CartItem } from "@/types";

export interface RentalConfig {
  maxDuration: number;
  minDuration: number;
  maxQuantity: number;
  cutoffHour: number;
  volumeDiscounts: {
    minQty: number;
    maxQty: number;
    discount: number;
    label: string;
  }[];
}

export interface PriceResult {
  subtotal: number;
  total: number;
  discountAmount: number;
  volumeDiscountLabel: string;
  volumeDiscountPercent: number;
  mattressSubtotal: number;
  accessorySubtotal: number;
  mattressQty: number;
  nextTier?: {
    unitsNeeded: number;
    discountPercent: number;
  };
}

/**
 * Calculate rental price based on items and duration
 */
export function calculateRentalPrice(
  items: CartItem[],
  duration: number,
  config: RentalConfig
): PriceResult {
  // 1. Calculate quantities
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const mattressQty = items
    .filter((i) => i.category !== "accessory")
    .reduce((sum, i) => sum + i.quantity, 0);

  // 2. Calculate subtotals (base price without discount)
  const mattressSubtotal = items
    .filter((i) => i.category !== "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  const accessorySubtotal = items
    .filter((i) => i.category === "accessory")
    .reduce((sum, i) => sum + i.quantity * i.pricePerDay * duration, 0);

  const subtotal = mattressSubtotal + accessorySubtotal;

  // 3. Find applicable volume discount
  const volumeTier = config.volumeDiscounts.find(
    (t) => mattressQty >= t.minQty && mattressQty <= t.maxQty
  );
  const discountPercent = volumeTier?.discount || 0;
  const discountAmount = Math.round(mattressSubtotal * discountPercent);

  // 4. Calculate next tier upsell
  let nextTier;
  const currentTierIndex = config.volumeDiscounts.findIndex(
    (t) => mattressQty >= t.minQty && mattressQty <= t.maxQty
  );
  const nextTierConfig = config.volumeDiscounts[currentTierIndex + 1];

  if (nextTierConfig && mattressQty > 0) {
    nextTier = {
      unitsNeeded: nextTierConfig.minQty - mattressQty,
      discountPercent: Math.round(nextTierConfig.discount * 100),
    };
  }

  return {
    subtotal,
    total: subtotal - discountAmount,
    discountAmount,
    volumeDiscountLabel: volumeTier?.label || "",
    volumeDiscountPercent: discountPercent * 100,
    mattressSubtotal,
    accessorySubtotal,
    mattressQty,
    nextTier,
  };
}

/**
 * Calculate end date string (YYYY-MM-DD)
 */
export function calculateEndDate(startDate: string, duration: number): string {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + duration);
  return end.toISOString().split("T")[0];
}

/**
 * Calculate delivery estimate text
 */
export function calculateDeliveryEstimate(
  startDate: string | null,
  cutoffHour: number
): string {
  if (!startDate) {
    return "Pilih tanggal untuk estimasi pengantaran";
  }

  const now = new Date();
  const start = new Date(startDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday = start.getTime() === today.getTime();

  if (isToday) {
    const currentHour = now.getHours();
    if (currentHour < cutoffHour) {
      return "Bisa antar hari ini! 🚚";
    } else {
      return "Antar besok pagi";
    }
  } else {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
    const dateStr = start.toLocaleDateString("id-ID", options);
    return `Antar ${dateStr}`;
  }
}

/**
 * Validate rental duration
 */
export function validateDuration(
  duration: number,
  config: { minDuration: number; maxDuration: number }
): { isValid: boolean; message?: string; adjustedValue?: number } {
  if (isNaN(duration) || duration < config.minDuration) {
    return {
      isValid: false,
      message: `Minimal ${config.minDuration} hari`,
      adjustedValue: config.minDuration,
    };
  } else if (duration > config.maxDuration) {
    return {
      isValid: false,
      message: `Maksimal ${config.maxDuration} hari`,
      adjustedValue: config.maxDuration,
    };
  }
  return { isValid: true };
}
