'use client';

import { useEffect, useState } from 'react';

export type DeliveryQuoteStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UseDeliveryQuoteInput {
  latitude: string;
  longitude: string;
  onQuote: (deliveryFee: number, distanceKm: number) => void;
}

export function useDeliveryQuote({
  latitude,
  longitude,
  onQuote,
}: UseDeliveryQuoteInput): DeliveryQuoteStatus {
  const numericLatitude = Number(latitude);
  const numericLongitude = Number(longitude);
  const hasCoordinates = Boolean(latitude && longitude);
  const hasValidCoordinates = hasCoordinates
    && Number.isFinite(numericLatitude)
    && Number.isFinite(numericLongitude);
  const quoteKey = hasValidCoordinates ? `${latitude},${longitude}` : '';
  const [result, setResult] = useState<{ key: string; status: DeliveryQuoteStatus }>({
    key: '',
    status: 'idle',
  });

  const status: DeliveryQuoteStatus = !hasCoordinates
    ? 'idle'
    : !hasValidCoordinates
      ? 'error'
      : result.key === quoteKey
        ? result.status
        : 'loading';

  useEffect(() => {
    if (!hasValidCoordinates) return;

    const controller = new AbortController();
    onQuote(0, 0);

    void fetch(
      `/api/delivery-quote?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error('Quote unavailable');
        const data = await response.json() as {
          quote?: { deliveryFee?: number; distanceKm?: number };
        };
        const deliveryFee = data.quote?.deliveryFee;
        const distanceKm = data.quote?.distanceKm;
        if (!Number.isFinite(deliveryFee) || !Number.isFinite(distanceKm)) {
          throw new Error('Invalid quote');
        }
        onQuote(deliveryFee as number, distanceKm as number);
        setResult({ key: quoteKey, status: 'ready' });
      })
      .catch((error: unknown) => {
        if ((error as Error).name === 'AbortError') return;
        onQuote(0, 0);
        setResult({ key: quoteKey, status: 'error' });
      });

    return () => controller.abort();
  }, [hasValidCoordinates, latitude, longitude, onQuote, quoteKey]);

  return status;
}
