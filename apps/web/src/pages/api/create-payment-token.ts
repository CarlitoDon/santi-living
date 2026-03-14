import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";
import { mapUpstreamError } from "../../lib/upstream-error";

/**
 * Create Payment Token API
 *
 * Forwards request to erp-service to generate Midtrans Snap Token.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token, paymentMethod } = body;

    // console.log(`[create-payment-token] Requesting token for order: ${token}, method: ${paymentMethod}`);

    if (!token) {
      return createApiErrorResponse(400, "BAD_REQUEST", "Token is required");
    }

    const client = createProxyClient();

    const result = await client.order.createPaymentToken.mutate({
      token,
      paymentMethod, // Pass directly from frontend to ensure correct method
    });

    // console.log("[create-payment-token] Success:", result);

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
    console.error("[create-payment-token] Error:", error);
    const mappedError = mapUpstreamError(
      error,
      "Failed to create payment token",
    );

    return createApiErrorResponse(
      mappedError.status,
      mappedError.code,
      mappedError.message,
    );
  }
};
