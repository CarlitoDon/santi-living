import type { APIRoute } from "astro";

/**
 * Proxy QR Image API
 *
 * Fetches QR image from Midtrans and returns it to bypass CORS restrictions.
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const qrUrl = url.searchParams.get("url");

    if (!qrUrl) {
      return new Response(
        JSON.stringify({ error: "URL parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Only allow Midtrans URLs for security
    if (!qrUrl.includes("midtrans.com")) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(qrUrl);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
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
    return new Response(JSON.stringify({ error: "Failed to proxy image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
