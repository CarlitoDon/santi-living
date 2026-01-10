import config from "@/data/config.json";

export interface OrderPayload {
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
    name: string;
    category: "package" | "mattress" | "accessory";
    quantity: number;
    pricePerDay: number;
  }>;
  totalPrice: number;
  orderDate: string;
  duration: number;
  deliveryFee: number;
  paymentMethod: "qris" | "transfer";
  notes?: string;
}

export async function sendOrderToBot(payload: OrderPayload) {
  const baseUrl = import.meta.env.PUBLIC_BOT_API_URL || config.botApi.baseUrl;
  const apiKey = import.meta.env.PUBLIC_BOT_API_KEY || config.botApi.apiKey;

  const response = await fetch(`${baseUrl}/send-order`, {
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
