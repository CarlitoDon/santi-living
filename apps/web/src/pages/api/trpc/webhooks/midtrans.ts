import type { APIRoute } from "astro";

/**
 * Midtrans Webhook Redirect
 *
 * This endpoint exists because Midtrans was configured with the wrong path:
 * - Wrong: /api/trpc/webhooks/midtrans
 * - Correct: /api/webhooks/midtrans
 *
 * This simply redirects to the correct endpoint.
 * TODO: Update Midtrans Dashboard notification URL to use /api/webhooks/midtrans
 */
export const POST: APIRoute = async ({ request }) => {
  console.log(
    "[Midtrans Webhook] Redirect from /api/trpc/webhooks/midtrans to /api/webhooks/midtrans",
  );

  // Forward to the correct endpoint
  const PROXY_URL = import.meta.env.SANTI_PROXY_URL || "http://localhost:3002";

  try {
    const body = await request.text();

    console.log("[Midtrans Webhook Redirect] Forwarding to proxy...");

    const proxyResponse = await fetch(`${PROXY_URL}/api/webhooks/midtrans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward any Midtrans headers if needed
        ...(request.headers.get("x-midtrans-signature") && {
          "x-midtrans-signature": request.headers.get("x-midtrans-signature")!,
        }),
      },
      body,
    });

    const responseText = await proxyResponse.text();
    console.log(
      "[Midtrans Webhook Redirect] Proxy response:",
      proxyResponse.status,
      responseText,
    );

    return new Response(responseText, {
      status: proxyResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Midtrans Webhook Redirect] Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to forward webhook" }),
      { status: 500 },
    );
  }
};
