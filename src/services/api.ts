import config from "@/data/config.json";

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
    id: string; // Product ID (e.g., "package-single-standard")
    name: string;
    category: "package" | "mattress" | "accessory";
    quantity: number;
    pricePerDay: number;
    includes?: string[]; // Bundle components: ["kasur busa", "sprei", "bantal", "selimut"]
  }>;
  totalPrice: number;
  orderDate: string;
  endDate: string;
  duration: number;
  deliveryFee: number;
  paymentMethod: "qris" | "transfer";
  notes?: string;
  volumeDiscountAmount?: number;
  volumeDiscountLabel?: string;
  orderUrl?: string; // Link to order tracking page
}

export async function sendOrderToBot(payload: OrderPayload) {
  // Direct to ERP Sync Service (bypassing Bot Service for orders)
  const baseUrl =
    import.meta.env.PUBLIC_ERP_SYNC_URL || "http://localhost:3002";
  const apiKey = import.meta.env.PUBLIC_BOT_API_KEY || config.botApi.apiKey;

  const response = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || errorData.error || "Gagal mengirim pesanan"
    );
  }

  return await response.json();
}

export async function getBotStatus() {
  const baseUrl = import.meta.env.PUBLIC_BOT_API_URL || config.botApi.baseUrl;
  const response = await fetch(`${baseUrl}/status`);
  if (!response.ok) throw new Error("Gagal mengambil status bot");
  return await response.json();
}
