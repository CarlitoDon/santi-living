/**
 * TRPC Client for proxy
 *
 * Type-safe API client to communicate with proxy.
 */
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../apps/proxy/src/trpc";

// Get service URL from environment
const getServiceUrl = () => {
  let url = "http://localhost:3002";

  // Server-side: use import.meta.env
  if (typeof window === "undefined") {
    url =
      (import.meta as unknown as { env: Record<string, string> }).env
        .SANTI_PROXY_URL || "http://localhost:3002";
  }

  // Remove trailing slash if present
  return url.replace(/\/$/, "");
};

// Get API key from environment
const getApiKey = () => {
  if (typeof window === "undefined") {
    return (
      (import.meta as unknown as { env: Record<string, string> }).env
        .PROXY_API_SECRET || "santi_secret_auth_token_2026"
    );
  }
  return "";
};

/**
 * Create a TRPC client instance
 * Note: This should be called on the server-side (API routes) only
 */
export function createProxyClient() {
  const serviceUrl = getServiceUrl();
  const apiKey = getApiKey();

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${serviceUrl}/api/trpc`,
        transformer: superjson,
        headers: () => ({
          Authorization: `Bearer ${apiKey}`,
        }),
      }),
    ],
  });
}

// Export a singleton client for convenience
export const proxyClient = createProxyClient();
