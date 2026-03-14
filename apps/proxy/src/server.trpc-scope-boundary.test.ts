import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "./trpc";
import { createServer } from "./server";

describe("proxy trpc scope boundary", () => {
  const originalEnv = {
    PROXY_API_SECRET: process.env.PROXY_API_SECRET,
    SANTI_LIVING_COMPANY_ID: process.env.SANTI_LIVING_COMPANY_ID,
  };

  beforeEach(() => {
    process.env.PROXY_API_SECRET = "proxy-test-secret";
    process.env.SANTI_LIVING_COMPANY_ID = "santi-company-test";
  });

  afterEach(() => {
    process.env.PROXY_API_SECRET = originalEnv.PROXY_API_SECRET;
    process.env.SANTI_LIVING_COMPANY_ID = originalEnv.SANTI_LIVING_COMPANY_ID;
  });

  it("rejects protected procedure when x-company-id does not match configured company", async () => {
    const app = createServer();
    const server = app.listen(0);

    try {
      const { port } = server.address() as AddressInfo;
      const client = createTRPCClient<AppRouter>({
        links: [
          httpBatchLink({
            url: `http://127.0.0.1:${port}/api/trpc`,
            transformer: superjson,
            headers: () => ({
              Authorization: "Bearer proxy-test-secret",
              "X-Company-Id": "other-company",
            }),
          }),
        ],
      });

      await expect(
        client.order.createPaymentToken.mutate({
          token: "f8c78332-c715-43d4-bf6e-5ef4f8f00b5d",
          paymentMethod: "qris",
        }),
      ).rejects.toThrow("Company scope mismatch");
    } finally {
      server.close();
    }
  });
});
