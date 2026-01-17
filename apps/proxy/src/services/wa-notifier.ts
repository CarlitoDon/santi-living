// Full order payload for detailed WA message (uses bot-service formatter)
import { botClient } from "./bot-client";

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
    id: string; // Required by bot schema
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
  paymentMethod?: "qris" | "transfer";
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

/**
 * Retry helper with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param baseDelay - Base delay in ms (default: 1000)
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If error is related to invalid number (400 Bad Request), do not retry
      if (
        lastError.message.includes("Nomor WhatsApp") ||
        lastError.message.includes("Invalid") ||
        lastError.message.includes("400")
      ) {
        console.warn(
          `[WA Notify] Aborting retry for invalid number: ${lastError.message}`
        );
        throw lastError;
      }

      console.warn(
        `[WA Notify] Attempt ${attempt}/${maxRetries} failed: ${lastError.message}`
      );

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`[WA Notify] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Send full order confirmation via bot-service /send-order
 * Uses the detailed template with all order info
 * Includes retry logic with exponential backoff
 */
export async function sendOrderConfirmation(payload: OrderNotifyPayload) {
  return withRetry(async () => {
    return await botClient.bot.sendOrder.mutate(payload);
  });
}

/**
 * Send order link notification (for admin-triggered re-sends)
 * Uses simple template with just the link
 */
export async function sendOrderLinkToCustomer(payload: SimpleNotifyPayload) {
  const message = `Halo Kak *${payload.customerName}*! 👋

Ini link untuk melihat status pesanan Kakak:
${payload.orderUrl}

Nomor Pesanan: *${payload.orderNumber}*

Kakak bisa akses halaman ini kapan saja untuk melihat status pengiriman dan pembayaran.

Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*! 🙏`;

  return sendMessageWithRetry(payload.customerWhatsapp, message);
}

/**
 * Internal helper to send message with retry
 */
async function sendMessageWithRetry(phone: string, message: string) {
  return withRetry(async () => {
    return await botClient.bot.sendMessage.mutate({ phone, message });
  });
}

/**
 * Notify customer that their payment has been confirmed
 */
export async function notifyPaymentConfirmed(payload: {
  customerWhatsapp: string;
  customerName: string;
  orderNumber: string;
  orderUrl: string;
  paymentReference?: string;
}) {
  const message = `Halo Kak *${payload.customerName}*! 🎉

Pembayaran untuk pesanan *${payload.orderNumber}* telah *DIKONFIRMASI*.${
    payload.paymentReference ? `\nReferensi: ${payload.paymentReference}` : ""
  }

✅ Pesanan Kakak sudah dikonfirmasi dan akan segera kami proses.

Kakak bisa cek status pesanan di:
${payload.orderUrl}

Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*! 🙏`;

  return sendMessageWithRetry(payload.customerWhatsapp, message);
}

/**
 * Notify customer that their payment was rejected
 */
export async function notifyPaymentRejected(payload: {
  customerWhatsapp: string;
  customerName: string;
  orderNumber: string;
  orderUrl: string;
  failReason?: string;
}) {
  const message = `Halo Kak *${payload.customerName}*,

Mohon maaf, pembayaran untuk pesanan *${
    payload.orderNumber
  }* belum dapat kami verifikasi.${
    payload.failReason ? `\n\nKeterangan: ${payload.failReason}` : ""
  }

Silakan lakukan pembayaran ulang atau hubungi admin kami untuk bantuan.

Cek detail pesanan di:
${payload.orderUrl}

Terima kasih! 🙏`;

  return sendMessageWithRetry(payload.customerWhatsapp, message);
}

/**
 * Notify admin when new website order arrives
 */
export async function notifyAdminNewOrder(payload: {
  adminWhatsapp: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  orderUrl: string;
  erpOrderId: string;
}) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(payload.totalAmount);

  const erpOrderUrl = `https://app.syncerp.id/rental/orders/${payload.erpOrderId}`;

  const message = `🔔 *PESANAN BARU DARI WEBSITE*

Nomor: *${payload.orderNumber}*
Customer: ${payload.customerName}
WA: ${payload.customerPhone}
Total: ${formattedAmount}

Detail customer: ${payload.orderUrl}
Detail ERP: ${erpOrderUrl}

⏳ Menunggu pembayaran customer.`;

  return sendMessageWithRetry(payload.adminWhatsapp, message);
}

/**
 * Notify admin when customer claims payment
 */
export async function notifyAdminPaymentClaimed(payload: {
  adminWhatsapp: string;
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
  orderUrl: string;
}) {
  const message = `💳 *PEMBAYARAN PERLU VERIFIKASI*

Nomor: *${payload.orderNumber}*
Customer: ${payload.customerName}
Metode: ${payload.paymentMethod.toUpperCase()}

🔗 Verifikasi: ${payload.orderUrl}

Silakan cek mutasi rekening dan konfirmasi pembayaran.`;

  return sendMessageWithRetry(payload.adminWhatsapp, message);
}
