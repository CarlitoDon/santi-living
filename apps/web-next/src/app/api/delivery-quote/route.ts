import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardDeliveryQuoteRequest } from '@/lib/delivery-quote-guard';
import { getGoogleDrivingQuote, GoogleRoutesError } from '@/lib/google-routes';

const CoordinatesSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function GET(request: NextRequest) {
  const parsed = CoordinatesSchema.safeParse({
    latitude: request.nextUrl.searchParams.get('lat'),
    longitude: request.nextUrl.searchParams.get('lng'),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_COORDINATES' } },
      { status: 400 },
    );
  }

  const { latitude, longitude } = parsed.data;
  const guard = guardDeliveryQuoteRequest(request, latitude, longitude);
  if (!guard.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: guard.code } },
      { status: guard.code === 'RATE_LIMITED' ? 429 : 422 },
    );
  }

  try {
    const quote = await getGoogleDrivingQuote(latitude, longitude);
    return NextResponse.json({
      ok: true,
      quote: {
        deliveryFee: quote.deliveryFee,
        distanceKm: quote.distanceKm,
      },
    });
  } catch (error) {
    const code = error instanceof GoogleRoutesError ? error.code : 'UNKNOWN';
    console.warn('[delivery_quote] Google route unavailable:', { code });
    return NextResponse.json(
      { ok: false, error: { code: 'QUOTE_UNAVAILABLE' } },
      { status: 503 },
    );
  }
}
