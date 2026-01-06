import { z } from "zod";

// Order Item Schema
const OrderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  pricePerDay: z.number().nonnegative(),
});

// Main Order Payload Schema
export const OrderPayloadSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerWhatsapp: z.string().min(8, "Nomor WA minimal 8 digit"),
  deliveryAddress: z.string().min(5, "Alamat terlalu pendek"),
  items: z.array(OrderItemSchema).min(1, "Minimal 1 barang"),
  totalPrice: z.number().positive(),
  orderDate: z.string(), // ISO date string
  duration: z.number().int().positive(),
  deliveryFee: z.number().nonnegative(),
  isPackage: z.boolean(),
  notes: z.string().optional(),
});

export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
