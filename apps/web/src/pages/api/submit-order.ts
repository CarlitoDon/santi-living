import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";

/**
 * Submit Order API
 *
 * Forwards order creation to erp-service via TRPC.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // DEBUG: Log environment and request info
    const proxyUrl =
      process.env.SANTI_PROXY_URL || process.env.PUBLIC_PROXY_URL || "NOT SET";
    console.warn("[submit-order] DEBUG:", {
      proxyUrl,
      customerName: body.customerName,
      timestamp: new Date().toISOString(),
    });

    const client = createProxyClient();

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

    const message =
      error instanceof Error ? error.message : "Failed to create order";

    // Determine status code based on error type
    // If it's a known business validation error, return 400
    let status = 500;
    if (
      message.includes("INVALID_PHONE") ||
      message.includes("validation") ||
      message.includes("Bad Request") ||
      message.includes("ZodError")
    ) {
      status = 400;
    }

    return new Response(
      JSON.stringify({
        error: "Order creation failed",
        message,
      }),
      { status },
    );
  }
};
