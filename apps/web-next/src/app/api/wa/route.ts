import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { config } from '@/data/config';
import {
  buildLeadLogRecord,
  isLikelyAutomatedUserAgent,
  LeadEventSchema,
  normalizeLeadText,
} from '@/lib/lead-attribution';
import { persistLeadEvent } from '@/lib/lead-db';
import { getGoogleDrivingQuote, GoogleRoutesError } from '@/lib/google-routes';
import { buildWhatsAppLocationText } from '@/lib/whatsapp-location';
import { guardDeliveryQuoteRequest } from '@/lib/delivery-quote-guard';

const WA_REDIRECT_ERROR_MESSAGE = 'WhatsApp redirect is temporarily unavailable';

function sanitizedPhone(value: string | null): string {
  const configuredDigits = config.whatsappNumber.replace(/\D/g, '');
  const requestedDigits = (value || '').replace(/\D/g, '');
  return requestedDigits === configuredDigits ? requestedDigits : configuredDigits;
}

function sanitizeWhatsAppText(text: string): string {
  return text
    .replace(/\n?\[W:[^\]]+\]/g, '')
    .replace(/\n?\[L:[^\]]+\]/g, '')
    .replace(/\{Paket Single \/ Paket Double\}/g, '')
    .replace(/\{jumlah hari\}/g, '')
    .replace(/\{jumlah\}/g, '')
    .replace(/\{tanggal\}/g, '')
    .replace(/\{alamat lengkap\}/g, '')
    .replace(/\{pernikahan \/ pengajian \/ seminar \/ pameran \/ lainnya\}/g, '')
    .replace(/\{panjang x lebar \/ estimasi jumlah tamu\}/g, '')
    .replace(/\{karpet merah \/ permadani \/ lesehan \/ by request\}/g, '')
    .replace(/\{permadani merah \/ permadani emas \/ runner acara \/ by request\}/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const trackedEventId = normalizeLeadText(params.get('event_id'));
    const eventId = trackedEventId ?? randomUUID();
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
      product_category: normalizeLeadText(params.get('product_category')),
      page_type: normalizeLeadText(params.get('page_type')),
      intent: normalizeLeadText(params.get('intent')),
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
    const automatedTraffic = isLikelyAutomatedUserAgent(parsed.user_agent);
    const hasCoordinates = typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number';
    const quoteGuard = hasCoordinates
      ? guardDeliveryQuoteRequest(request, parsed.latitude as number, parsed.longitude as number)
      : null;
    if (quoteGuard && !quoteGuard.allowed) {
      console.warn('[santi_delivery_quote] Quote blocked:', {
        event_id: eventId,
        code: quoteGuard.code,
      });
    }
    const quotePromise = !automatedTraffic && hasCoordinates && quoteGuard?.allowed
      ? getGoogleDrivingQuote(parsed.latitude as number, parsed.longitude as number).catch((error: unknown) => {
          const code = error instanceof GoogleRoutesError ? error.code : 'UNKNOWN';
          console.warn('[santi_delivery_quote] Quote unavailable:', { event_id: eventId, code });
          return null;
        })
      : Promise.resolve(null);
    const persistenceInput = trackedEventId
      ? {
          ...parsed,
          city: undefined,
          geocode_status: undefined,
          geocode_source: undefined,
          geocode_city: undefined,
          geocode_kecamatan: undefined,
          geocode_kelurahan: undefined,
          geocode_full_address: undefined,
        }
      : parsed;
    const [persistence, quote] = await Promise.all([
      trackedEventId && !automatedTraffic
        ? persistLeadEvent(eventId, persistenceInput, receivedAt, { geocode: false })
        : Promise.resolve(null),
      quotePromise,
    ]);
    const record = persistence?.record ?? buildLeadLogRecord(eventId, parsed, receivedAt);

    console.info('[santi_lead_event]', JSON.stringify({
      ...record,
      tracking_mode: !trackedEventId ? 'untracked_redirect' : automatedTraffic ? 'automated_filtered' : 'client_event',
      db_configured: persistence?.configured ?? false,
      db_persisted: persistence?.persisted ?? false,
    }));
    if (persistence?.errorMessage) {
      console.error('[santi_lead_event] DB_PERSIST_FAILURE:', {
        event_id: eventId,
        message: persistence.errorMessage,
      });
    }

    const to = sanitizedPhone(params.get('to'));
    const enrichedText = buildWhatsAppLocationText(params.get('text') ?? '', {
      addressText: normalizeLeadText(params.get('address_text')),
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      quote,
    });
    const text = sanitizeWhatsAppText(enrichedText);
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
      { ok: false, error: { code: 'WA_REDIRECT_ERROR', message: WA_REDIRECT_ERROR_MESSAGE } },
      { status: 500 }
    );
  }
}
