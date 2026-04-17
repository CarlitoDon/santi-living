import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createProxyClient } from '@/lib/trpc-client';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Record<string, unknown>;
    const correlationId = request.headers.get('x-correlation-id') || randomUUID();
    const idempotencyKey = request.headers.get('idempotency-key') || request.headers.get('x-idempotency-key') || `submit-order-${correlationId}`;

    const client = createProxyClient({
      correlationId,
      idempotencyKey,
      companyId: request.headers.get('x-company-id') || undefined,
      attributionSource: request.headers.get('x-attribution-source') || undefined,
      attributionMedium: request.headers.get('x-attribution-medium') || undefined,
      attributionCampaign: request.headers.get('x-attribution-campaign') || undefined,
      attributionGclid: request.headers.get('x-attribution-gclid') || undefined,
      attributionFbclid: request.headers.get('x-attribution-fbclid') || undefined,
      attributionWbraid: request.headers.get('x-attribution-wbraid') || undefined,
      attributionGbraid: request.headers.get('x-attribution-gbraid') || undefined,
    });

    const result = await client.order.create.mutate({
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

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[submit-order] FAILURE:', { msg, raw: error });
    return NextResponse.json({ error: { code: 'UPSTREAM_ERROR', message: msg } }, { status: 500 });
  }
}
