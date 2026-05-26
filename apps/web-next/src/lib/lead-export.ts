import type { LeadExportRow } from './lead-db';

export const LEAD_EXPORT_COLUMNS = [
  'event_id',
  'event_type',
  'source',
  'medium',
  'campaign',
  'term',
  'content',
  'cta_source',
  'cta_location',
  'landing_page',
  'city',
  'city_classification',
  'device',
  'gclid',
  'wbraid',
  'gbraid',
  'fbclid',
  'location_permission',
  'latitude',
  'longitude',
  'location_accuracy_m',
  'geocode_status',
  'geocode_source',
  'geocode_city',
  'geocode_kecamatan',
  'geocode_kelurahan',
  'geocode_full_address',
  'user_agent',
  'referrer',
  'event_timestamp',
  'received_at',
  'updated_at',
] as const;

function csvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function leadRowsToCsv(rows: LeadExportRow[]): string {
  const header = LEAD_EXPORT_COLUMNS.join(',');
  const body = rows.map((row) => (
    LEAD_EXPORT_COLUMNS.map((column) => csvValue(row[column])).join(',')
  ));

  return [header, ...body].join('\n');
}
