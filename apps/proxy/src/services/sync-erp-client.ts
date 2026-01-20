/**
 * Type-Safe Sync-ERP Client
 *
 * TRPC client for type-safe communication with sync-erp publicRental API.
 * Uses local types copied from sync-erp for Railway deployment compatibility.
 */
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { PublicRentalRouter } from "../types/public-rental";

const getBaseUrl = () => {
  return process.env.SYNC_ERP_API_URL || "http://localhost:3001/api/trpc";
};

/**
 * Create a type-safe TRPC client for sync-erp publicRental API
 */
export function createSyncErpClient() {
  const baseUrl = getBaseUrl();

  return createTRPCClient<PublicRentalRouter>({
    links: [
      httpBatchLink({
        url: baseUrl,
        transformer: superjson,
      }),
    ],
  });
}

// Export singleton client
export const syncErpClient = createSyncErpClient();
