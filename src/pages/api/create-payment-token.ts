import type { APIRoute } from "astro";
import { createErpSyncClient } from "../../lib/trpc-client";

/**
 * Create Payment Token API
 *
 * Forwards request to erp-service to generate Midtrans Snap Token.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    console.log(`[create-payment-token] Requesting token for order: ${token}`);

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token is required",
        }),
        { status: 400 }
      );
    }

    const client = createErpSyncClient();

    const result = await client.order.createPaymentToken.mutate({
      token,
    });

    console.log("[create-payment-token] Success:", result);

    return new Response(
      JSON.stringify({
        ...result,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("[create-payment-token] Error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create payment token";

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create payment token",
        message,
      }),
      { status: 500 }
    );
  }
};
