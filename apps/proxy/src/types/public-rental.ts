/**
 * Local contract snapshot for sync-erp publicRental router.
 *
 * This is the single local router definition used for type inference in the
 * proxy. App-facing DTO aliases should infer from here instead of duplicating
 * schemas in multiple files.
 */
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

export const PublicRentalFindOrCreatePartnerInput = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .optional(),
  address: z.string().optional(),
  street: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const PublicRentalCreateOrderInput = z.object({
  companyId: z.string().min(1),
  partnerId: z.string().min(1),
  rentalStartDate: z.coerce.date(),
  rentalEndDate: z.coerce.date(),
  items: z.array(
    z
      .object({
        rentalItemId: z.string().min(1).optional(),
        rentalBundleId: z.string().min(1).optional(),
        quantity: z.number().int().positive(),
        name: z.string().optional(),
        pricePerDay: z.number().positive().optional(),
        category: z.enum(["package", "mattress", "accessory"]).optional(),
        components: z.array(z.string()).optional(),
      })
      .refine((data) => !!data.rentalItemId || !!data.rentalBundleId, {
        message: "Either rentalItemId or rentalBundleId is required",
      }),
  ),
  notes: z.string().optional(),
  deliveryFee: z.number().nonnegative().optional(),
  deliveryAddress: z.string().optional(),
  street: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  paymentMethod: z.string().optional(),
  discountAmount: z.number().nonnegative().optional(),
  discountLabel: z.string().optional(),
});

export const PublicRentalGetByTokenInput = z.object({
  token: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ),
});

export const PublicRentalConfirmPaymentInput = z.object({
  token: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ),
  paymentMethod: z.enum(["qris", "transfer", "gopay"]),
  reference: z.string().optional(),
});

export const PublicRentalConfirmPaymentByOrderNumberInput = z.object({
  orderNumber: z.string().min(1),
  paymentMethod: z.string().min(1),
  transactionId: z.string().optional(),
  amount: z.number().optional(),
});

export const PublicRentalUpdatePaymentMethodInput = z.object({
  token: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ),
  paymentMethod: z.enum(["qris", "transfer", "gopay"]),
});

export const PublicRentalUpdateOrderInput = z.object({
  token: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().optional(),
  rentalStartDate: z.coerce.date().optional(),
  rentalEndDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  deliveryFee: z.number().nonnegative().optional(),
  deliveryAddress: z.string().optional(),
  street: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  zip: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  paymentMethod: z.string().optional(),
  discountAmount: z.number().nonnegative().optional(),
  discountLabel: z.string().optional(),
  items: z
    .array(
      z
        .object({
          rentalItemId: z.string().min(1).optional(),
          rentalBundleId: z.string().min(1).optional(),
          quantity: z.number().int().positive(),
          name: z.string().optional(),
          pricePerDay: z.number().positive().optional(),
          category: z.enum(["package", "mattress", "accessory"]).optional(),
          components: z.array(z.string()).optional(),
        })
        .refine((data) => !!data.rentalItemId || !!data.rentalBundleId, {
          message: "Either rentalItemId or rentalBundleId is required",
        }),
    )
    .optional(),
});

export const PublicRentalDeleteOrderInput = z.object({
  id: z.string().uuid(),
});

export interface PublicRentalPartnerOutput {
  id: string;
  companyId: string;
  type: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  street: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicRentalOrderOutput {
  id: string;
  orderNumber: string;
  publicToken: string | null;
  status: string;
  createdAt: Date;
}

export interface PublicRentalOrderByTokenOutput {
  id: string;
  orderNumber: string;
  status: string;
  rentalStartDate: Date;
  rentalEndDate: Date;
  subtotal: number;
  totalAmount: number;
  depositAmount: number;
  notes: string | null;
  createdAt: Date;
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
  orderSource: string | null;
  rentalPaymentStatus: string;
  paymentClaimedAt: Date | null;
  paymentConfirmedAt: Date | null;
  paymentReference: string | null;
  paymentFailedAt: Date | null;
  paymentFailReason: string | null;
  partner: {
    name: string;
    phone: string | null;
    address: string | null;
    street: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kota: string | null;
    provinsi: string | null;
    zip: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  items: Array<{
    rentalItemId?: string | null;
    rentalBundleId?: string | null;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface PublicRentalConfirmPaymentOutput {
  success: boolean;
  orderNumber: string;
  rentalPaymentStatus: string;
  paymentClaimedAt: Date | null;
}

export interface PublicRentalConfirmPaymentByOrderNumberOutput {
  success: boolean;
  orderNumber: string;
  status: string;
}

export const PublicRentalRejectPaymentByOrderNumberInput = z.object({
  orderNumber: z.string(),
  paymentMethod: z.string().optional(),
  failReason: z.string(),
});

export interface PublicRentalRejectPaymentByOrderNumberOutput {
  success: boolean;
  orderNumber: string;
  status: string;
}

export interface PublicRentalUpdatePaymentMethodOutput {
  success: boolean;
  orderNumber: string;
  paymentMethod: string | null;
}

export interface PublicRentalUpdateOrderOutput {
  id: string;
  orderNumber: string;
  publicToken: string;
  status: string;
  totalAmount: number;
}

export interface PublicRentalDeleteOrderOutput {
  success: boolean;
}

export const publicRentalRouter = t.router({
  getByToken: t.procedure
    .input(PublicRentalGetByTokenInput)
    .query((): PublicRentalOrderByTokenOutput => {
      throw new Error("Type-only");
    }),
  findOrCreatePartner: t.procedure
    .input(PublicRentalFindOrCreatePartnerInput)
    .mutation((): PublicRentalPartnerOutput => {
      throw new Error("Type-only");
    }),
  createOrder: t.procedure
    .input(PublicRentalCreateOrderInput)
    .mutation((): PublicRentalOrderOutput => {
      throw new Error("Type-only");
    }),
  confirmPayment: t.procedure
    .input(PublicRentalConfirmPaymentInput)
    .mutation((): PublicRentalConfirmPaymentOutput => {
      throw new Error("Type-only");
    }),
  confirmPaymentByOrderNumber: t.procedure
    .input(PublicRentalConfirmPaymentByOrderNumberInput)
    .mutation((): PublicRentalConfirmPaymentByOrderNumberOutput => {
      throw new Error("Type-only");
    }),
  rejectPaymentByOrderNumber: t.procedure
    .input(PublicRentalRejectPaymentByOrderNumberInput)
    .mutation((): PublicRentalRejectPaymentByOrderNumberOutput => {
      throw new Error("Type-only");
    }),
  updatePaymentMethod: t.procedure
    .input(PublicRentalUpdatePaymentMethodInput)
    .mutation((): PublicRentalUpdatePaymentMethodOutput => {
      throw new Error("Type-only");
    }),
  updateOrder: t.procedure
    .input(PublicRentalUpdateOrderInput)
    .mutation((): PublicRentalUpdateOrderOutput => {
      throw new Error("Type-only");
    }),
  deleteOrder: t.procedure
    .input(PublicRentalDeleteOrderInput)
    .mutation((): PublicRentalDeleteOrderOutput => {
      throw new Error("Type-only");
    }),
});

export type PublicRentalRouter = typeof publicRentalRouter;
