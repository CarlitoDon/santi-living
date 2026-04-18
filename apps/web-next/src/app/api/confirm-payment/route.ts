import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createProxyClient } from '@/lib/trpc-client';
import { mapUpstreamError } from "@/lib/upstream-error";

const ConfirmPaymentSchema = z.object({
  token: z.string().min(10),
  paymentMethod: z.enum(["qris", "gopay", "transfer"]),
  reference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = ConfirmPaymentSchema.parse(body);

    const client = createProxyClient({
      idempotencyKey: `confirm-${parsed.token}`,
    });

    const result = await client.order.confirmPayment.mutate(parsed);
    return NextResponse.json({ ...result, success: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', details: error.errors } }, { status: 400 });
    }
    console.error("[confirm-payment] Error:", error);
    const mappedError = mapUpstreamError(error, "Failed to confirm payment");
    return NextResponse.json(
      { error: { code: mappedError.code, message: mappedError.message } },
      { status: mappedError.status }
    );
  }
}
