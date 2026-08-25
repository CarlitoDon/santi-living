import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import {
  guardDeliveryQuoteRequest,
  resetDeliveryQuoteGuardForTests,
} from '@/lib/delivery-quote-guard';

function requestFor(ip: string): NextRequest {
  return new NextRequest('http://localhost/api/wa', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('guardDeliveryQuoteRequest', () => {
  beforeEach(() => resetDeliveryQuoteGuardForTests());

  it('allows normal requests inside the service radius', () => {
    expect(guardDeliveryQuoteRequest(requestFor('203.0.113.10'), -7.81, 110.41, 1_000)).toEqual({
      allowed: true,
    });
  });

  it('blocks coordinates outside the service radius before calling Google', () => {
    expect(guardDeliveryQuoteRequest(requestFor('203.0.113.11'), -6.2, 106.8, 1_000)).toEqual({
      allowed: false,
      code: 'OUTSIDE_SERVICE_AREA',
    });
  });

  it('limits one client to six quote requests per minute', () => {
    const request = requestFor('203.0.113.12');
    for (let attempt = 0; attempt < 6; attempt += 1) {
      expect(guardDeliveryQuoteRequest(request, -7.81, 110.41, 1_000 + attempt).allowed).toBe(true);
    }

    expect(guardDeliveryQuoteRequest(request, -7.81, 110.41, 1_010)).toEqual({
      allowed: false,
      code: 'RATE_LIMITED',
    });
    expect(guardDeliveryQuoteRequest(request, -7.81, 110.41, 61_001)).toEqual({
      allowed: true,
    });
  });
});
