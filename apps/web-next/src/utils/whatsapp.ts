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
