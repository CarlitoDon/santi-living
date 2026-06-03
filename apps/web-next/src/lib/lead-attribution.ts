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

const LeadTextSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 500) : undefined;
}, z.string().max(500).optional());
const LongLeadTextSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 1200) : undefined;
}, z.string().max(1200).optional());
const EventIdSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed || undefined;
}, z.string().min(8).max(80).optional());
const OptionalNumberSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().optional());
const OptionalDateTimeSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed || undefined;
}, z.string().datetime().optional());

const LocationPermissionSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed || undefined;
}, z.enum([
  'granted',
  'denied',
  'timeout',
  'unavailable',
  'unsupported',
  'error',
]).optional());

const GeocodeStatusSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed || undefined;
}, z.enum([
  'not_requested',
  'success',
  'failed',
  'timeout',
  'unavailable',
]).optional());

export const LeadEventSchema = z.object({
  event_id: EventIdSchema,
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
  product_category: LeadTextSchema,
  page_type: LeadTextSchema,
  intent: LeadTextSchema,
  landing_page: LongLeadTextSchema,
  city: LeadTextSchema,
  device: LeadTextSchema,
  gclid: LeadTextSchema,
  wbraid: LeadTextSchema,
  gbraid: LeadTextSchema,
  fbclid: LeadTextSchema,
  location_permission: LocationPermissionSchema,
  latitude: OptionalNumberSchema.pipe(z.number().min(-90).max(90).optional()),
  longitude: OptionalNumberSchema.pipe(z.number().min(-180).max(180).optional()),
  location_accuracy_m: OptionalNumberSchema.pipe(z.number().nonnegative().max(100000).optional()),
  geocode_status: GeocodeStatusSchema,
  geocode_source: LeadTextSchema,
  geocode_city: LeadTextSchema,
  geocode_kecamatan: LeadTextSchema,
  geocode_kelurahan: LeadTextSchema,
  geocode_full_address: LongLeadTextSchema,
  user_agent: LongLeadTextSchema,
  referrer: LongLeadTextSchema,
  timestamp: OptionalDateTimeSchema,
});

export type LeadEventInput = z.infer<typeof LeadEventSchema>;
export type LeadCityClassification = 'service_area' | 'out_of_service' | 'unknown';

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

export function classifyLeadCity(city: string | null | undefined): LeadCityClassification {
  if (isOutOfServiceCity(city)) return 'out_of_service';
  if (isServiceAreaCity(city)) return 'service_area';
  return 'unknown';
}

export function resolveLeadCity(input: Pick<LeadEventInput, 'city' | 'geocode_city'>): string | undefined {
  return input.city ?? input.geocode_city;
}

export function buildLeadLogRecord(
  eventId: string,
  input: LeadEventInput,
  receivedAt: string
) {
  const city = resolveLeadCity(input);

  return {
    schema: 'santi_lead_event_v2',
    event_id: eventId,
    event_type: input.event_type,
    source: input.source ?? '(unknown)',
    medium: input.medium ?? '(unknown)',
    campaign: input.campaign ?? '',
    term: input.term ?? '',
    content: input.content ?? '',
    cta_source: input.cta_source ?? 'unknown',
    cta_location: input.cta_location ?? '',
    product_category: input.product_category ?? '',
    page_type: input.page_type ?? '',
    intent: input.intent ?? '',
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
    geocode_status: input.geocode_status ?? '',
    geocode_source: input.geocode_source ?? '',
    geocode_city: input.geocode_city ?? '',
    geocode_kecamatan: input.geocode_kecamatan ?? '',
    geocode_kelurahan: input.geocode_kelurahan ?? '',
    geocode_full_address: input.geocode_full_address ?? '',
    user_agent: input.user_agent ?? '',
    referrer: input.referrer ?? '',
    event_timestamp: input.timestamp ?? receivedAt,
    received_at: receivedAt,
  };
}
