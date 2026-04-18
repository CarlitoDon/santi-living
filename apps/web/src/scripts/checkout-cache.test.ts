/**
 * @vitest-environment jsdom
 *
 * Tests for the Snap token cache logic extracted from checkout.ts.
 * These functions manage sessionStorage cache for Midtrans Snap tokens
 * to prevent duplicate QRIS code generation.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// ============================================================
// Reimplemented cache functions for isolated testing
// (They're private in checkout.ts, so we test the logic directly)
// ============================================================

const SNAP_TOKEN_CACHE_KEY = "snapTokenCache";
const SNAP_TOKEN_MAX_AGE_MINUTES = 14;

type PaymentMethod = "bca" | "gopay" | "qris";

interface SnapTokenCache {
  token: string;
  paymentMethod: PaymentMethod;
  createdAt: number;
}

function getSnapTokenCache(
  publicToken: string,
  paymentMethod: PaymentMethod,
): string | null {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const data: SnapTokenCache = JSON.parse(cached);
    if (data.paymentMethod !== paymentMethod) return null;
    const ageMinutes = (Date.now() - data.createdAt) / 1000 / 60;
    if (ageMinutes >= SNAP_TOKEN_MAX_AGE_MINUTES) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return data.token;
  } catch {
    return null;
  }
}

function setSnapTokenCache(
  publicToken: string,
  paymentMethod: PaymentMethod,
  token: string,
): void {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  const data: SnapTokenCache = {
    token,
    paymentMethod,
    createdAt: Date.now(),
  };
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
}

function clearSnapTokenCache(publicToken: string): void {
  const cacheKey = `${SNAP_TOKEN_CACHE_KEY}_${publicToken}`;
  sessionStorage.removeItem(cacheKey);
}

// ============================================================
// Tests
// ============================================================

const MOCK_TOKEN = "abc-123-def";
const MOCK_SNAP_TOKEN = "snap_token_xyz_456";

describe("Snap Token Cache", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });

  describe("getSnapTokenCache", () => {
    it("returns null when no cache exists", () => {
      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
    });

    it("returns cached token for matching payment method", () => {
      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);
      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBe(MOCK_SNAP_TOKEN);
    });

    it("returns null for different payment method", () => {
      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);
      expect(getSnapTokenCache(MOCK_TOKEN, "gopay")).toBeNull();
    });

    it("returns null for different public token", () => {
      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);
      expect(getSnapTokenCache("other-token", "qris")).toBeNull();
    });

    it("returns null and clears cache when expired (>14 min)", () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);

      // Advance 15 minutes
      vi.setSystemTime(now + 15 * 60 * 1000);

      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
      // Cache should be removed from storage
      expect(
        sessionStorage.getItem(`${SNAP_TOKEN_CACHE_KEY}_${MOCK_TOKEN}`),
      ).toBeNull();
    });

    it("returns token when not yet expired (<14 min)", () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);

      // Advance 10 minutes (still valid)
      vi.setSystemTime(now + 10 * 60 * 1000);

      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBe(MOCK_SNAP_TOKEN);
    });

    it("handles corrupted storage data gracefully", () => {
      sessionStorage.setItem(
        `${SNAP_TOKEN_CACHE_KEY}_${MOCK_TOKEN}`,
        "not-json",
      );
      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
    });
  });

  describe("setSnapTokenCache", () => {
    it("stores token with correct structure", () => {
      setSnapTokenCache(MOCK_TOKEN, "gopay", MOCK_SNAP_TOKEN);

      const stored = JSON.parse(
        sessionStorage.getItem(
          `${SNAP_TOKEN_CACHE_KEY}_${MOCK_TOKEN}`,
        )!,
      ) as SnapTokenCache;

      expect(stored.token).toBe(MOCK_SNAP_TOKEN);
      expect(stored.paymentMethod).toBe("gopay");
      expect(stored.createdAt).toBeGreaterThan(0);
    });

    it("overwrites existing cache", () => {
      setSnapTokenCache(MOCK_TOKEN, "qris", "old_token");
      setSnapTokenCache(MOCK_TOKEN, "gopay", "new_token");

      expect(getSnapTokenCache(MOCK_TOKEN, "gopay")).toBe("new_token");
      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
    });
  });

  describe("clearSnapTokenCache", () => {
    it("removes cache from storage", () => {
      setSnapTokenCache(MOCK_TOKEN, "qris", MOCK_SNAP_TOKEN);
      clearSnapTokenCache(MOCK_TOKEN);

      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
    });

    it("does nothing if no cache exists", () => {
      clearSnapTokenCache(MOCK_TOKEN); // should not throw
      expect(getSnapTokenCache(MOCK_TOKEN, "qris")).toBeNull();
    });
  });
});
