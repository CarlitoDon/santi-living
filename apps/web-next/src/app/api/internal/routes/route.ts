import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  computeGoogleMultiStopRoute,
  GoogleRoutesError,
} from '@/lib/google-routes';
import { STORE_LOCATION } from '@/lib/store-location';

const CoordinateSchema = z.object({
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
}).strict();

const MultiStopRoutesRequestSchema = z.object({
  stops: z.array(CoordinateSchema).min(1).max(9),
  origin: CoordinateSchema.optional(),
  destination: CoordinateSchema.optional(),
}).strict();

function hasValidToken(request: NextRequest): boolean {
  const expectedToken = process.env.GOOGLE_ROUTES_INTERNAL_TOKEN?.trim();
  const providedToken = request.headers.get('x-santi-routes-token')?.trim();
  if (!expectedToken || !providedToken) return false;

  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function POST(request: NextRequest) {
  if (!hasValidToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = MultiStopRoutesRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid routes request' }, { status: 400 });
  }

  try {
    const route = await computeGoogleMultiStopRoute({
      stops: parsed.data.stops,
      origin: parsed.data.origin ?? {
        latitude: STORE_LOCATION.lat,
        longitude: STORE_LOCATION.lng,
      },
      destination: parsed.data.destination ?? {
        latitude: STORE_LOCATION.lat,
        longitude: STORE_LOCATION.lng,
      },
    });
    return NextResponse.json(route);
  } catch (error) {
    const code = error instanceof GoogleRoutesError ? error.code : 'UNKNOWN';
    console.warn('[internal_routes] Google route unavailable:', { code });
    return NextResponse.json({ error: 'Routes unavailable' }, { status: 502 });
  }
}
