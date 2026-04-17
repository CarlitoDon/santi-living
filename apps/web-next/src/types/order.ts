import { z } from 'zod';

// ─── SSR Order Schema (for pesanan/[token] page) ────────────────────────────

export const OrderDisplayItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  subtotal: z.number().optional(),
});

export const OrderDisplaySchema = z.object({
  orderNumber: z.string(),
  status: z.string(),
  rentalPaymentStatus: z.string().optional(),
  rentalStartDate: z.string(),
  rentalEndDate: z.string(),
  deliveryAddress: z.string().optional(),
  items: z.array(OrderDisplayItemSchema),
  subtotal: z.number(),
  discountAmount: z.number().optional(),
  discountLabel: z.string().optional(),
  deliveryFee: z.number().optional(),
  totalAmount: z.number(),
  paymentClaimedAt: z.string().optional(),
  paymentFailReason: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export type OrderDisplay = z.infer<typeof OrderDisplaySchema>;
export type OrderDisplayItem = z.infer<typeof OrderDisplayItemSchema>;

// Keep backward compat aliases used by pesanan page
export const OrderSchema = OrderDisplaySchema;
export const OrderItemSchema = OrderDisplayItemSchema;
export type Order = OrderDisplay;

// ─── Client-side Order Types (for calculator/checkout flow) ─────────────────

export interface AddressFields {
  street?: string;
  kelurahan?: string;
  kelurahanKode?: string;
  kecamatan?: string;
  kecamatanKode?: string;
  kota?: string;
  kotaKode?: string;
  provinsi?: string;
  provinsiKode?: string;
  zip?: string;
  lat?: string;
  lng?: string;
}

export interface OrderPayloadItem {
  id: string;
  name: string;
  category: "package" | "mattress" | "accessory";
  quantity: number;
  pricePerDay: number;
  includes?: string[];
}

export interface OrderPayload {
  orderId?: string;
  customerName: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  addressFields?: AddressFields;
  items: OrderPayloadItem[];
  totalPrice: number;
  orderDate: string;
  endDate?: string;
  duration: number;
  deliveryFee: number;
  paymentMethod: "qris" | "transfer" | "gopay";
  notes?: string;
  volumeDiscountAmount?: number;
  volumeDiscountLabel?: string;
  orderUrl?: string;
}

export interface OrderData extends Omit<OrderPayload, "orderId"> {
  orderId?: string;
}

export interface ErpOrderResponse {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  createdAt: string;
  orderUrl: string;
}
