/**
 * ERP Client
 *
 * TRPC Client to communicate with sync-erp publicRental API.
 * Uses standardized env variable: SYNC_ERP_API_SECRET
 */

import {
  createTRPCClient,
  httpBatchLink,
  type TRPCClient,
} from "@trpc/client";
import superjson from "superjson";
import { getSyncErpApiPublicRentalUrl } from "../config/runtime";
import type { PublicRentalRouter } from "../types/public-rental";
import {
  OrderStatusConst,
  RentalPaymentStatusConst,
} from "../types/sync-erp";
import type {
  CreateOrderInput,
  OrderResponse,
  OrderByTokenResponse,
  CreatePartnerInput,
  PartnerResponse,
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  OrderStatusType,
  RentalPaymentStatus,
  UpdateOrderInput,
  UpdateOrderResponse,
} from "../types/sync-erp";

const getApiSecret = () => {
  const secret = process.env.SYNC_ERP_API_SECRET || "";

  if (!secret) {
    console.warn(
      `⚠️  [ERP Client] SYNC_ERP_API_SECRET NOT SET! Authentication will fail.`,
    );
  }

  return secret;
};

// Initialize TRPC Client
export const syncClient: TRPCClient<PublicRentalRouter> =
  createTRPCClient<PublicRentalRouter>({
    links: [
      httpBatchLink({
        url: getSyncErpApiPublicRentalUrl(),
        headers() {
          return {
            Authorization: `Bearer ${getApiSecret()}`,
          };
        },
        transformer: superjson,
      }),
    ],
  });

// Wrapper functions
export async function createRentalOrder(
  input: CreateOrderInput,
): Promise<OrderResponse> {
  return syncClient.createOrder.mutate(input);
}

export async function getOrderByToken(
  token: string,
): Promise<OrderByTokenResponse> {
  return syncClient.getByToken.query({ token });
}

export async function findOrCreatePartner(
  input: CreatePartnerInput,
): Promise<PartnerResponse> {
  try {
    return await syncClient.findOrCreatePartner.mutate(input);
  } catch (error) {
    console.error("[ERP Client] findOrCreatePartner FAILED:", {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : "Unknown",
      cause: error instanceof Error ? error.cause : undefined,
    });
    throw error;
  }
}

export async function confirmPayment(
  input: ConfirmPaymentInput,
): Promise<ConfirmPaymentResponse> {
  return syncClient.confirmPayment.mutate(input);
}

export async function updatePaymentMethod(input: {
  token: string;
  paymentMethod: "qris" | "transfer" | "gopay";
}): Promise<{
  success: boolean;
  orderNumber: string;
  paymentMethod: string | null;
}> {
  return syncClient.updatePaymentMethod.mutate(input);
}

export async function confirmPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod: string;
  transactionId?: string;
  amount?: number;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return syncClient.confirmPaymentByOrderNumber.mutate(input);
}

export async function rejectPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod?: string;
  failReason: string;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return syncClient.rejectPaymentByOrderNumber.mutate(input);
}

export async function updateRentalOrder(
  input: UpdateOrderInput,
): Promise<UpdateOrderResponse> {
  try {
    return await syncClient.updateOrder.mutate(input);
  } catch (error) {
    console.error(`[ERP Client] Update FAILED for token: ${input.token}`, error);
    throw error;
  }
}

export async function deleteRentalOrder(
  id: string,
): Promise<{ success: boolean }> {
  try {
    const result = await syncClient.deleteOrder.mutate({ id });
    return result;
  } catch (error) {
    console.error(`[ERP Client] Delete FAILED for order ID: ${id}`, error);
    throw error;
  }
}

// Export Types
export { OrderStatusConst, RentalPaymentStatusConst };
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
  UpdateOrderInput,
  UpdateOrderResponse,
};
