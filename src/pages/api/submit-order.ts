import type { APIRoute } from "astro";
import { createErpSyncClient } from "../../lib/trpc-client";

/**
 * Submit Order API
 *
 * Forwards order creation to erp-sync-service via TRPC.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("[submit-order] Creating order for:", body.customerName);

    const client = createErpSyncClient();

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

    console.log("[submit-order] Order created:", result.orderNumber);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("[submit-order] Error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create order";

    return new Response(
      JSON.stringify({
        error: "Order creation failed",
        message,
      }),
      { status: 500 }
    );
  }
};
