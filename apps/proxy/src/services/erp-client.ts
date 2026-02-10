/**
 * ERP Client
 *
 * TRPC Client to communicate with sync-erp publicRental API.
 * Uses standardized env variable: SYNC_ERP_API_SECRET
 */

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
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

const getBaseUrl = () => {
  const url = process.env.SYNC_ERP_API_URL || "http://localhost:3001/api/trpc";
  console.log(`[ERP Client] API URL: ${url}`);
  return url;
};

const getApiSecret = () => {
  const secret = process.env.SYNC_ERP_API_SECRET || "";

  if (!secret) {
    console.warn(
      `⚠️  [ERP Client] SYNC_ERP_API_SECRET NOT SET! Authentication will fail.`,
    );
  } else {
    console.log(
      `[ERP Client] Using SYNC_ERP_API_SECRET: ${secret.substring(0, 11)}...`,
    );
  }

  return secret;
};

// Initialize TRPC Client
export const syncClient = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
      headers() {
        return {
          Authorization: `Bearer ${getApiSecret()}`,
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
    updatePaymentMethod: {
      mutate: (input: {
        token: string;
        paymentMethod: "qris" | "transfer" | "gopay";
      }) => Promise<{
        success: boolean;
        orderNumber: string;
        paymentMethod: string;
      }>;
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
    updateOrder: {
      mutate: (input: UpdateOrderInput) => Promise<UpdateOrderResponse>;
    };
    deleteOrder: {
      mutate: (input: { id: string }) => Promise<{ success: boolean }>;
    };
  };
};

// Re-export constants for runtime usage
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

// Wrapper functions
export async function createRentalOrder(
  input: CreateOrderInput,
): Promise<OrderResponse> {
  return syncClient.publicRental.createOrder.mutate(input);
}

export async function getOrderByToken(
  token: string,
): Promise<OrderByTokenResponse> {
  return syncClient.publicRental.getByToken.query({ token });
}

export async function findOrCreatePartner(
  input: CreatePartnerInput,
): Promise<PartnerResponse> {
  console.error("[ERP Client] findOrCreatePartner called with:", {
    companyId: input.companyId,
    name: input.name,
    phone: input.phone,
  });
  try {
    const result =
      await syncClient.publicRental.findOrCreatePartner.mutate(input);
    console.error("[ERP Client] findOrCreatePartner SUCCESS:", result.id);
    return result;
  } catch (error) {
    console.error("[ERP Client] findOrCreatePartner FAILED:", {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : "Unknown",
      cause: error instanceof Error ? (error as any).cause : undefined,
    });
    throw error;
  }
}

export async function confirmPayment(
  input: ConfirmPaymentInput,
): Promise<ConfirmPaymentResponse> {
  return syncClient.publicRental.confirmPayment.mutate(input);
}

export async function updatePaymentMethod(input: {
  token: string;
  paymentMethod: "qris" | "transfer" | "gopay";
}): Promise<{ success: boolean; orderNumber: string; paymentMethod: string }> {
  return syncClient.publicRental.updatePaymentMethod.mutate(input);
}

export async function confirmPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod: string;
  transactionId?: string;
  amount?: number;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return syncClient.publicRental.confirmPaymentByOrderNumber.mutate(input);
}

export async function updateRentalOrder(
  input: UpdateOrderInput,
): Promise<UpdateOrderResponse> {
  console.warn(`[ERP Client] Updating order token: ${input.token}`);
  try {
    const result = await syncClient.publicRental.updateOrder.mutate(input);
    console.warn(`[ERP Client] Update successful: ${result.orderNumber}`);
    return result;
  } catch (error) {
    console.error(`[ERP Client] Update FAILED for token: ${input.token}`, error);
    throw error;
  }
}

export async function deleteRentalOrder(
  id: string,
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

// Export Types
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
