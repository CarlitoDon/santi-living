import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";

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
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token is required",
        }),
        { status: 400 },
      );
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

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create QRIS payment",
        message,
      }),
      { status: 500 },
    );
  }
};
