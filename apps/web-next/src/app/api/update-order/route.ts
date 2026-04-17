import { NextRequest, NextResponse } from 'next/server';
import { createProxyClient } from '@/lib/trpc-client';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Record<string, unknown>;
    const correlationId = request.headers.get('x-correlation-id') || undefined;

    const client = createProxyClient({ correlationId });

    const result = await client.order.update.mutate({
      token: parsed.token as string,
      customerName: parsed.customerName as string,
      customerWhatsapp: parsed.customerWhatsapp as string,
      deliveryAddress: parsed.deliveryAddress as string,
      addressFields: parsed.addressFields as { street: string; district: string; city: string; },
      items: parsed.items as Array<{ id: string; name: string; category: "package" | "mattress" | "accessory"; quantity: number; pricePerDay: number; includes?: string[]; }>,
      totalPrice: parsed.totalPrice as number,
      orderDate: parsed.orderDate as string,
      endDate: parsed.endDate as string,
      duration: parsed.duration as number,
      deliveryFee: parsed.deliveryFee as number,
      paymentMethod: parsed.paymentMethod as "transfer" | "gopay" | "qris",
      notes: parsed.notes as string,
      volumeDiscountAmount: parsed.volumeDiscountAmount as number,
      volumeDiscountLabel: parsed.volumeDiscountLabel as string,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[update-order] FAILURE:', { msg, raw: error });
    return NextResponse.json({ error: { code: 'UPSTREAM_ERROR', message: msg } }, { status: 500 });
  }
}
