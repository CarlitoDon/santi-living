import { neon } from '@neondatabase/serverless';
import {
  buildLeadLogRecord,
  type LeadCityClassification,
  type LeadEventInput,
} from './lead-attribution';
import { reverseGeocodeLeadLocation } from './lead-geocode';

type LeadSql = ReturnType<typeof neon>;

export interface PersistLeadEventResult {
  configured: boolean;
  persisted: boolean;
  eventId: string;
  cityClassification: LeadCityClassification;
  record: ReturnType<typeof buildLeadLogRecord>;
  errorMessage?: string;
}

export interface LeadExportFilters {
  from?: string;
  to?: string;
  eventType?: string;
  cityClassification?: string;
  source?: string;
  campaign?: string;
  limit: number;
  offset: number;
}

export interface LeadExportRow {
  event_id: string;
  event_type: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  cta_source: string | null;
  cta_location: string | null;
  landing_page: string | null;
  city: string | null;
  city_classification: string;
  device: string | null;
  gclid: string | null;
  wbraid: string | null;
  gbraid: string | null;
  fbclid: string | null;
  location_permission: string | null;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_m: number | null;
  geocode_status: string | null;
  geocode_source: string | null;
  geocode_city: string | null;
  geocode_kecamatan: string | null;
  geocode_kelurahan: string | null;
  geocode_full_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  event_timestamp: string | null;
  received_at: string;
  updated_at: string;
  raw_payload: unknown;
}

let sqlClient: LeadSql | null = null;

function getLeadSql(): LeadSql | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  if (!sqlClient) sqlClient = neon(databaseUrl);
  return sqlClient;
}

export function isLeadDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function nullableText(value: string | undefined): string | null {
  return value?.trim() ? value.trim() : null;
}

