import type { APIRoute } from "astro";
import { createApiErrorResponse } from "../../../lib/http-error";
import { getProxyBaseUrl } from "../../../lib/proxy-config";

const PROXY_URL = getProxyBaseUrl();

/**
 * Forward Midtrans Webhook to Proxy
 *
 * This allows using a single ngrok tunnel (Astro port) while the actual
 * webhook handler lives in the proxy service.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();

    console.log("[Midtrans Webhook Forward] Forwarding to proxy...");

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
      "[Midtrans Webhook Forward] Proxy response:",
      proxyResponse.status,
      responseText,
    );

    return new Response(responseText, {
      status: proxyResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Midtrans Webhook Forward] Error:", error);
    return createApiErrorResponse(
      500,
      "UPSTREAM_ERROR",
      "Failed to forward webhook",
    );
  }
};
