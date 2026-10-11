/**
 * Checkout Session Manager
 * Manages order data in sessionStorage during checkout flow
 */

import type { OrderData, OrderPayload } from "@/types/order";
export type { OrderData, OrderPayload };

const STORAGE_KEY = "santi-living-checkout";

export interface CheckoutSession {
  order: OrderData | OrderPayload;
  selectedPaymentMethod?: "bca" | "gopay" | "qris";
  createdAt: string;
}

/**
 * Save order data to sessionStorage
 */
export function saveOrder(order: OrderData | OrderPayload): void {
  if (typeof window === 'undefined') return;
  const session: CheckoutSession = {
    order,
    createdAt: new Date().toISOString(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/**
 * Get order data from sessionStorage
 */
export function getOrder(): CheckoutSession | null {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as CheckoutSession;
  } catch {
    return null;
  }
}

/**
 * Update selected payment method
 */
export function setPaymentMethod(method: "bca" | "gopay" | "qris"): void {
  if (typeof window === 'undefined') return;
  const session = getOrder();
  if (session) {
    session.selectedPaymentMethod = method;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}
