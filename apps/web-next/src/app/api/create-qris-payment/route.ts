import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createProxyClient } from '@/lib/trpc-client';
import { mapUpstreamError } from "@/lib/upstream-error";

const CreateQrisSchema = z.object({
  token: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { token } = CreateQrisSchema.parse(body);

    const client = createProxyClient({
      idempotencyKey: `qris-${token}`,
    });

    const result = await client.order.createPaymentToken.mutate({ 
      token, 
      paymentMethod: "qris" 
    });
    return NextResponse.json({ ...result, success: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', details: error.errors } }, { status: 400 });
    }
    console.error("[create-qris-payment] Error:", error);
    const mappedError = mapUpstreamError(error, "Failed to create QRIS payment");
    return NextResponse.json(
      { error: { code: mappedError.code, message: mappedError.message } },
      { status: mappedError.status }
    );
  }
}
