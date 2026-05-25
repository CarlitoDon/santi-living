import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildLeadLogRecord, LeadEventSchema } from '@/lib/lead-attribution';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = LeadEventSchema.parse(body);
    const eventId = parsed.event_id ?? randomUUID();
    const receivedAt = new Date().toISOString();
    const record = buildLeadLogRecord(eventId, parsed, receivedAt);

    console.info('[santi_lead_event]', JSON.stringify(record));

    return NextResponse.json({
      ok: true,
      eventId,
      receivedAt,
      cityClassification: record.city_classification,
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
