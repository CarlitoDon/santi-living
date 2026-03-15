import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";
import { mapUpstreamError } from "../../lib/upstream-error";

/**
 * Submit Order API
 *
 * Forwards order creation to erp-service via TRPC.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const correlationId = request.headers.get("x-correlation-id") || randomUUID();
    const idempotencyKey =
      request.headers.get("idempotency-key") ||
      request.headers.get("x-idempotency-key") ||
      `submit-order-${correlationId}`;
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

    if (process.env.NODE_ENV !== "production") {
      console.warn("[submit-order] Received create order request", {
        customerName: body.customerName,
        hasItems: Array.isArray(body.items) && body.items.length > 0,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

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

    const result = await client.order.create.mutate({
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

    // console.log("[submit-order] Order created:", result.orderNumber);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    // Detailed error logging for debugging validation issues
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("[submit-order] FAILURE:", {
      msg: errorMessage,
      stack: errorStack,
      raw: error,
    });

    const mappedError = mapUpstreamError(error, "Failed to create order");

    return createApiErrorResponse(
      mappedError.status,
      mappedError.code,
      mappedError.message,
    );
  }
};
