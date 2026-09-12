import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchProxyResponse,
  isProxyTransportError,
  ProxyTransportError,
} from './trpc-client';

describe('fetchProxyResponse', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects HTML responses before tRPC attempts to parse them', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('<!doctype html><title>Not Found</title>', {
          status: 404,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        }),
      ),
    );

    const request = fetchProxyResponse('https://proxy.example.test/api/trpc');

    await expect(request).rejects.toMatchObject({
      name: 'ProxyTransportError',
      status: 404,
      message: 'Proxy returned a non-JSON response (HTTP 404)',
    });
  });

  it('passes JSON responses through unchanged', async () => {
    const response = new Response('{"ok":true}', {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(
      fetchProxyResponse('https://proxy.example.test/api/trpc'),
    ).resolves.toBe(response);
  });

  it('wraps network failures as proxy transport errors', async () => {
    const networkError = new Error('connect ECONNREFUSED');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(
      fetchProxyResponse('https://proxy.example.test/api/trpc'),
    ).rejects.toMatchObject({
      name: 'ProxyTransportError',
      status: null,
      message: 'Proxy request failed before receiving a response',
    });
  });

  it('recognizes errors wrapped by the tRPC client', () => {
    const transportError = new ProxyTransportError('bad response', 502);
    const wrappedError = new Error('tRPC wrapper');
    Object.defineProperty(wrappedError, 'cause', { value: transportError });

    expect(isProxyTransportError(transportError)).toBe(true);
    expect(isProxyTransportError(wrappedError)).toBe(true);
  });
});
