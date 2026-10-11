import { z } from "zod";
import type { OrderStatusType } from "./sync-erp";

// Order payload from santi-living frontend
export const CreateOrderSchema = z.object({
  customerName: z.string().min(2),
  customerWhatsapp: z.string().regex(/^(08|62)\d{8,12}$/),
  deliveryAddress: z.string().min(10),
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
  items: z
    .array(
      z.object({
        id: z.string(), // santi-living product ID (e.g., "package-single-standard")
        name: z.string(),
        category: z.enum(["package", "mattress", "accessory"]),
        quantity: z.number().int().positive(),
        pricePerDay: z.number().positive(),
        includes: z.array(z.string()).optional(), // Bundle components: ["kasur busa", "sprei", "bantal"]
      }),
    )
    .min(1),
  totalPrice: z.number().positive(),
  orderDate: z.string().min(1), // Accept any date string, will parse in handler
  endDate: z.string().min(1), // Accept any date string, will parse in handler
  duration: z.number().int().positive(),
  deliveryFee: z.number().nonnegative(),
  paymentMethod: z.enum(["qris", "transfer", "gopay"]),
  notes: z.string().optional(),
  volumeDiscountAmount: z.number().optional(),
  volumeDiscountLabel: z.string().optional(),
});

