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

/** Short CTA source codes kept for backward-compatible analytics labels. */
export const WA_SOURCE_CODES: Record<string, string> = {
  header_desktop: 'hd',
  header_mobile: 'hm',
  sticky_button: 'st',
  hero_cta: 'hc',
  hero_phone: 'hp',
  footer_cta: 'fc',
  nav_sidebar: 'nv',
  harga_page: 'hg',
  order_page: 'od',
  thank_you: 'ty',
  promo_section: 'pr',
  footer_social: 'fs',
  product_page: 'pp',
  blog_cta: 'bl',
  calculator: 'cl',
};

/**
 * Computes a short attribution code from sl_attribution_v1 localStorage data.
 * CLIENT-SIDE ONLY — call this from click handlers, never during render.
 * Returns a short code like "g/cpc" or "g/organic" or "fb/ig" etc.
 */
export function getAttributionTag(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('sl_attribution_v1');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    const t = parsed.last || {};
    const source = (t.source || '').toLowerCase();
    const medium = (t.medium || '').toLowerCase();

    // Google Ads
    if (t.gclid || (source === 'google' && medium === 'cpc')) return 'g/cpc';
    if (t.gbraid) return 'g/cpc-b';
    if (t.wbraid) return 'g/cpc-w';
    // Google organic
    if (source === 'google' && medium === 'organic') return 'g/org';
    // GBP
    if (source.includes('google_business_profile')) return 'gbp';
    if (source.includes('google') && medium === 'organic') return 'gbp';
    // Social
    if (source.includes('instagram') || source.includes('ig')) return 'ig';
    if (source.includes('facebook') || source.includes('fb')) return 'fb';
    if (source.includes('tiktok')) return 'tt';
    // Referral
    if (medium === 'referral') return 'ref';
    // Direct
    if (source === '(direct)' || source === '(none)') return 'dir';
    // Default
    return source ? source.slice(0, 6) : '';
  } catch {
    return '';
  }
}

/**
 * Generates a tracked WhatsApp redirect URL using the globally configured phone number.
 * The redirect endpoint logs a lead event before sending the visitor to WhatsApp.
 *
 * Attribution (Ads/organic/manual) is NOT read here — it's handled client-side
 * in GtagScript.tsx click handler to avoid hydration mismatch.
 *
 * @param text The pre-filled message text.
 * @param sourceKey Optional source key from WA_SOURCE_CODES (e.g. 'header_desktop').
 * @returns A tracked relative redirect URL.
 */
export function getWhatsAppUrl(text?: string, sourceKey?: string): string {
  const params = new URLSearchParams({
    to: config.whatsappNumber,
    cta_source: sourceKey || 'unknown',
  });

  if (text) {
    params.set('text', text);
  }

  return `/api/wa?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Calculator pre-filled WhatsApp message builder
// ---------------------------------------------------------------------------

interface CalculatorWhatsAppInput {
  items: Array<{ name: string; category: string; quantity: number }>;
  duration: number;
  startDate: string | null;
  address: {
    street?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    zip?: string;
    lat?: string;
    lng?: string;
  };
}

/** Maps item category to a human-friendly Indonesian label */
function categoryLabel(category: string): string {
  switch (category) {
    case 'package':
      return 'Paket';
    case 'mattress':
      return 'Kasur';
    case 'accessory':
      return 'Aksesoris';
    default:
      return 'Barang';
  }
}

/**
 * Builds a human-friendly pre-filled WhatsApp message from calculator state.
 * The caller can pass the result directly to `getWhatsAppUrl(text, sourceKey)`.
 *
 * Includes:
 * - Each selected mattress/accessory package with quantity
 * - Rental duration (days)
 * - Delivery / start date
 * - Estimated delivery location (kelurahan if available)
 */
export function buildCalculatorWhatsAppMessage(input: CalculatorWhatsAppInput): string {
  const lines: string[] = [
    'Halo Santi Living, saya mau pesan/sewa kasur.',
  ];

  // --- Items ---------------------------------------------------------------
  if (input.items.length > 0) {
    lines.push('');
    lines.push('Detail pesanan:');
    input.items.forEach((item) => {
      const label = categoryLabel(item.category);
      const qtyLabel = item.quantity > 1 ? ` (x${item.quantity})` : '';
      lines.push(`- ${label}: ${item.name}${qtyLabel}`);
    });
  }

  // --- Duration & start date -----------------------------------------------
  if (input.duration > 0) {
    lines.push('');
    lines.push(`Durasi sewa: ${input.duration} hari`);
  }
  if (input.startDate) {
    try {
      const d = new Date(input.startDate);
      const formatted = d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      lines.push(`Tanggal mulai: ${formatted}`);
    } catch {
      lines.push(`Tanggal mulai: ${input.startDate}`);
    }
  }

  // --- Delivery location (kelurahan highlight) ----------------------------
  const { address } = input;
  const locationParts: string[] = [];
  if (address.kelurahan) locationParts.push(address.kelurahan);
  if (address.kecamatan) locationParts.push(address.kecamatan);
  if (address.kota) locationParts.push(address.kota);

  if (locationParts.length > 0) {
    lines.push('');
    lines.push(`Lokasi pengiriman: ${locationParts.join(', ')}`);
  }

  // --- Full address (street + remaining details) --------------------------
  const addrParts: string[] = [];
  if (address.street) addrParts.push(address.street);
  if (address.kelurahan) addrParts.push(address.kelurahan);
  if (address.kecamatan) addrParts.push(address.kecamatan);
  if (address.kota) addrParts.push(address.kota);
  if (address.provinsi) addrParts.push(address.provinsi);
  if (address.zip) addrParts.push(`Kode Pos ${address.zip}`);

  if (addrParts.length > 0) {
    lines.push('');
    lines.push('Alamat lengkap:');
    lines.push(addrParts.join(', '));
  }

  // --- CTA -----------------------------------------------------------------
  lines.push('');
  lines.push('Mohon info ketersediaan, harga sewa, dan ongkirnya.');
  lines.push('Terima kasih.');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Address-section consultation message builder
// ---------------------------------------------------------------------------

interface AddressConsultInput {
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  lat?: string;
  lng?: string;
}

/**
 * Builds a short WhatsApp inquiry focused on delivery feasibility for a given
 * address. Useful when the user hasn't finished the full form yet but wants to
 * check if their area is served.
 */
export function buildAddressConsultMessage(address: AddressConsultInput): string {
  const parts: string[] = [];
  if (address.kelurahan) parts.push(address.kelurahan);
  if (address.kecamatan) parts.push(address.kecamatan);
  if (address.kota) parts.push(address.kota);
  if (address.provinsi) parts.push(address.provinsi);

  const locationLine = parts.length > 0 ? ` di ${parts.join(', ')}` : '';

  const lines: string[] = [
    `Halo Santi Living, saya mau tanya pengiriman kasur${locationLine}.`,
    '',
    'Apakah area saya sudah terjangkau untuk pengiriman dan penjemputan?',
    'Mohon info estimasi ongkirnya ya. Terima kasih.',
  ];

  return lines.join('\n');
}
