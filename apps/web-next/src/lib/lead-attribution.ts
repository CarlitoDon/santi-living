import { z } from 'zod';

export const SERVICE_AREA_CITIES = [
  'sleman',
  'kota yogyakarta',
  'yogyakarta',
  'bantul',
  'kulon progo',
] as const;

export const OUT_OF_SERVICE_CITIES = [
  'klaten',
  'gunung kidul',
  'gunungkidul',
  'semanu',
] as const;

const LeadTextSchema = z.string().trim().max(500).optional();
const LocationPermissionSchema = z.enum([
  'granted',
  'denied',
  'timeout',
  'unavailable',
  'unsupported',
  'error',
]).optional();

export const LeadEventSchema = z.object({
  event_id: z.string().trim().min(8).max(80).optional(),
  event_type: z.enum([
    'whatsapp_click',
    'phone_click',
    'form_submit',
    'gbp_call',
    'gbp_website_click',
    'manual_lead',
  ]),
  source: LeadTextSchema,
  medium: LeadTextSchema,
  campaign: LeadTextSchema,
  term: LeadTextSchema,
  content: LeadTextSchema,
  cta_source: LeadTextSchema,
  cta_location: LeadTextSchema,
  landing_page: z.string().trim().max(1200).optional(),
  city: LeadTextSchema,
  device: LeadTextSchema,
  gclid: LeadTextSchema,
  wbraid: LeadTextSchema,
  gbraid: LeadTextSchema,
  fbclid: LeadTextSchema,
  location_permission: LocationPermissionSchema,
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  location_accuracy_m: z.coerce.number().nonnegative().max(100000).optional(),
  user_agent: z.string().trim().max(800).optional(),
  referrer: z.string().trim().max(1200).optional(),
  timestamp: z.string().datetime().optional(),
});

export type LeadEventInput = z.infer<typeof LeadEventSchema>;

export function normalizeLeadText(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 500) : undefined;
}

export function isOutOfServiceCity(city: string | null | undefined): boolean {
  const normalized = city?.toLowerCase().trim() ?? '';
  return OUT_OF_SERVICE_CITIES.some((item) => normalized.includes(item));
}

export function isServiceAreaCity(city: string | null | undefined): boolean {
  const normalized = city?.toLowerCase().trim() ?? '';
  return SERVICE_AREA_CITIES.some((item) => normalized.includes(item));
}

export function classifyLeadCity(city: string | null | undefined): 'service_area' | 'out_of_service' | 'unknown' {
  if (isOutOfServiceCity(city)) return 'out_of_service';
  if (isServiceAreaCity(city)) return 'service_area';
  return 'unknown';
}

export function buildLeadLogRecord(
  eventId: string,
  input: LeadEventInput,
  receivedAt: string
) {
  const city = input.city;

  return {
    schema: 'santi_lead_event_v1',
    event_id: eventId,
    event_type: input.event_type,
    source: input.source ?? '(unknown)',
    medium: input.medium ?? '(unknown)',
    campaign: input.campaign ?? '',
    term: input.term ?? '',
    content: input.content ?? '',
    cta_source: input.cta_source ?? 'unknown',
    cta_location: input.cta_location ?? '',
    landing_page: input.landing_page ?? '',
    city: city ?? '',
    city_classification: classifyLeadCity(city),
    device: input.device ?? '',
    gclid: input.gclid ? '[present]' : '',
    wbraid: input.wbraid ? '[present]' : '',
    gbraid: input.gbraid ? '[present]' : '',
    fbclid: input.fbclid ? '[present]' : '',
    location_permission: input.location_permission ?? '',
    latitude: typeof input.latitude === 'number' ? Number(input.latitude.toFixed(7)) : '',
    longitude: typeof input.longitude === 'number' ? Number(input.longitude.toFixed(7)) : '',
    location_accuracy_m: typeof input.location_accuracy_m === 'number' ? Math.round(input.location_accuracy_m) : '',
    user_agent: input.user_agent ?? '',
    referrer: input.referrer ?? '',
    event_timestamp: input.timestamp ?? receivedAt,
    received_at: receivedAt,
  };
}
