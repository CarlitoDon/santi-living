import type { APIRoute } from "astro";
import { createApiErrorResponse } from "../../lib/http-error";

/**
 * Proxy QR Image API
 *
 * Fetches QR image from Midtrans and returns it to bypass CORS restrictions.
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const qrUrl = url.searchParams.get("url");

    if (!qrUrl) {
      return createApiErrorResponse(400, "BAD_REQUEST", "URL parameter is required");
    }

    // Only allow Midtrans URLs for security
    if (!qrUrl.includes("midtrans.com")) {
      return createApiErrorResponse(403, "FORBIDDEN", "Invalid URL");
    }

    const response = await fetch(qrUrl);

    if (!response.ok) {
      return createApiErrorResponse(
        response.status,
        "UPSTREAM_ERROR",
        "Failed to fetch image",
      );
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    return new Response(imageData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("[proxy-qr-image] Error:", error);
    return createApiErrorResponse(500, "UPSTREAM_ERROR", "Failed to proxy image");
  }
};
