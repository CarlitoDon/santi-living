import { config } from '@/data/config';

/**
 * Preset chat template ported from Astro version (StickyWhatsApp.astro).
 * Structured format guides customers to provide rental details upfront,
 * improving lead quality and reducing back-and-forth.
 */
export const WA_PRESET_ORDER = `Halo Admin Santi Living by Santi Mebel Jogja,
Saya ingin menyewa kasur.

Detail rencana sewa saya:
Paket: {Paket Single / Paket Double}
Jumlah unit: {jumlah}
Tanggal mulai sewa: {tanggal}
Durasi sewa: {jumlah hari}

Alamat pengiriman:
{alamat lengkap}

Mohon info ketersediaan, harga sewa, dan ongkirnya.
Terima kasih.`;

/** Short inquiry preset for header/nav buttons */
export const WA_PRESET_INQUIRY = 'Halo Santi Living, saya mau tanya tentang sewa kasur';

/**
 * Generates a correctly encoded WhatsApp URL using the globally configured phone number.
 * Ensures the `data/config.json` number acts as the single source of truth.
 *
 * @param text The pre-filled message text.
 * @returns A fully encoded WhatsApp URI.
 */
export function getWhatsAppUrl(text?: string): string {
  if (!text) return `https://wa.me/${config.whatsappNumber}`;
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
