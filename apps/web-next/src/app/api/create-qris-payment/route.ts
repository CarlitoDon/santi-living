import { NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/trpc-client";
import { mapUpstreamError } from "@/lib/upstream-error";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Record<string, unknown>;
    const token = parsed.token as string;

    if (!token) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Token is required" } },
        { status: 400 }
      );
    }

    const client = createProxyClient();

    const result = await client.order.createPaymentToken.mutate({
      token,
      paymentMethod: "qris",
    });

    return NextResponse.json({ ...result, success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("[create-qris-payment] Error:", error);
    const mappedError = mapUpstreamError(error, "Failed to create QRIS payment");
    return NextResponse.json(
      { error: { code: mappedError.code, message: mappedError.message } },
      { status: mappedError.status }
    );
  }
}
