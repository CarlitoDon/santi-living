import { config } from '@/data/config';

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
