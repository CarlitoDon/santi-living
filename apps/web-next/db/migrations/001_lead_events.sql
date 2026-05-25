CREATE TABLE IF NOT EXISTS lead_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  cta_source TEXT,
  cta_location TEXT,
  landing_page TEXT,
  city TEXT,
  city_classification TEXT NOT NULL DEFAULT 'unknown',
  device TEXT,
  gclid TEXT,
  wbraid TEXT,
  gbraid TEXT,
  fbclid TEXT,
  location_permission TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_accuracy_m INTEGER,
  geocode_status TEXT,
  geocode_source TEXT,
  geocode_city TEXT,
  geocode_kecamatan TEXT,
  geocode_kelurahan TEXT,
  geocode_full_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  event_timestamp TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS lead_events_received_at_idx
  ON lead_events (received_at DESC);

CREATE INDEX IF NOT EXISTS lead_events_city_classification_idx
  ON lead_events (city_classification);

CREATE INDEX IF NOT EXISTS lead_events_event_type_idx
  ON lead_events (event_type);

CREATE INDEX IF NOT EXISTS lead_events_source_campaign_idx
  ON lead_events (source, campaign);
