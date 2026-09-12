import { describe, expect, it } from 'vitest';
import { ProxyTransportError } from './trpc-client';
import { mapUpstreamError } from './upstream-error';

describe('mapUpstreamError', () => {
  it('maps proxy transport failures to a safe 503 response', () => {
    const result = mapUpstreamError(
      new ProxyTransportError('Proxy returned a non-JSON response (HTTP 404)', 404),
      'Failed to process request',
    );

    expect(result).toEqual({
      status: 503,
      code: 'PROXY_UNAVAILABLE',
      message:
        'Sistem pemesanan sedang mengalami gangguan sementara. Silakan hubungi admin via WhatsApp.',
    });
  });

  it('preserves mapped status for ordinary upstream errors', () => {
    expect(mapUpstreamError(new Error('Forbidden'), 'Fallback')).toEqual({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Forbidden',
    });
  });
});
