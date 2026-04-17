import { NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/trpc-client";
import { mapUpstreamError } from "@/lib/upstream-error";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Record<string, unknown>;
    const token = parsed.token as string;
    const paymentMethod = parsed.paymentMethod as "qris" | "gopay" | "transfer";
    const reference = parsed.reference as string | undefined;

    if (!token || !paymentMethod) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Token and Payment Method are required" } },
        { status: 400 }
      );
    }

    const client = createProxyClient();

    const result = await client.order.confirmPayment.mutate({
      token,
      paymentMethod,
      reference,
    });

    return NextResponse.json({ ...result, success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("[confirm-payment] Error:", error);
    const mappedError = mapUpstreamError(error, "Failed to confirm payment");
    return NextResponse.json(
      { error: { code: mappedError.code, message: mappedError.message } },
      { status: mappedError.status }
    );
  }
}
