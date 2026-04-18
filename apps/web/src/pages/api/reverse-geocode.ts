/**
 * Reverse Geocode API Proxy
 * Proxies requests to Nominatim to avoid CORS issues
 */

import type { APIRoute } from "astro";
import { createApiErrorResponse } from "../../lib/http-error";

export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");

  if (!lat || !lng) {
    return createApiErrorResponse(400, "BAD_REQUEST", "lat and lng are required");
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        "Accept-Language": "id",
        "User-Agent":
          "SantiLiving/1.0 (https://santiliving.com; contact@santiliving.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("[reverse-geocode] Error:", error);
    return createApiErrorResponse(500, "UPSTREAM_ERROR", "Failed to reverse geocode");
  }
};