function nullableNumber(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function nullableInteger(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null;
}

async function enrichLeadEvent(input: LeadEventInput, shouldGeocode: boolean): Promise<LeadEventInput> {
  if (!shouldGeocode || input.city || input.geocode_city) return input;
  if (typeof input.latitude !== 'number' || typeof input.longitude !== 'number') return input;

  const geocode = await reverseGeocodeLeadLocation(input);
  return {
    ...input,
    city: input.city ?? geocode.geocode_city,
    geocode_status: geocode.geocode_status,
    geocode_source: geocode.geocode_source,
    geocode_city: geocode.geocode_city,
    geocode_kecamatan: geocode.geocode_kecamatan,
    geocode_kelurahan: geocode.geocode_kelurahan,
    geocode_full_address: geocode.geocode_full_address,
  };
}

export async function persistLeadEvent(
  eventId: string,
  input: LeadEventInput,
  receivedAt: string,
  options: { geocode?: boolean } = {},
): Promise<PersistLeadEventResult> {
  const sql = getLeadSql();
  const enriched = sql ? await enrichLeadEvent(input, Boolean(options.geocode)) : input;
  const record = buildLeadLogRecord(eventId, enriched, receivedAt);
  const baseResult = {
    configured: Boolean(sql),
    eventId,
    cityClassification: record.city_classification,
    record,
  };

  if (!sql) {
    return { ...baseResult, persisted: false };
  }

  const rawPayload = JSON.stringify({
    ...enriched,
    event_id: eventId,
    city_classification: record.city_classification,
  });

  try {
    await sql`
      INSERT INTO lead_events (
        event_id,
        event_type,
        source,
        medium,
        campaign,
        term,
        content,
        cta_source,
        cta_location,
        landing_page,
        city,
        city_classification,
        device,
        gclid,
        wbraid,
        gbraid,
        fbclid,
        location_permission,
        latitude,
        longitude,
        location_accuracy_m,
        geocode_status,
        geocode_source,
        geocode_city,
        geocode_kecamatan,
        geocode_kelurahan,
        geocode_full_address,
        user_agent,
        referrer,
        event_timestamp,
        received_at,
        raw_payload
      )
      VALUES (
        ${eventId},
        ${enriched.event_type},
        ${nullableText(enriched.source)},
        ${nullableText(enriched.medium)},
        ${nullableText(enriched.campaign)},
        ${nullableText(enriched.term)},
        ${nullableText(enriched.content)},
        ${nullableText(enriched.cta_source)},
        ${nullableText(enriched.cta_location)},
        ${nullableText(enriched.landing_page)},
        ${nullableText(enriched.city)},
        ${record.city_classification},
        ${nullableText(enriched.device)},
        ${nullableText(enriched.gclid)},
        ${nullableText(enriched.wbraid)},
        ${nullableText(enriched.gbraid)},
        ${nullableText(enriched.fbclid)},
        ${nullableText(enriched.location_permission)},
        ${nullableNumber(enriched.latitude)},
        ${nullableNumber(enriched.longitude)},
        ${nullableInteger(enriched.location_accuracy_m)},
        ${nullableText(enriched.geocode_status)},
        ${nullableText(enriched.geocode_source)},
        ${nullableText(enriched.geocode_city)},
        ${nullableText(enriched.geocode_kecamatan)},
        ${nullableText(enriched.geocode_kelurahan)},
        ${nullableText(enriched.geocode_full_address)},
        ${nullableText(enriched.user_agent)},
        ${nullableText(enriched.referrer)},
        ${(enriched.timestamp ?? receivedAt)}::timestamptz,
        ${receivedAt}::timestamptz,
        ${rawPayload}::jsonb
      )
      ON CONFLICT (event_id) DO UPDATE SET
        event_type = COALESCE(EXCLUDED.event_type, lead_events.event_type),
        source = COALESCE(NULLIF(EXCLUDED.source, ''), lead_events.source),
        medium = COALESCE(NULLIF(EXCLUDED.medium, ''), lead_events.medium),
        campaign = COALESCE(NULLIF(EXCLUDED.campaign, ''), lead_events.campaign),
        term = COALESCE(NULLIF(EXCLUDED.term, ''), lead_events.term),
        content = COALESCE(NULLIF(EXCLUDED.content, ''), lead_events.content),
        cta_source = COALESCE(NULLIF(EXCLUDED.cta_source, ''), lead_events.cta_source),
        cta_location = COALESCE(NULLIF(EXCLUDED.cta_location, ''), lead_events.cta_location),
        landing_page = COALESCE(NULLIF(EXCLUDED.landing_page, ''), lead_events.landing_page),
        city = COALESCE(NULLIF(EXCLUDED.city, ''), lead_events.city),
        city_classification = CASE
          WHEN EXCLUDED.city_classification <> 'unknown' THEN EXCLUDED.city_classification
          ELSE lead_events.city_classification
        END,
        device = COALESCE(NULLIF(EXCLUDED.device, ''), lead_events.device),
        gclid = COALESCE(NULLIF(EXCLUDED.gclid, ''), lead_events.gclid),
        wbraid = COALESCE(NULLIF(EXCLUDED.wbraid, ''), lead_events.wbraid),
        gbraid = COALESCE(NULLIF(EXCLUDED.gbraid, ''), lead_events.gbraid),
        fbclid = COALESCE(NULLIF(EXCLUDED.fbclid, ''), lead_events.fbclid),
        location_permission = COALESCE(NULLIF(EXCLUDED.location_permission, ''), lead_events.location_permission),
        latitude = COALESCE(EXCLUDED.latitude, lead_events.latitude),
        longitude = COALESCE(EXCLUDED.longitude, lead_events.longitude),
        location_accuracy_m = COALESCE(EXCLUDED.location_accuracy_m, lead_events.location_accuracy_m),
        geocode_status = COALESCE(NULLIF(EXCLUDED.geocode_status, ''), lead_events.geocode_status),
        geocode_source = COALESCE(NULLIF(EXCLUDED.geocode_source, ''), lead_events.geocode_source),
        geocode_city = COALESCE(NULLIF(EXCLUDED.geocode_city, ''), lead_events.geocode_city),
        geocode_kecamatan = COALESCE(NULLIF(EXCLUDED.geocode_kecamatan, ''), lead_events.geocode_kecamatan),
        geocode_kelurahan = COALESCE(NULLIF(EXCLUDED.geocode_kelurahan, ''), lead_events.geocode_kelurahan),
        geocode_full_address = COALESCE(NULLIF(EXCLUDED.geocode_full_address, ''), lead_events.geocode_full_address),
        user_agent = COALESCE(NULLIF(EXCLUDED.user_agent, ''), lead_events.user_agent),
        referrer = COALESCE(NULLIF(EXCLUDED.referrer, ''), lead_events.referrer),
        event_timestamp = COALESCE(EXCLUDED.event_timestamp, lead_events.event_timestamp),
        raw_payload = lead_events.raw_payload || EXCLUDED.raw_payload,
        updated_at = now()
    `;

    return { ...baseResult, persisted: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { ...baseResult, persisted: false, errorMessage };
  }
}

export async function queryLeadEvents(filters: LeadExportFilters): Promise<LeadExportRow[]> {
  const sql = getLeadSql();
  if (!sql) {
    throw new Error('DATABASE_URL is not configured');
  }

  const from = filters.from ?? null;
  const to = filters.to ?? null;
  const eventType = filters.eventType ?? null;
  const cityClassification = filters.cityClassification ?? null;
  const source = filters.source ?? null;
  const campaign = filters.campaign ?? null;

  const rows = await sql`
    SELECT
      event_id,
      event_type,
      source,
      medium,
      campaign,
      term,
      content,
      cta_source,
      cta_location,
      landing_page,
      city,
      city_classification,
      device,
      gclid,
      wbraid,
      gbraid,
      fbclid,
      location_permission,
      latitude,
      longitude,
      location_accuracy_m,
      geocode_status,
      geocode_source,
      geocode_city,
      geocode_kecamatan,
      geocode_kelurahan,
      geocode_full_address,
      user_agent,
      referrer,
      event_timestamp::text,
      received_at::text,
      updated_at::text,
      raw_payload
    FROM lead_events
    WHERE (${from}::timestamptz IS NULL OR received_at >= ${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR received_at < ${to}::timestamptz)
      AND (${eventType}::text IS NULL OR event_type = ${eventType})
      AND (${cityClassification}::text IS NULL OR city_classification = ${cityClassification})
      AND (${source}::text IS NULL OR source = ${source})
      AND (${campaign}::text IS NULL OR campaign = ${campaign})
    ORDER BY received_at DESC
    LIMIT ${filters.limit}
    OFFSET ${filters.offset}
  `;

  return rows as LeadExportRow[];
}
