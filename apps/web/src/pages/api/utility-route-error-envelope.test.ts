import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as proxyQrImageGet } from "./proxy-qr-image";
import { GET as reverseGeocodeGet } from "./reverse-geocode";

const originalFetch = global.fetch;

describe("utility route error envelopes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns BAD_REQUEST for reverse-geocode without coordinates", async () => {
    const response = await reverseGeocodeGet({
      url: new URL("http://localhost/api/reverse-geocode"),
    } as Parameters<typeof reverseGeocodeGet>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "lat and lng are required" },
    });
  });

  it("returns UPSTREAM_ERROR for reverse-geocode fetch failure", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("network"));

    const response = await reverseGeocodeGet({
      url: new URL("http://localhost/api/reverse-geocode?lat=-7.79&lng=110.36"),
    } as Parameters<typeof reverseGeocodeGet>[0]);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "UPSTREAM_ERROR", message: "Failed to reverse geocode" },
    });
  });

  it("returns BAD_REQUEST for proxy-qr-image without URL", async () => {
    const response = await proxyQrImageGet({
      url: new URL("http://localhost/api/proxy-qr-image"),
    } as Parameters<typeof proxyQrImageGet>[0]);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "BAD_REQUEST", message: "URL parameter is required" },
    });
  });

  it("returns FORBIDDEN for proxy-qr-image non-midtrans URL", async () => {
    const response = await proxyQrImageGet({
      url: new URL("http://localhost/api/proxy-qr-image?url=https://example.com/qr.png"),
    } as Parameters<typeof proxyQrImageGet>[0]);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { code: "FORBIDDEN", message: "Invalid URL" },
    });
  });
});
