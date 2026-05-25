import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { config } from '@/data/config';
import {
  buildLeadLogRecord,
  LeadEventSchema,
  normalizeLeadText,
} from '@/lib/lead-attribution';

function sanitizedPhone(value: string | null): string {
  const digits = (value || config.whatsappNumber).replace(/\D/g, '');
  return digits || config.whatsappNumber;
}

function appendLeadId(text: string, eventId: string): string {
  const tag = `[L:${eventId.slice(0, 8)}]`;
  if (!text.trim()) return tag;
  if (text.includes(tag)) return text;
  return `${text}\n${tag}`;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const eventId = normalizeLeadText(params.get('event_id')) ?? randomUUID();
    const receivedAt = new Date().toISOString();

    const parsed = LeadEventSchema.parse({
      event_id: eventId,
      event_type: 'whatsapp_click',
      source: normalizeLeadText(params.get('source')),
      medium: normalizeLeadText(params.get('medium')),
      campaign: normalizeLeadText(params.get('campaign')),
      term: normalizeLeadText(params.get('term')),
      content: normalizeLeadText(params.get('content')),
      cta_source: normalizeLeadText(params.get('cta_source')) ?? 'unknown',
      cta_location: normalizeLeadText(params.get('cta_location')),
      landing_page: normalizeLeadText(params.get('landing_page')) ?? request.headers.get('referer') ?? '',
      city: normalizeLeadText(params.get('city')),
      device: normalizeLeadText(params.get('device')),
      gclid: normalizeLeadText(params.get('gclid')),
      wbraid: normalizeLeadText(params.get('wbraid')),
      gbraid: normalizeLeadText(params.get('gbraid')),
      fbclid: normalizeLeadText(params.get('fbclid')),
      location_permission: normalizeLeadText(params.get('location_permission')),
      latitude: normalizeLeadText(params.get('latitude')),
      longitude: normalizeLeadText(params.get('longitude')),
      location_accuracy_m: normalizeLeadText(params.get('location_accuracy_m')),
      user_agent: request.headers.get('user-agent') ?? undefined,
      referrer: request.headers.get('referer') ?? undefined,
      timestamp: receivedAt,
    });
    const record = buildLeadLogRecord(eventId, parsed, receivedAt);

    console.info('[santi_lead_event]', JSON.stringify(record));

    const to = sanitizedPhone(params.get('to'));
    const text = appendLeadId(params.get('text') ?? '', eventId);
    const redirectUrl = new URL(`https://wa.me/${to}`);
    if (text) {
      redirectUrl.searchParams.set('text', text);
    }

    return NextResponse.redirect(redirectUrl, { status: 307 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION_ERROR', details: error.errors } },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error('[santi_lead_event] WA_REDIRECT_FAILURE:', { message });
    return NextResponse.json(
      { ok: false, error: { code: 'WA_REDIRECT_ERROR', message } },
      { status: 500 }
    );
  }
}
