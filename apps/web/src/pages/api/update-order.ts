import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";
import { mapUpstreamError } from "../../lib/upstream-error";

/**
 * Update Order API
 *
 * Forwards order updates to proxy via TRPC.
 * Only works for DRAFT orders with PENDING payment.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const correlationId = request.headers.get("x-correlation-id") || randomUUID();
    const idempotencyKey =
      request.headers.get("idempotency-key") ||
      request.headers.get("x-idempotency-key") ||
      `update-order-${correlationId}`;
    const companyId = request.headers.get("x-company-id") || undefined;
    const attributionSource =
      request.headers.get("x-attribution-source") || undefined;
    const attributionMedium =
      request.headers.get("x-attribution-medium") || undefined;
    const attributionCampaign =
      request.headers.get("x-attribution-campaign") || undefined;
    const attributionGclid =
      request.headers.get("x-attribution-gclid") || undefined;
    const attributionFbclid =
      request.headers.get("x-attribution-fbclid") || undefined;
    const attributionWbraid =
      request.headers.get("x-attribution-wbraid") || undefined;
    const attributionGbraid =
      request.headers.get("x-attribution-gbraid") || undefined;

    if (!body.token) {
      return createApiErrorResponse(400, "BAD_REQUEST", "Missing order token");
    }

    console.warn("[update-order] DEBUG:", {
      token: body.token,
      customerName: body.customerName,
      timestamp: new Date().toISOString(),
    });

    const client = createProxyClient({
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
    });

    const result = await client.order.update.mutate({
      token: body.token,
      customerName: body.customerName,
      customerWhatsapp: body.customerWhatsapp,
      deliveryAddress: body.deliveryAddress,
      addressFields: body.addressFields,
      items: body.items,
      totalPrice: body.totalPrice,
      orderDate: body.orderDate,
      endDate: body.endDate,
      duration: body.duration,
      deliveryFee: body.deliveryFee,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      volumeDiscountAmount: body.volumeDiscountAmount,
      volumeDiscountLabel: body.volumeDiscountLabel,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const mappedError = mapUpstreamError(error, "Failed to update order");

    console.error("[update-order] FAILURE:", {
      msg: mappedError.message,
      raw: error,
    });

    return createApiErrorResponse(
      mappedError.status,
      mappedError.code,
      mappedError.message,
    );
  }
};
