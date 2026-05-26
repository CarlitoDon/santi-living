import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LeadEventSchema } from '@/lib/lead-attribution';
import { persistLeadEvent } from '@/lib/lead-db';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = LeadEventSchema.parse(body);
    const eventId = parsed.event_id ?? randomUUID();
    const receivedAt = new Date().toISOString();
    const persistence = await persistLeadEvent(eventId, parsed, receivedAt, { geocode: true });
    const record = persistence.record;

    console.info('[santi_lead_event]', JSON.stringify({
      ...record,
      db_configured: persistence.configured,
      db_persisted: persistence.persisted,
    }));
    if (persistence.errorMessage) {
      console.error('[santi_lead_event] DB_PERSIST_FAILURE:', {
        event_id: eventId,
        message: persistence.errorMessage,
      });
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
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION_ERROR', details: error.errors } },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error('[santi_lead_event] FAILURE:', { message });
    return NextResponse.json(
      { ok: false, error: { code: 'TRACKING_ERROR', message } },
      { status: 500 }
    );
  }
}
