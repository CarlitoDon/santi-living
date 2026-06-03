ALTER TABLE lead_events
  ADD COLUMN IF NOT EXISTS product_category TEXT,
  ADD COLUMN IF NOT EXISTS page_type TEXT,
  ADD COLUMN IF NOT EXISTS intent TEXT;

CREATE INDEX IF NOT EXISTS lead_events_product_category_idx
  ON lead_events (product_category);
