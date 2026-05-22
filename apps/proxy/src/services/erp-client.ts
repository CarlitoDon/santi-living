/**
 * Sync ERP REST client.
 *
 * Santi Living treats Sync ERP as an external API and does not import Sync ERP
 * runtime types or tRPC internals.
 */
import { getSyncErpApiBaseUrl } from "../config/runtime";
import { getOutboundRequestContext } from "./request-context";
import {
  OrderStatusConst,
  RentalPaymentStatusConst,
} from "../types/sync-erp";
import type {
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  CreateOrderInput,
  CreatePartnerInput,
  OrderByTokenResponse,
  OrderResponse,
  OrderStatusType,
  PartnerResponse,
  RentalPaymentStatus,
  UpdateOrderInput,
  UpdateOrderResponse,
} from "../types/sync-erp";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

const getApiSecret = () => {
  const secret = process.env.SYNC_ERP_API_SECRET || "";

  if (!secret) {
    console.warn(
      "[ERP Client] SYNC_ERP_API_SECRET is not set. Authentication will fail.",
    );
  }

  return secret;
};

const buildHeaders = () => {
  const {
    correlationId,
    idempotencyKey,
    companyId,
    attributionSource,
    attributionMedium,
    attributionCampaign,
    attributionGclid,
    attributionFbclid,
    attributionWbraid,
    attributionGbraid,
  } = getOutboundRequestContext();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getApiSecret()}`,
    ...(correlationId ? { "X-Correlation-Id": correlationId } : {}),
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    ...(companyId ? { "X-Company-Id": companyId } : {}),
    ...(attributionSource ? { "X-Attribution-Source": attributionSource } : {}),
    ...(attributionMedium ? { "X-Attribution-Medium": attributionMedium } : {}),
    ...(attributionCampaign
      ? { "X-Attribution-Campaign": attributionCampaign }
      : {}),
    ...(attributionGclid ? { "X-Attribution-Gclid": attributionGclid } : {}),
    ...(attributionFbclid ? { "X-Attribution-Fbclid": attributionFbclid } : {}),
    ...(attributionWbraid ? { "X-Attribution-Wbraid": attributionWbraid } : {}),
    ...(attributionGbraid ? { "X-Attribution-Gbraid": attributionGbraid } : {}),
  };
};

const toJsonBody = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  return JSON.stringify(value);
};

async function requestSyncErp<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${getSyncErpApiBaseUrl()}${path}`, {
    method,
    headers: buildHeaders(),
    body: toJsonBody(body),
  });

  const responseBody = (await response.json().catch(() => ({}))) as
    | ApiErrorBody
    | T;

  if (!response.ok) {
    const errorBody = responseBody as ApiErrorBody;
    const message =
      errorBody.error?.message || `Sync ERP request failed: ${response.status}`;
    throw new Error(message);
  }

  return responseBody as T;
}

export async function createRentalOrder(
  input: CreateOrderInput,
): Promise<OrderResponse> {
  return requestSyncErp<OrderResponse>("POST", "/rental/orders", input);
}

export async function getOrderByToken(
  token: string,
): Promise<OrderByTokenResponse> {
  return requestSyncErp<OrderByTokenResponse>(
    "GET",
    `/rental/orders/by-token/${encodeURIComponent(token)}`,
  );
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderByTokenResponse> {
  return requestSyncErp<OrderByTokenResponse>(
    "GET",
    `/rental/orders/by-number/${encodeURIComponent(orderNumber)}`,
  );
}

export async function findOrCreatePartner(
  input: CreatePartnerInput,
): Promise<PartnerResponse> {
  try {
    return await requestSyncErp<PartnerResponse>(
      "POST",
      "/rental/customers",
      input,
    );
  } catch (error) {
    console.error("[ERP Client] findOrCreatePartner failed:", error);
    throw error;
  }
}

export async function confirmPayment(
  input: ConfirmPaymentInput,
): Promise<ConfirmPaymentResponse> {
  const order = await getOrderByToken(input.token);
  return requestSyncErp<ConfirmPaymentResponse>(
    "POST",
    `/rental/orders/${encodeURIComponent(order.id)}/payments/claim`,
    {
      paymentMethod: input.paymentMethod,
      reference: input.reference,
    },
  );
}

export async function updatePaymentMethod(input: {
  token: string;
  paymentMethod: "qris" | "transfer" | "gopay";
}): Promise<{
  success: boolean;
  orderNumber: string;
  paymentMethod: string | null;
}> {
  const order = await getOrderByToken(input.token);
  const updated = await updateRentalOrder({
    token: input.token,
    paymentMethod: input.paymentMethod,
  });

  return {
    success: true,
    orderNumber: updated.orderNumber || order.orderNumber,
    paymentMethod: input.paymentMethod,
  };
}

export async function confirmPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod: string;
  transactionId?: string;
  amount?: number;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return requestSyncErp<{ success: boolean; orderNumber: string; status: string }>(
    "POST",
    `/rental/orders/by-number/${encodeURIComponent(
      input.orderNumber,
    )}/payments/confirm`,
    {
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      amount: input.amount,
    },
  );
}

export async function rejectPaymentByOrderNumber(input: {
  orderNumber: string;
  paymentMethod?: string;
  failReason: string;
}): Promise<{ success: boolean; orderNumber: string; status: string }> {
  return requestSyncErp<{ success: boolean; orderNumber: string; status: string }>(
    "POST",
    `/rental/orders/by-number/${encodeURIComponent(
      input.orderNumber,
    )}/payments/reject`,
    {
      paymentMethod: input.paymentMethod,
      failReason: input.failReason,
    },
  );
}

export async function updateRentalOrder(
  input: UpdateOrderInput,
): Promise<UpdateOrderResponse> {
  try {
    const order = await getOrderByToken(input.token);
    const { token: _token, ...body } = input;
    void _token;

    return await requestSyncErp<UpdateOrderResponse>(
      "PATCH",
      `/rental/orders/${encodeURIComponent(order.id)}`,
      body,
    );
  } catch (error) {
    console.error(`[ERP Client] Update failed for token: ${input.token}`, error);
    throw error;
  }
}

export async function deleteRentalOrder(
  id: string,
): Promise<{ success: boolean }> {
  return requestSyncErp<{ success: boolean }>(
    "POST",
    `/rental/orders/${encodeURIComponent(id)}/cancel`,
    { reason: "Cancelled by Santi Living proxy" },
  );
}

export { OrderStatusConst, RentalPaymentStatusConst };
export type {
  ConfirmPaymentInput,
  ConfirmPaymentResponse,
  CreateOrderInput,
  CreatePartnerInput,
  OrderByTokenResponse,
  OrderResponse,
  OrderStatusType,
  PartnerResponse,
  RentalPaymentStatus,
  UpdateOrderInput,
  UpdateOrderResponse,
};
