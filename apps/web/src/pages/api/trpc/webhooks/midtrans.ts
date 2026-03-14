import type { APIRoute } from "astro";
import { createApiErrorResponse } from "../../../../lib/http-error";
import { getProxyBaseUrl } from "../../../../lib/proxy-config";

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
  const PROXY_URL = getProxyBaseUrl();

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
    return createApiErrorResponse(
      500,
      "UPSTREAM_ERROR",
      "Failed to forward webhook",
    );
  }
};
