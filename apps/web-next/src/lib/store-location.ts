import { config } from '@/data/config';

export const STORE_LOCATION = config.storeLocation;

export function getGoogleMapsCoordinateUrl(latitude: number, longitude: number): string {
  return `https://maps.google.com/?q=${latitude.toFixed(7)},${longitude.toFixed(7)}`;
}

export function getStoreMapEmbedUrl(): string {
  const query = `${STORE_LOCATION.lat},${STORE_LOCATION.lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`;
}
