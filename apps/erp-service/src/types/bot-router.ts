/**
 * Bot Service TRPC Types
 *
 * Type definitions for TRPC client communication with bot-service.
 * Copied from bot-service to remove cross-path dependency for Railway deployment.
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

// Initialize TRPC with superjson transformer for type inference
const t = initTRPC.create({
  transformer: superjson,
});

// Input schemas
const sendOrderInput = z.object({
  orderId: z.string(),
  customerName: z.string(),
  customerWhatsapp: z.string(),
  deliveryAddress: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["package", "mattress", "accessory"]),
      quantity: z.number(),
      pricePerDay: z.number(),
    })
  ),
  totalPrice: z.number(),
  orderDate: z.string(),
  endDate: z.string(),
  duration: z.number(),
  deliveryFee: z.number(),
  addressFields: z
    .object({
      street: z.string().optional(),
      kelurahan: z.string().optional(),
      kecamatan: z.string().optional(),
      kota: z.string().optional(),
      provinsi: z.string().optional(),
      zip: z.string().optional(),
      lat: z.string().optional(),
      lng: z.string().optional(),
    })
    .optional(),
  paymentMethod: z.enum(["qris", "transfer"]).optional(),
  notes: z.string().optional(),
  volumeDiscountAmount: z.number().optional(),
  volumeDiscountLabel: z.string().optional(),
  orderUrl: z.string().optional(),
});

const sendMessageInput = z.object({
  phone: z.string(),
  message: z.string(),
});

// Output types
export interface SendOrderOutput {
  success: boolean;
  messageId: string;
}

export interface SendMessageOutput {
  success: boolean;
  messageId: string;
}

// Router type definition (for inference only)
const botRouter = t.router({
  sendOrder: t.procedure.input(sendOrderInput).mutation((): SendOrderOutput => {
    throw new Error("Type-only");
  }),
  sendMessage: t.procedure
    .input(sendMessageInput)
    .mutation((): SendMessageOutput => {
      throw new Error("Type-only");
    }),
});

// App router wrapping bot router
export const appRouter = t.router({
  bot: botRouter,
});

// Export the router type for client usage
export type AppRouter = typeof appRouter;
