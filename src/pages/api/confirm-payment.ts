import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ERP_SYNC_API_KEY;
  const serviceUrl =
    import.meta.env.ERP_SYNC_SERVICE_URL || "http://localhost:3002";

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Server configuration error",
        message: "API Key not configured",
      }),
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { token, paymentMethod, reference } = body;

    if (!token || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: "Token and Payment Method are required" }),
        { status: 400 }
      );
    }

    // Forward to ERP Sync Service
    const response = await fetch(`${serviceUrl}/api/orders/${token}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ paymentMethod, reference }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to confirm payment",
          details: data.message || data.error || "Unknown error",
        }),
        { status: response.status }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};
