/**
 * ERP API Service
 *
 * Client for proxy to create orders in sync-erp.
 * This runs in parallel with bot-service - if ERP fails, customer flow continues.
 */

import type { OrderPayload, ErpOrderResponse } from "@/types/order";
import { getProxyBaseUrl } from "@/lib/proxy-config";
import {
  buildAttributionHeaders,
  captureAttributionOnPageLoad,
} from "@/lib/attribution";

export type { OrderPayload, ErpOrderResponse };

const getErpApiUrl = () => {
  return getProxyBaseUrl();
};

const readApiErrorMessage = (errorBody: unknown, fallback: string) => {
  if (!errorBody || typeof errorBody !== "object") {
    return fallback;
  }

  const payload = errorBody as {
    message?: string;
    details?: string;
    error?: {
      message?: string;
    };
  };

  return (
    payload.error?.message ||
    payload.message ||
    payload.details ||
    fallback
  );
};

/**
 * Send order to ERP sync service
 * This creates the order in sync-erp database
 *
 * @returns Order response with publicToken for tracking page
 * @throws Error if API call fails
 */
export async function createOrderInERP(
  payload: OrderPayload,
): Promise<ErpOrderResponse> {
  captureAttributionOnPageLoad();
  const attributionHeaders = buildAttributionHeaders();

  // Use internal proxy to handle TRPC conversion (avoids CORS)
  const response = await fetch("/api/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...attributionHeaders,
    },
    body: JSON.stringify({
      customerName: payload.customerName,
      customerWhatsapp: payload.customerWhatsapp,
      deliveryAddress: payload.deliveryAddress,
      addressFields: payload.addressFields,
      items: payload.items,
      totalPrice: payload.totalPrice,
      orderDate: new Date(payload.orderDate).toISOString(),
      endDate: payload.endDate
        ? new Date(payload.endDate).toISOString()
        : undefined,
      duration: payload.duration,
      deliveryFee: payload.deliveryFee,
      paymentMethod: payload.paymentMethod,
      notes: payload.notes,
      volumeDiscountAmount: payload.volumeDiscountAmount,
      volumeDiscountLabel: payload.volumeDiscountLabel,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(readApiErrorMessage(error, "Failed to create order in ERP"));
  }

  return response.json();
}

/**
 * Update existing order in ERP
 * Used when customer edits order via "Edit Pesanan" flow
 *
 * @returns Updated order response
 * @throws Error if API call fails (e.g., order not DRAFT)
 */
export async function updateOrderInERP(
  token: string,
  payload: OrderPayload,
): Promise<ErpOrderResponse> {
  captureAttributionOnPageLoad();
  const attributionHeaders = buildAttributionHeaders();

  const response = await fetch("/api/update-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...attributionHeaders,
    },
    body: JSON.stringify({
      token,
      customerName: payload.customerName,
      customerWhatsapp: payload.customerWhatsapp,
      deliveryAddress: payload.deliveryAddress,
      addressFields: payload.addressFields,
      items: payload.items,
      totalPrice: payload.totalPrice,
      orderDate: new Date(payload.orderDate).toISOString(),
      endDate: payload.endDate
        ? new Date(payload.endDate).toISOString()
        : undefined,
      duration: payload.duration,
      deliveryFee: payload.deliveryFee,
      paymentMethod: payload.paymentMethod,
      notes: payload.notes,
      volumeDiscountAmount: payload.volumeDiscountAmount,
      volumeDiscountLabel: payload.volumeDiscountLabel,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(readApiErrorMessage(error, "Failed to update order in ERP"));
  }

  return response.json();
}

/**
 * Get order status by token
 * Used by order tracking page
 */
export async function getOrderStatus(token: string) {
  const baseUrl = getErpApiUrl();

  const response = await fetch(`${baseUrl}/api/orders/${token}`);

  if (!response.ok) {
    throw new Error("Order not found");
  }

  return response.json();
}

/**
 * Confirm payment
 * Called by checkout page when customer clicks "Saya Sudah Bayar"
 */
export async function confirmPayment(
  token: string,
  paymentMethod: "qris" | "transfer",
  reference?: string,
) {
  // Use local internal proxy
  const response = await fetch("/api/confirm-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      paymentMethod,
      reference,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(readApiErrorMessage(error, "Gagal konfirmasi pembayaran"));
  }

  return response.json();
}

/**
 * Create Payment Token (Midtrans)
 */
export async function createPaymentToken(token: string) {
  const response = await fetch("/api/create-payment-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(readApiErrorMessage(error, "Gagal membuat token pembayaran"));
  }

  return response.json();
}
