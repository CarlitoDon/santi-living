// Full order payload for detailed WA message (uses bot-service formatter)
export interface OrderNotifyPayload {
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
    name: string;
    category: "package" | "mattress" | "accessory";
    quantity: number;
    pricePerDay: number;
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
  orderUrl?: string;
}

// Simple payload for admin-triggered notifications
interface SimpleNotifyPayload {
  customerWhatsapp: string;
  orderNumber: string;
  orderUrl: string;
  customerName: string;
}

const getBotServiceUrl = () => {
  return process.env.BOT_SERVICE_URL || "http://localhost:3000";
};

const getBotApiKey = () => {
  return process.env.BOT_SERVICE_API_KEY || "";
};

/**
 * Send full order confirmation via bot-service /send-order
 * Uses the detailed template with all order info
 */
export async function sendOrderConfirmation(payload: OrderNotifyPayload) {
  const baseUrl = getBotServiceUrl();
  const apiKey = getBotApiKey();

  // Use /send-order endpoint which has the full detailed template
  const response = await fetch(`${baseUrl}/send-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to send WA notification");
  }

  return response.json();
}

/**
 * Send order link notification (for admin-triggered re-sends)
 * Uses simple template with just the link
 */
export async function sendOrderLinkToCustomer(payload: SimpleNotifyPayload) {
  const baseUrl = getBotServiceUrl();
  const apiKey = getBotApiKey();

  const message = `Halo Kak *${payload.customerName}*! 👋

Ini link untuk melihat status pesanan Kakak:
${payload.orderUrl}

Nomor Pesanan: *${payload.orderNumber}*

Kakak bisa akses halaman ini kapan saja untuk melihat status pengiriman dan pembayaran.

Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*! 🙏`;

  const response = await fetch(`${baseUrl}/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      phone: payload.customerWhatsapp,
      message,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to send WA notification");
  }

  return response.json();
}
