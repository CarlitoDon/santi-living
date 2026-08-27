/**
 * @vitest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDeliveryQuote } from './useDeliveryQuote';

describe('useDeliveryQuote', () => {
  afterEach(() => vi.restoreAllMocks());

  it('publishes a Google road-route quote for the selected destination', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      quote: { deliveryFee: 40_000, distanceKm: 9.994 },
    }), { status: 200 }));
    const onQuote = vi.fn();

    const { result } = renderHook(() => useDeliveryQuote({
      latitude: '-7.7672263',
      longitude: '110.3543540',
      onQuote,
    }));

    expect(result.current).toBe('loading');
    await waitFor(() => expect(result.current).toBe('ready'));
    expect(onQuote).toHaveBeenLastCalledWith(40_000, 9.994);
  });

  it('clears a stale fee when the route quote fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 503 }));
    const onQuote = vi.fn();

    const { result } = renderHook(() => useDeliveryQuote({
      latitude: '-7.77',
      longitude: '110.35',
      onQuote,
    }));

    await act(async () => undefined);
    await waitFor(() => expect(result.current).toBe('error'));
    expect(onQuote).toHaveBeenLastCalledWith(0, 0);
  });
});
