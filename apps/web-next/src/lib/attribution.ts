export interface AttributionTouch {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
  wbraid?: string;
  gbraid?: string;
  landingPath: string;
  timestamp: string;
}

export interface AttributionStore {
  first: AttributionTouch;
  last: AttributionTouch;
}

const ATTR_STORAGE_KEY = "sl_attribution_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeReadAttribution(): AttributionStore | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(ATTR_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AttributionStore;
  } catch {
    return null;
  }
}

function safeWriteAttribution(data: AttributionStore): void {
  if (!isBrowser()) return;
  localStorage.setItem(ATTR_STORAGE_KEY, JSON.stringify(data));
}

function hasCampaignParams(params: URLSearchParams): boolean {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "wbraid",
    "gbraid",
  ];
  return keys.some((key) => params.has(key));
}

function getReferrerHost(referrer: string): string {
  if (!referrer) return "(direct)";

  try {
    return new URL(referrer).hostname || "(direct)";
  } catch {
    return "(direct)";
  }
}

function normalizeSource(raw: string): string {
  const value = raw.trim();
  return value ? value.toLowerCase() : "(direct)";
}

function normalizeMedium(raw: string, hasReferrer: boolean): string {
  const value = raw.trim();
  if (value) return value.toLowerCase();
  return hasReferrer ? "referral" : "(none)";
}

function buildTouch(searchParams: URLSearchParams, referrer: string): AttributionTouch {
  const hasReferrer = Boolean(referrer);
  const source = normalizeSource(searchParams.get("utm_source") ?? getReferrerHost(referrer));
  const medium = normalizeMedium(searchParams.get("utm_medium") ?? "", hasReferrer);
  const landingPath = `${window.location.pathname}${window.location.search}`;

  return {
    source,
    medium,
    campaign: searchParams.get("utm_campaign") ?? undefined,
    term: searchParams.get("utm_term") ?? undefined,
    content: searchParams.get("utm_content") ?? undefined,
    gclid: searchParams.get("gclid") ?? undefined,
    fbclid: searchParams.get("fbclid") ?? undefined,
    wbraid: searchParams.get("wbraid") ?? undefined,
    gbraid: searchParams.get("gbraid") ?? undefined,
    landingPath,
    timestamp: new Date().toISOString(),
  };
}

export function captureAttributionOnPageLoad(): AttributionStore | null {
  if (!isBrowser()) return null;

  const existing = safeReadAttribution();
  const params = new URLSearchParams(window.location.search);
  const touch = buildTouch(params, document.referrer || "");
  const shouldUpdateLast = hasCampaignParams(params) || Boolean(document.referrer) || !existing;

  if (!shouldUpdateLast && existing) {
    return existing;
  }

  const updated: AttributionStore = {
    first: existing?.first ?? touch,
    last: touch,
  };

  safeWriteAttribution(updated);
  return updated;
}

export function getAttributionStore(): AttributionStore | null {
  return safeReadAttribution();
}

export function getAttributionEventParams(): Record<string, string> {
  const store = safeReadAttribution();
  const touch = store?.last;
  if (!touch) return {};

  const params: Record<string, string> = {
    source: touch.source,
    medium: touch.medium,
  };

  if (touch.campaign) params.campaign = touch.campaign;
  if (touch.term) params.term = touch.term;
  if (touch.content) params.content = touch.content;
  if (touch.gclid) params.gclid = touch.gclid;
  if (touch.fbclid) params.fbclid = touch.fbclid;
  if (touch.wbraid) params.wbraid = touch.wbraid;
  if (touch.gbraid) params.gbraid = touch.gbraid;

  return params;
}

export function buildAttributionHeaders(): Record<string, string> {
  const store = safeReadAttribution();
  const touch = store?.last;
  if (!touch) return {};

  const headers: Record<string, string> = {
    "x-attribution-source": touch.source,
    "x-attribution-medium": touch.medium,
  };

  if (touch.campaign) headers["x-attribution-campaign"] = touch.campaign;
  if (touch.gclid) headers["x-attribution-gclid"] = touch.gclid;
  if (touch.fbclid) headers["x-attribution-fbclid"] = touch.fbclid;
  if (touch.wbraid) headers["x-attribution-wbraid"] = touch.wbraid;
  if (touch.gbraid) headers["x-attribution-gbraid"] = touch.gbraid;

  return headers;
}

export function formatAttributionForNotes(): string {
  const store = safeReadAttribution();
  const touch = store?.last;
  if (!touch) return "";

  const pairs = [
    `source=${touch.source}`,
    `medium=${touch.medium}`,
    touch.campaign ? `campaign=${touch.campaign}` : "",
    touch.gclid ? `gclid=${touch.gclid}` : "",
    touch.fbclid ? `fbclid=${touch.fbclid}` : "",
    touch.wbraid ? `wbraid=${touch.wbraid}` : "",
    touch.gbraid ? `gbraid=${touch.gbraid}` : "",
  ].filter(Boolean);

  return pairs.length > 0 ? `[attribution ${pairs.join(" ")}]` : "";
}
