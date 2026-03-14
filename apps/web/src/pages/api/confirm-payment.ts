import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";
import { mapUpstreamError } from "../../lib/upstream-error";

/**
 * Confirm Payment API
 *
 * Forwards payment confirmation to erp-service via TRPC.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token, paymentMethod, reference } = body;

    // console.log(
    //   `[confirm-payment] Confirming payment for token: ${token}, method: ${paymentMethod}`,
    // );

    if (!token || !paymentMethod) {
      return createApiErrorResponse(
        400,
        "BAD_REQUEST",
        "Token and Payment Method are required",
      );
    }

    const client = createProxyClient();

    const result = await client.order.confirmPayment.mutate({
      token,
      paymentMethod,
      reference,
    });

    // console.log("[confirm-payment] Success:", result);

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
    console.error("[confirm-payment] Error:", error);
    const mappedError = mapUpstreamError(error, "Failed to confirm payment");

    return createApiErrorResponse(
      mappedError.status,
      mappedError.code,
      mappedError.message,
    );
  }
};
