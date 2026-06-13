import { WA_PRESET_ORDER } from '@/utils/whatsapp';

export type HostCtaContext = 'default' | 'karpet' | 'permadani' | 'acara';

export interface HostCtaCopy {
  context: HostCtaContext;
  desktopLabel: string;
  mobileAriaLabel: string;
  navLabel: string;
  stickyAriaLabel: string;
  waText: string;
}

export const KARPET_WA_PRESET = `Halo Santi Living, saya ingin cek ketersediaan sewa karpet Jogja.

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}
Jenis karpet yang dibutuhkan: {permadani merah / permadani emas / runner acara / by request}

Mohon info ketersediaan, rekomendasi ukuran, estimasi harga, dan ongkirnya.`;

export const PERMADANI_WA_PRESET = `Halo Santi Living, saya ingin cek ketersediaan permadani untuk area duduk.

Detail kebutuhan:
Acara: {pengajian / tahlilan / tamu keluarga / lainnya}
Tanggal: {tanggal}
Lokasi: {alamat lengkap}
Ukuran area / jumlah tamu: {estimasi}
Motif: {permadani merah / permadani emas / by request}

Mohon info stok, rekomendasi jumlah, estimasi harga, dan ongkirnya.`;

export const ACARA_WA_PRESET = `Halo Santi Living, saya ingin cek paket perlengkapan event.

Detail acara:
Jenis acara: {festival / gathering / wedding prep / kampus / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Kebutuhan inti: {kasur rest area / air cooler / TV display / karpet / lainnya}
Item by request: {meja / kursi / sound / dekorasi ringan / lainnya}

Mohon info ketersediaan, rekomendasi paket, estimasi harga, dan ongkirnya.`;

export const DEFAULT_HOST_CTA: HostCtaCopy = {
  context: 'default',
  desktopLabel: 'Pesan',
  mobileAriaLabel: 'Pesan via WhatsApp',
  navLabel: 'Hubungi WhatsApp',
  stickyAriaLabel: 'Chat WhatsApp',
  waText: WA_PRESET_ORDER,
};

const HOST_CTA_BY_CONTEXT: Record<Exclude<HostCtaContext, 'default'>, { id: HostCtaCopy; en: HostCtaCopy }> = {
  karpet: {
    id: {
      context: 'karpet',
      desktopLabel: 'Cek karpet acara',
      mobileAriaLabel: 'Cek karpet acara via WhatsApp',
      navLabel: 'Cek karpet via WhatsApp',
      stickyAriaLabel: 'Cek karpet acara via WhatsApp',
      waText: KARPET_WA_PRESET,
    },
    en: {
      context: 'karpet',
      desktopLabel: 'Check event carpet',
      mobileAriaLabel: 'Check event carpet via WhatsApp',
      navLabel: 'Check carpet via WhatsApp',
      stickyAriaLabel: 'Check event carpet via WhatsApp',
      waText: KARPET_WA_PRESET,
    },
  },
  permadani: {
    id: {
      context: 'permadani',
      desktopLabel: 'Cek permadani',
      mobileAriaLabel: 'Cek permadani via WhatsApp',
      navLabel: 'Cek permadani via WhatsApp',
      stickyAriaLabel: 'Cek permadani via WhatsApp',
      waText: PERMADANI_WA_PRESET,
    },
    en: {
      context: 'permadani',
      desktopLabel: 'Check rug',
      mobileAriaLabel: 'Check rug via WhatsApp',
      navLabel: 'Check rug via WhatsApp',
      stickyAriaLabel: 'Check rug via WhatsApp',
      waText: PERMADANI_WA_PRESET,
    },
  },
  acara: {
    id: {
      context: 'acara',
      desktopLabel: 'Cek paket event',
      mobileAriaLabel: 'Cek paket event via WhatsApp',
      navLabel: 'Cek paket event via WhatsApp',
      stickyAriaLabel: 'Cek paket event via WhatsApp',
      waText: ACARA_WA_PRESET,
    },
    en: {
      context: 'acara',
      desktopLabel: 'Check event package',
      mobileAriaLabel: 'Check event package via WhatsApp',
      navLabel: 'Check event package via WhatsApp',
      stickyAriaLabel: 'Check event package via WhatsApp',
      waText: ACARA_WA_PRESET,
    },
  },
};

const DEFAULT_CTA_BY_LOCALE: Record<'id' | 'en', HostCtaCopy> = {
  id: DEFAULT_HOST_CTA,
  en: {
    context: 'default',
    desktopLabel: 'Order',
    mobileAriaLabel: 'Order via WhatsApp',
    navLabel: 'Contact WhatsApp',
    stickyAriaLabel: 'Chat WhatsApp',
    waText: WA_PRESET_ORDER,
  },
};

export function getHostCta(hostname = '', pathname = '', locale = 'id'): HostCtaCopy {
  const host = hostname.toLowerCase();
  const path = pathname.toLowerCase();
  const l = (locale === 'en' ? 'en' : 'id') as 'id' | 'en';

  if (host.startsWith('permadani.') || path.includes('permadani')) {
    return HOST_CTA_BY_CONTEXT.permadani[l];
  }

  if (host.startsWith('karpet.') || path.startsWith('/sewa-karpet')) {
    return HOST_CTA_BY_CONTEXT.karpet[l];
  }

  if (host.startsWith('acara.') || path.startsWith('/sewa-perlengkapan-event')) {
    return HOST_CTA_BY_CONTEXT.acara[l];
  }

  return DEFAULT_CTA_BY_LOCALE[l];
}
