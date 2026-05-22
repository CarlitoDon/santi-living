import { afterEach, describe, expect, it } from "vitest";
import {
  getSyncErpApiBaseUrl,
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

  it("normalizes SYNC_ERP_API_URL to REST API v1 endpoint", () => {
    process.env.SYNC_ERP_API_URL = "https://api.example.com/api/trpc/";
    expect(getSyncErpApiBaseUrl()).toBe("https://api.example.com/api/v1");
  });

  it("migrates explicit legacy publicRental endpoint to REST API v1", () => {
    process.env.SYNC_ERP_API_URL =
      "https://api.example.com/api/trpc/publicRental";
    expect(getSyncErpApiBaseUrl()).toBe("https://api.example.com/api/v1");
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
