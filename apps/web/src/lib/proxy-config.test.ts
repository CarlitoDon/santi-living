import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  getProxyApiSecret,
  getProxyBaseUrl,
  getProxyTrpcUrl,
} from "./proxy-config";

describe("proxy-config", () => {
  const originalEnv = {
    SANTI_PROXY_URL: process.env.SANTI_PROXY_URL,
    PUBLIC_PROXY_URL: process.env.PUBLIC_PROXY_URL,
    PROXY_API_SECRET: process.env.PROXY_API_SECRET,
    PROXY_API_KEY: process.env.PROXY_API_KEY,
  };

  beforeEach(() => {
    process.env.SANTI_PROXY_URL = "https://proxy.example.com/";
    process.env.PUBLIC_PROXY_URL = "";
    process.env.PROXY_API_SECRET = "secret-value";
    process.env.PROXY_API_KEY = "";
  });

  afterAll(() => {
    process.env.SANTI_PROXY_URL = originalEnv.SANTI_PROXY_URL;
    process.env.PUBLIC_PROXY_URL = originalEnv.PUBLIC_PROXY_URL;
    process.env.PROXY_API_SECRET = originalEnv.PROXY_API_SECRET;
    process.env.PROXY_API_KEY = originalEnv.PROXY_API_KEY;
  });

  it("normalizes proxy base URL", () => {
    expect(getProxyBaseUrl()).toBe("https://proxy.example.com");
  });

  it("builds trpc URL from normalized base URL", () => {
    expect(getProxyTrpcUrl()).toBe("https://proxy.example.com/api/trpc");
  });

  it("reads proxy API secret from environment", () => {
    expect(getProxyApiSecret()).toBe("secret-value");
  });
});
