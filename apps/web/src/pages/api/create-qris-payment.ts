import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";
import { createApiErrorResponse } from "../../lib/http-error";

/**
 * Create QRIS Payment API
 *
 * Uses Midtrans Core API to get QR code directly (forces QR on mobile).
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return createApiErrorResponse(400, "BAD_REQUEST", "Token is required");
    }

    const client = createProxyClient();

    const result = await client.order.createQrisPayment.mutate({
      token,
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
    console.error("[create-qris-payment] Error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create QRIS payment";

    return createApiErrorResponse(500, "UPSTREAM_ERROR", message);
  }
};
