import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";

/**
 * Update Payment Method API
 *
 * Updates the payment method on an existing order.
 * Called when customer selects payment method at checkout.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token, paymentMethod } = body;

    if (!token) {
      return createApiErrorResponse(400, "BAD_REQUEST", "Token is required");
    }

    if (
      !paymentMethod ||
      !["qris", "transfer", "gopay"].includes(paymentMethod)
    ) {
      return createApiErrorResponse(
        400,
        "BAD_REQUEST",
        "Valid payment method is required (qris, transfer, gopay)",
      );
    }

    const client = createProxyClient();

    const result = await client.order.updatePaymentMethod.mutate({
      token,
      paymentMethod,
    });

    return new Response(
      JSON.stringify({
        ...result,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: unknown) {
    console.error("[update-payment-method] Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update payment method";

    return createApiErrorResponse(500, "UPSTREAM_ERROR", message);
  }
};
