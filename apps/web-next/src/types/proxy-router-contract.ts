/**
 * Proxy Router Contract (Type-Only)
 *
 * Defines the tRPC AppRouter type locally so web-next can create a
 * type-safe tRPC client without importing the proxy's runtime source.
 *
 * This avoids pulling in the proxy's transitive dependencies (express,
 * midtrans-client, etc.) during type checking.
 *
 * ⚠️  Keep in sync with apps/proxy/src/trpc/index.ts + routers/*.ts
 *     when procedures are added/removed/renamed.
 */
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

// Minimal tRPC instance — only used for type inference, never at runtime
const t = initTRPC.create({ transformer: superjson });

// ---------------------------------------------------------------------------
// Order Router Contract
// ---------------------------------------------------------------------------

const orderRouter = t.router({
  create: t.procedure
    .input(z.record(z.string(), z.unknown()))
    .mutation(async () => ({
      id: '' as string,
      orderNumber: '' as string,
      publicToken: '' as string,
      status: '' as string,
      createdAt: '' as string,
      orderUrl: '' as string,
    })),

  getByToken: t.procedure
    .input(z.object({ token: z.string() }))
    .query(async () => null as unknown as Record<string, unknown>),

  update: t.procedure
    .input(z.record(z.string(), z.unknown()))
    .mutation(async () => ({
      id: '' as string,
      orderNumber: '' as string,
      publicToken: '' as string,
      status: '' as string,
      totalAmount: 0 as number,
    })),

  confirmPayment: t.procedure
    .input(
      z.object({
        token: z.string(),
        paymentMethod: z.enum(['qris', 'transfer', 'gopay']),
        reference: z.string().optional(),
      }),
    )
    .mutation(async () => ({} as Record<string, unknown>)),

  updatePaymentMethod: t.procedure
    .input(
      z.object({
        token: z.string(),
        paymentMethod: z.enum(['qris', 'transfer', 'gopay']),
      }),
    )
    .mutation(async () => ({} as Record<string, unknown>)),

  createPaymentToken: t.procedure
    .input(
      z.object({
        token: z.string(),
        paymentMethod: z.enum(['qris', 'gopay', 'transfer']).optional(),
      }),
    )
    .mutation(async () => ({
      token: '' as string,
      redirect_url: '' as string,
    })),
});

// ---------------------------------------------------------------------------
// Notification Router Contract (empty — web-next does not call it)
// ---------------------------------------------------------------------------

const notificationRouter = t.router({});

// ---------------------------------------------------------------------------
// App Router
// ---------------------------------------------------------------------------

const _appRouter = t.router({
  order: orderRouter,
  notification: notificationRouter,
});

/**
 * Type-only export — mirrors `typeof appRouter` from the proxy.
 * Used by trpc-client.ts to create a typed client.
 */
export type AppRouter = typeof _appRouter;
