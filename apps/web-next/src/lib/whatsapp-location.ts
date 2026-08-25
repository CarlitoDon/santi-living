import type { GoogleDrivingQuote } from '@/lib/google-routes';
import { getGoogleMapsCoordinateUrl } from '@/lib/store-location';

interface WhatsAppLocationInput {
  addressText?: string | null;
  latitude?: number;
  longitude?: number;
  quote?: GoogleDrivingQuote | null;
}

function formatRupiah(value: number): string {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
}

function formatDistance(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

function applyAddress(text: string, addressText?: string | null): string {
  const address = String(addressText || '').trim();
  if (!address) return text;

  if (text.includes('{alamat lengkap}')) {
    return text.replace(/\{alamat lengkap\}/g, address);
  }
  if (/Alamat pengiriman:\s*$/i.test(text)) {
    return `${text}\n${address}`;
  }
  if (!text) {
    return `Halo Admin Santi Living by Santi Mebel Jogja,\nSaya ingin menyewa kasur.\n\nAlamat pengiriman:\n${address}`;
  }
  return `${text}\n\nAlamat pengiriman:\n${address}`;
}

export function buildWhatsAppLocationText(
  initialText: string,
  location: WhatsAppLocationInput,
): string {
  let text = applyAddress(String(initialText || '').trim(), location.addressText);
  const hasCoordinates = Number.isFinite(location.latitude) && Number.isFinite(location.longitude);
  if (!hasCoordinates || text.includes('Google Maps (lokasi presisi):')) return text;

  const latitude = location.latitude as number;
  const longitude = location.longitude as number;
  const lines = [
    'Google Maps (lokasi presisi):',
    getGoogleMapsCoordinateUrl(latitude, longitude),
  ];

  if (location.quote) {
    const rawFee = (location.quote.distanceKm * 4 / 10) * 10_000;
    lines.push(
      `Jarak berkendara dari workshop: ${formatDistance(location.quote.distanceKm)} km`,
      `Rumus ongkir: ${formatDistance(location.quote.distanceKm)} × 4 ÷ 10 × Rp10.000 = ${formatRupiah(rawFee)}`,
      `Estimasi ongkir antar-jemput (dibulatkan ke atas Rp1.000): ${formatRupiah(location.quote.deliveryFee)}`,
    );
  } else {
    lines.push('Estimasi ongkir: belum dapat dihitung otomatis');
  }

  text = text ? `${text}\n\n${lines.join('\n')}` : lines.join('\n');
  return text;
}
