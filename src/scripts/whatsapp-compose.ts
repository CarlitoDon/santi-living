// ==========================================================================
// WhatsApp Compose - Santi Living
// ==========================================================================

import config from "@/data/config.json";

interface BookingData {
  mattressType: string;
  quantity: number;
  startDate: string;
  endDate: string;
  duration: number;
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
 * Compose WhatsApp message
 */
export function composeWhatsAppMessage(booking: BookingData): string {
  let message = `Halo, saya mau sewa:\n\n`;
  message += `- Kasur: ${booking.mattressType}\n`;
  message += `- Jumlah: ${booking.quantity} unit\n`;
  message += `- Tanggal: ${formatDate(booking.startDate)} - ${formatDate(
    booking.endDate
  )} (${booking.duration} hari)\n`;
  message += `- Total: Rp ${formatCurrency(booking.total)}\n\n`;
  message += `- Nama: ${booking.name}\n`;
  message += `- Alamat: ${booking.address}\n`;

  if (booking.notes && booking.notes.trim()) {
    message += `- Catatan: ${booking.notes}\n`;
  }

  message += `\nMohon konfirmasi ketersediaan. Terima kasih!`;

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
