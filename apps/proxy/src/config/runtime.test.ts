import { afterEach, describe, expect, it } from "vitest";
import {
  getSyncErpApiPublicRentalUrl,
  getSyncErpBotTrpcUrl,
  parseBearerToken,
} from "./runtime";

describe("runtime helpers", () => {
  const originalEnv = {
    SYNC_ERP_API_URL: process.env.SYNC_ERP_API_URL,
    SYNC_ERP_BOT_URL: process.env.SYNC_ERP_BOT_URL,
  };

  afterEach(() => {
    process.env.SYNC_ERP_API_URL = originalEnv.SYNC_ERP_API_URL;
    process.env.SYNC_ERP_BOT_URL = originalEnv.SYNC_ERP_BOT_URL;
  });

  it("normalizes SYNC_ERP_API_URL to publicRental endpoint", () => {
    process.env.SYNC_ERP_API_URL = "https://api.example.com/api/trpc/";
    expect(getSyncErpApiPublicRentalUrl()).toBe(
      "https://api.example.com/api/trpc/publicRental",
    );
  });

  it("keeps explicit publicRental endpoint untouched", () => {
    process.env.SYNC_ERP_API_URL =
      "https://api.example.com/api/trpc/publicRental";
    expect(getSyncErpApiPublicRentalUrl()).toBe(
      "https://api.example.com/api/trpc/publicRental",
    );
  });

  it("normalizes bot endpoint to /api/trpc", () => {
    process.env.SYNC_ERP_BOT_URL = "https://bot.example.com/";
    expect(getSyncErpBotTrpcUrl()).toBe("https://bot.example.com/api/trpc");
  });

  it("parses bearer token safely", () => {
    expect(parseBearerToken("Bearer abc123")).toBe("abc123");
    expect(parseBearerToken("Bearer   ")).toBeNull();
    expect(parseBearerToken("abc123")).toBeNull();
    expect(parseBearerToken(undefined)).toBeNull();
  });
});
