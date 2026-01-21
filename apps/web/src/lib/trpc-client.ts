/**
 * TRPC Client for proxy
 *
 * Type-safe API client to communicate with proxy.
 * Runtime env reading for Vercel SSR compatibility.
 */
import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@santi-living/proxy";

// Get service URL from environment at RUNTIME (not build time)
const getServiceUrl = () => {
  // On server-side (Vercel Functions), read from process.env
  if (typeof window === "undefined") {
    return (
      process.env.SANTI_PROXY_URL ||
      process.env.PUBLIC_PROXY_URL ||
      "http://localhost:3002"
    );
  }
  return "http://localhost:3002";
};

// Get API key from environment at RUNTIME
const getApiKey = () => {
  if (typeof window === "undefined") {
    const apiKey =
      process.env.PROXY_API_SECRET || process.env.PROXY_API_KEY || "";

    if (!apiKey && process.env.NODE_ENV === "production") {
      throw new Error(
        "[trpc-client] PROXY_API_SECRET environment variable is required in production",
      );
    }

    return apiKey;
  }
  return "";
};

/**
 * Create a TRPC client instance
 * Note: This should be called on the server-side (API routes/SSR) only
 */
export function createProxyClient(): TRPCClient<AppRouter> {
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

// Create client lazily (at runtime, not module load time)
let _proxyClient: TRPCClient<AppRouter> | null = null;

export const getProxyClient = (): TRPCClient<AppRouter> => {
  if (!_proxyClient) {
    _proxyClient = createProxyClient();
  }
  return _proxyClient;
};

// Backward compatibility export
export const proxyClient: TRPCClient<AppRouter> = createProxyClient();
