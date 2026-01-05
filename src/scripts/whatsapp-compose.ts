// ==========================================================================
// WhatsApp Compose - Santi Living (Multi-Item Cart)
// ==========================================================================

import config from "@/data/config.json";
import type { CartItem } from "@/types";

interface BookingData {
  items: CartItem[];
  startDate: string;
  endDate: string;
  duration: number;
  totalQuantity: number;
  total: number;
  name: string;
  address: string;
  notes?: string;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

/**
 * Compose WhatsApp message with multi-item cart
 */
export function composeWhatsAppMessage(booking: BookingData): string {
  let message = `Halo, saya mau sewa:\\n\\n`;

  // List all mattress items
  message += `Kasur:\\n`;
  booking.items.forEach((item) => {
    const subtotal = item.quantity * item.pricePerDay * booking.duration;
    message += `• ${item.quantity}x ${item.name} @ Rp ${formatCurrency(
      item.pricePerDay
    )}/hari\\n`;
  });

  message += `\\nTotal: ${booking.totalQuantity} unit\\n`;
  message += `Tanggal: ${formatDate(booking.startDate)} - ${formatDate(
    booking.endDate
  )} (${booking.duration} hari)\\n`;
  message += `Total Biaya: Rp ${formatCurrency(booking.total)}\\n\\n`;
  message += `- Nama: ${booking.name}\\n`;
  message += `- Alamat: ${booking.address}\\n`;

  if (booking.notes && booking.notes.trim()) {
    message += `- Catatan: ${booking.notes}\\n`;
  }

  message += `\\nMohon konfirmasi ketersediaan. Terima kasih!`;

  return message;
}

/**
 * Compose WhatsApp URL with pre-filled message
 */
export function composeWhatsAppUrl(booking: BookingData): string {
  const message = composeWhatsAppMessage(booking);
  const encodedMessage = encodeURIComponent(message);
  const phone = config.whatsappNumber;

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with pre-filled message
 * Returns true if successful, false if blocked
 */
export function openWhatsApp(booking: BookingData): boolean {
  const url = composeWhatsAppUrl(booking);

  try {
    const newWindow = window.open(url, "_blank");
    return !!(newWindow && !newWindow.closed);
  } catch {
    return false;
  }
}
