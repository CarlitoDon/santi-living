/**
 * ERP API Service
 *
 * Client for proxy to create orders in sync-erp.
 * This runs in parallel with bot-service - if ERP fails, customer flow continues.
 */

const getErpApiUrl = () => {
  // In development use localhost, in production use env var
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    return "http://localhost:3002"; // proxy service port
  }
  const PROXY_URL =
    (import.meta as unknown as { env: { PUBLIC_PROXY_URL?: string } }).env
      ?.PUBLIC_PROXY_URL || "http://localhost:3002";
  return PROXY_URL;
};

export interface OrderPayload {
  orderId: string;
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  addressFields?: {
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    zip?: string;
    lat?: string;
    lng?: string;
  };
  items: Array<{
    id: string; // Product ID for bundle lookup (e.g., "package-single-standard")
    name: string;
    category: string;
    quantity: number;
    pricePerDay: number;
    includes?: string[]; // Bundle components: ["kasur busa", "sprei", "bantal", "selimut"]
  }>;
  totalPrice: number;
  orderDate: string;
  endDate: string;
  duration: number;
  deliveryFee: number;
  paymentMethod: string;
  notes?: string;
  volumeDiscountAmount?: number;
  volumeDiscountLabel?: string;
}

export interface ErpOrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
  orderUrl: string;
}

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
  // Use internal proxy to handle TRPC conversion (avoids CORS)
  const response = await fetch("/api/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: payload.customerName,
      customerWhatsapp: payload.customerWhatsapp,
      deliveryAddress: payload.deliveryAddress,
      addressFields: payload.addressFields,
      items: payload.items,
      totalPrice: payload.totalPrice,
      orderDate: new Date(payload.orderDate).toISOString(),
      endDate: new Date(payload.endDate).toISOString(),
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
    throw new Error(
      error.message || error.details || "Failed to create order in ERP",
    );
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
    throw new Error(
      error.message || error.details || "Gagal konfirmasi pembayaran",
    );
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
    throw new Error(
      error.message || error.details || "Gagal membuat token pembayaran",
    );
  }

  return response.json();
}
