import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LeadEventSchema } from '@/lib/lead-attribution';
import { persistLeadEvent } from '@/lib/lead-db';

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = request.headers.get('x-vercel-id') ?? undefined;

  try {
    const body: unknown = await request.json();
    const parsed = LeadEventSchema.parse(body);
    const eventId = parsed.event_id ?? randomUUID();
    const receivedAt = new Date().toISOString();
    const persistence = await persistLeadEvent(eventId, parsed, receivedAt, { geocode: true });

    console.info(JSON.stringify({
      level: 'info',
      message: 'lead_event_processed',
      route: '/api/lead/track',
      request_id: requestId,
      event_type: parsed.event_type,
      city_classification: persistence.cityClassification,
      db_configured: persistence.configured,
      db_persisted: persistence.persisted,
      duration_ms: Date.now() - startedAt,
    }));
    if (persistence.errorMessage) {
      console.error(JSON.stringify({
        level: 'error',
        message: 'lead_event_persist_failed',
        route: '/api/lead/track',
        request_id: requestId,
        event_type: parsed.event_type,
        duration_ms: Date.now() - startedAt,
        error: persistence.errorMessage.slice(0, 300),
      }));
    }

    return NextResponse.json({
      ok: true,
      eventId,
      receivedAt,
      cityClassification: persistence.cityClassification,
      persisted: persistence.persisted,
      storageConfigured: persistence.configured,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.warn(JSON.stringify({
        level: 'warning',
        message: 'lead_event_validation_failed',
        route: '/api/lead/track',
        request_id: requestId,
        duration_ms: Date.now() - startedAt,
      }));
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION_ERROR', details: error.errors } },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({
      level: 'error',
      message: 'lead_event_tracking_failed',
      route: '/api/lead/track',
      request_id: requestId,
      duration_ms: Date.now() - startedAt,
      error: message.slice(0, 300),
    }));
    return NextResponse.json(
      { ok: false, error: { code: 'TRACKING_ERROR', message } },
      { status: 500 }
    );
  }
}
