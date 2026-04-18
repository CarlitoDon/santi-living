import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createProxyClient } from '@/lib/trpc-client';

const SubmitOrderSchema = z.object({
  customerName: z.string().min(2),
  customerWhatsapp: z.string().min(8),
  deliveryAddress: z.string().min(5),
  addressFields: z.object({
    street: z.string(),
    district: z.string(),
    city: z.string(),
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(["package", "mattress", "accessory"]),
    quantity: z.number().int().positive(),
    pricePerDay: z.number().positive(),
    includes: z.array(z.string()).optional(),
  })),
  totalPrice: z.number().positive(),
  orderDate: z.string(),
  endDate: z.string(),
  duration: z.number().int().positive(),
  deliveryFee: z.number().nonnegative(),
  paymentMethod: z.enum(["transfer", "gopay", "qris"]),
  notes: z.string().optional().default(''),
  volumeDiscountAmount: z.number().nonnegative().optional().default(0),
  volumeDiscountLabel: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    
    // Strict Validation at Boundary
    const parsed = SubmitOrderSchema.parse(body);
    
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

    const result = await client.order.create.mutate(parsed);

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', details: error.errors } }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[submit-order] FAILURE:', { msg, raw: error });
    return NextResponse.json({ error: { code: 'UPSTREAM_ERROR', message: msg } }, { status: 500 });
  }
}
