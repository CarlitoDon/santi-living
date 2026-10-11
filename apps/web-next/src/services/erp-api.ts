/**
 * ERP API Service
 *
 * Client for proxy to create orders in sync-erp.
 * This runs in parallel with bot-service - if ERP fails, customer flow continues.
 */

import type { OrderPayload, ErpOrderResponse } from "@/types/order";
import {
  buildAttributionHeaders,
  captureAttributionOnPageLoad,
} from "@/lib/attribution";

export type { OrderPayload, ErpOrderResponse };


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

  const rawMessage = payload.error?.message ||
    payload.message ||
    payload.details ||
    fallback;

  const lowerMsg = rawMessage.toLowerCase();
  
  // Sanitize internal backend/system errors to prevent exposing system details
  if (
    lowerMsg.includes("bot ") || 
    lowerMsg.includes("scan qr") || 
    lowerMsg.includes("dashboard admin") ||
    lowerMsg.includes("internal server") ||
    lowerMsg.includes("timeout") ||
    lowerMsg.includes("network") ||
    lowerMsg.includes("prisma")
  ) {
    return "Sistem kami sedang mengalami gangguan sementara. Silakan hubungi admin via WhatsApp untuk melakukan pemesanan.";
  }

  return rawMessage;
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

