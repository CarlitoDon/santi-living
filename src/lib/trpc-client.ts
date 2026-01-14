/**
 * TRPC Client for erp-sync-service
 *
 * Type-safe API client to communicate with erp-sync-service.
 */
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../apps/erp-sync-service/src/trpc";

// Get service URL from environment
const getServiceUrl = () => {
  // Server-side: use import.meta.env
  if (typeof window === "undefined") {
    return (
      (import.meta as unknown as { env: Record<string, string> }).env
        .ERP_SYNC_SERVICE_URL || "http://localhost:3002"
    );
  }
  // Client-side: use public env
  return "http://localhost:3002";
};

// Get API key from environment
const getApiKey = () => {
  if (typeof window === "undefined") {
    return (
      (import.meta as unknown as { env: Record<string, string> }).env
        .ERP_SYNC_API_KEY || ""
    );
  }
  return "";
};

/**
 * Create a TRPC client instance
 * Note: This should be called on the server-side (API routes) only
 */
export function createErpSyncClient() {
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
export const erpSyncClient = createErpSyncClient();
