import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const qrUrl = request.nextUrl.searchParams.get("url");

    if (!qrUrl) {
      return NextResponse.json({ error: { code: "BAD_REQUEST", message: "URL parameter is required" } }, { status: 400 });
    }

    // Only allow Midtrans URLs for security
    if (!qrUrl.includes("midtrans.com")) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Invalid URL" } }, { status: 403 });
    }

    const response = await fetch(qrUrl);

    if (!response.ok) {
      return NextResponse.json({ error: { code: "UPSTREAM_ERROR", message: "Failed to fetch image" } }, { status: response.status });
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    return new NextResponse(imageData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("[proxy-qr-image] Error:", error);
    return NextResponse.json({ error: { code: "UPSTREAM_ERROR", message: "Failed to proxy image" } }, { status: 500 });
  }
}
