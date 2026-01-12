import { z } from "zod";

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
        name: z.string(),
        category: z.enum(["package", "mattress", "accessory"]),
        quantity: z.number().int().positive(),
        pricePerDay: z.number().positive(),
      })
    )
    .min(1),
  totalPrice: z.number().positive(),
  orderDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.number().int().positive(),
  deliveryFee: z.number().nonnegative(),
  paymentMethod: z.enum(["qris", "transfer"]),
  notes: z.string().optional(),
  volumeDiscountAmount: z.number().optional(),
  volumeDiscountLabel: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Response from sync-erp
export interface OrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
  orderUrl?: string;
}

// Order status for customer view (all separate fields)
export interface OrderStatus {
  orderNumber: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "CONFIRMED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    pricePerDay: number;
  }>;
  rentalStartDate: string;
  rentalEndDate: string;
  subtotal: number;
  totalAmount: number;
  depositAmount: number;

  // Separate address fields
  deliveryFee: number | null;
  deliveryAddress: string | null;
  street: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  paymentMethod: string | null;
  discountAmount: number | null;
  discountLabel: string | null;

  createdAt: string;
}
