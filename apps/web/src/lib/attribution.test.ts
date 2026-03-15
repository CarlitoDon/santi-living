/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  captureAttributionOnPageLoad,
  getAttributionStore,
  getAttributionEventParams,
  buildAttributionHeaders,
  formatAttributionForNotes,
} from "./attribution";

const ATTR_STORAGE_KEY = "sl_attribution_v1";

function setUrl(url: string): void {
  window.history.replaceState({}, "", url);
}

function setReferrer(referrer: string): void {
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value: referrer,
  });
}

describe("attribution", () => {
  beforeEach(() => {
    localStorage.removeItem(ATTR_STORAGE_KEY);
    setUrl("/");
    setReferrer("");
  });

  it("captures utm and click identifiers on landing", () => {
    setUrl(
      "/?utm_source=google&utm_medium=cpc&utm_campaign=rent-q1&gclid=test-gclid"
    );

    const store = captureAttributionOnPageLoad();
    expect(store).not.toBeNull();
    expect(store?.last.source).toBe("google");
    expect(store?.last.medium).toBe("cpc");
    expect(store?.last.campaign).toBe("rent-q1");
    expect(store?.last.gclid).toBe("test-gclid");
  });

  it("falls back to referral source when no utm exists", () => {
    setReferrer("https://instagram.com/");
    setUrl("/produk");

    captureAttributionOnPageLoad();
    const store = getAttributionStore();

    expect(store?.last.source).toBe("instagram.com");
    expect(store?.last.medium).toBe("referral");
  });

  it("preserves first touch and updates last touch on subsequent campaign", () => {
    setUrl("/?utm_source=google&utm_medium=cpc");
    captureAttributionOnPageLoad();

    setUrl("/?utm_source=facebook&utm_medium=paid_social");
    captureAttributionOnPageLoad();

    const store = getAttributionStore();
    expect(store?.first.source).toBe("google");
    expect(store?.last.source).toBe("facebook");
    expect(store?.last.medium).toBe("paid_social");
  });

  it("builds event params and attribution headers", () => {
    setUrl(
      "/?utm_source=google&utm_medium=cpc&utm_campaign=rent-q1&gclid=abc123"
    );
    captureAttributionOnPageLoad();

    const eventParams = getAttributionEventParams();
    expect(eventParams.source).toBe("google");
    expect(eventParams.medium).toBe("cpc");
    expect(eventParams.campaign).toBe("rent-q1");
    expect(eventParams.gclid).toBe("abc123");

    const headers = buildAttributionHeaders();
    expect(headers["x-attribution-source"]).toBe("google");
    expect(headers["x-attribution-medium"]).toBe("cpc");
    expect(headers["x-attribution-campaign"]).toBe("rent-q1");
    expect(headers["x-attribution-gclid"]).toBe("abc123");
  });

  it("formats attribution notes for order payload", () => {
    setUrl("/?utm_source=google&utm_medium=cpc");
    captureAttributionOnPageLoad();

    const note = formatAttributionForNotes();
    expect(note).toContain("[attribution");
    expect(note).toContain("source=google");
    expect(note).toContain("medium=cpc");
  });
});
