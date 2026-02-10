import type { APIRoute } from "astro";
import { createProxyClient } from "../../lib/trpc-client";

/**
 * Update Order API
 *
 * Forwards order updates to proxy via TRPC.
 * Only works for DRAFT orders with PENDING payment.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.token) {
      return new Response(
        JSON.stringify({ error: "Missing order token" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.warn("[update-order] DEBUG:", {
      token: body.token,
      customerName: body.customerName,
      timestamp: new Date().toISOString(),
    });

    const client = createProxyClient();

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
    const message =
      error instanceof Error ? error.message : "Failed to update order";

    console.error("[update-order] FAILURE:", {
      msg: message,
      raw: error,
    });

    let status = 500;
    if (
      message.includes("draft") ||
      message.includes("not found") ||
      message.includes("Bad Request")
    ) {
      status = 400;
    }

    return new Response(
      JSON.stringify({
        error: "Order update failed",
        message,
      }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
};
