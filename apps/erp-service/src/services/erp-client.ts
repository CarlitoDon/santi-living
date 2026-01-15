/**
 * ERP Client
 *
 * TRPC Client to communicate with sync-erp publicRental API.
 * Uses a local contract type to ensure internal type safety without strict cross-repo dependency.
 */

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type {
  SyncErpRouter,
  CreateOrderInput,
  OrderResponse,
  OrderByTokenResponse,
  CreatePartnerInput,
  PartnerResponse,
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  OrderStatusType,
  RentalPaymentStatus,
} from "../types/sync-erp";
import dotenv from "dotenv";

dotenv.config();

const getBaseUrl = () => {
  let url = process.env.SYNC_ERP_API_URL || "http://localhost:3001/api/trpc";
  if (url.endsWith("/trpc") && !url.endsWith("/api/trpc")) {
    url = url.replace(/\/trpc$/, "/api/trpc");
  }
  return url;
};

const getApiKey = () => {
  // Use BOT_SECRET for communicating with sync-erp API (now validates via botProcedure)
  const key = process.env.BOT_SECRET || process.env.SYNC_ERP_API_KEY || "";
  // eslint-disable-next-line no-console
  console.log(
    `[ERP Client] API Key loaded: ${key ? "***" + key.slice(-4) : "EMPTY"}`
  );
  return key;
};

// Initialize TRPC Client
// We cast to any for the creation to bypass strict Router constraints because we don't have the real server types
// Then we cast to unknown first, then to our strict local shape.
export const syncClient = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
      headers() {
        return {
          Authorization: `Bearer ${getApiKey()}`,
        };
      },
      transformer: superjson,
    }),
  ],
}) as unknown as {
  publicRental: {
    getByToken: {
      query: (input: { token: string }) => Promise<OrderByTokenResponse>;
    };
    createOrder: {
      mutate: (input: CreateOrderInput) => Promise<OrderResponse>;
    };
    findOrCreatePartner: {
      mutate: (input: CreatePartnerInput) => Promise<PartnerResponse>;
    };
    confirmPayment: {
      mutate: (input: ConfirmPaymentInput) => Promise<ConfirmPaymentResponse>;
    };
    confirmPaymentByOrderNumber: {
      mutate: (input: {
        orderNumber: string;
        paymentMethod: string;
        transactionId?: string;
        amount?: number;
      }) => Promise<{
        success: boolean;
        orderNumber: string;
        status: string;
      }>;
    };
    deleteOrder: {
      mutate: (input: { id: string }) => Promise<{ success: boolean }>;
    };
  };
};

// Re-export constants for runtime usage if needed by other files
export const RentalPaymentStatusConst = {
  PENDING: "PENDING",
  AWAITING_CONFIRM: "AWAITING_CONFIRM",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
} as const;

export const OrderStatusConst = {
  DRAFT: "DRAFT",
  CONFIRMED: "CONFIRMED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

// Wrapper functions (implementing using the Proxy Client)
export async function createRentalOrder(
  input: CreateOrderInput
): Promise<OrderResponse> {
  return syncClient.publicRental.createOrder.mutate(input);
}

export async function getOrderByToken(
  token: string
): Promise<OrderByTokenResponse> {
  return syncClient.publicRental.getByToken.query({ token });
}

export async function findOrCreatePartner(
  input: CreatePartnerInput
): Promise<PartnerResponse> {
  return syncClient.publicRental.findOrCreatePartner.mutate(input);
}

export async function confirmPayment(
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentResponse> {
  return syncClient.publicRental.confirmPayment.mutate(input);
}

export async function confirmPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod: string;
  transactionId?: string;
  amount?: number;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return syncClient.publicRental.confirmPaymentByOrderNumber.mutate(input);
}

export async function deleteRentalOrder(
  id: string
): Promise<{ success: boolean }> {
  console.log(`[ERP Client] Requesting delete for order ID: ${id}`);
  try {
    const result = await syncClient.publicRental.deleteOrder.mutate({ id });
    console.log(`[ERP Client] Delete successful for order ID: ${id}`);
    return result;
  } catch (error) {
    console.error(`[ERP Client] Delete FAILED for order ID: ${id}`, error);
    throw error;
  }
}

// Export Types for consumers (e.g. notify.ts)
export type {
  CreateOrderInput,
  OrderResponse,
  OrderByTokenResponse,
  CreatePartnerInput,
  PartnerResponse,
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  OrderStatusType,
  RentalPaymentStatus,
};
