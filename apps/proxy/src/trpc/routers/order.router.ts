/**
 * Order Router
 *
 * TRPC procedures for order operations.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { CreateOrderSchema } from "../../types/order";
import {
  getPublicBaseUrl,
  parseCompanyScopeHeader,
  requireSantiLivingCompanyId,
} from "../../config/runtime";
import { runWithOutboundRequestContext } from "../../services/request-context";
import {
  createRentalOrder,
  findOrCreatePartner,
  getOrderByToken,
  confirmPayment as confirmPaymentErp,
  updateRentalOrder,
} from "../../services/erp-client";
import {
  createSnapToken,
} from "../../services/midtrans-client";

const readHeaderValue = (value: string | string[] | undefined) => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  const normalized = rawValue.trim();
  return normalized.length > 0 ? normalized : undefined;
};

export const orderRouter = router({
  /**
   * Create order - called by santi-living frontend
   */
  create: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ input, ctx }) => {
      const configuredCompanyId = requireSantiLivingCompanyId();
      const addressFields = input.addressFields || {};
      const outboundContext = {
        correlationId: readHeaderValue(
          ctx.req.headers["x-correlation-id"] as string | string[] | undefined,
        ),
        idempotencyKey: readHeaderValue(
          ctx.req.headers["idempotency-key"] as string | string[] | undefined,
        ),
        companyId:
          parseCompanyScopeHeader(ctx.req.headers["x-company-id"]) ||
          configuredCompanyId,
      };

      return runWithOutboundRequestContext(outboundContext, async () => {
        // 1. Find or create partner in sync-erp
        const partner = await findOrCreatePartner({
          companyId: configuredCompanyId,
          name: input.customerName,
          phone: input.customerWhatsapp,
          address: input.deliveryAddress,
          street: addressFields.street,
          kelurahan: addressFields.kelurahan,
          kecamatan: addressFields.kecamatan,
          kota: addressFields.kota,
          provinsi: addressFields.provinsi,
          zip: addressFields.zip,
          latitude: addressFields.lat ? parseFloat(addressFields.lat) : undefined,
          longitude: addressFields.lng
            ? parseFloat(addressFields.lng)
            : undefined,
        });

        // 2. Map items to rental items/bundles
        const rentalItems = input.items.map((item) => {
          const baseItem = {
            quantity: item.quantity,
            name: item.name,
            pricePerDay: item.pricePerDay,
            category: item.category,
            components: item.includes,
          };

          if (item.category === "package") {
            return { ...baseItem, rentalBundleId: item.id };
          } else {
            return { ...baseItem, rentalItemId: item.id };
          }
        });

        // 3. Create rental order in sync-erp
        const order = await createRentalOrder({
          companyId: configuredCompanyId,
          partnerId: partner.id,
          rentalStartDate: new Date(input.orderDate),
          rentalEndDate: new Date(input.endDate),
          items: rentalItems,
          notes: input.notes,
          deliveryFee: input.deliveryFee,
          deliveryAddress: input.deliveryAddress,
          street: addressFields.street,
          kelurahan: addressFields.kelurahan,
          kecamatan: addressFields.kecamatan,
          kota: addressFields.kota,
          provinsi: addressFields.provinsi,
          zip: addressFields.zip,
          latitude: addressFields.lat ? parseFloat(addressFields.lat) : undefined,
          longitude: addressFields.lng
            ? parseFloat(addressFields.lng)
            : undefined,
          paymentMethod: input.paymentMethod,
          discountAmount: input.volumeDiscountAmount,
          discountLabel: input.volumeDiscountLabel,
        });

        // 4. Generate public URL
        const baseUrl = getPublicBaseUrl();
        const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${order.publicToken}`;

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          publicToken: order.publicToken,
          status: order.status,
          createdAt: order.createdAt,
          orderUrl,
        };
      });
    }),

  /**
   * Get order by token - public endpoint for customer tracking
   */
  getByToken: publicProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
      }),
    )
    .query(async ({ input }) => {
      return getOrderByToken(input.token);
    }),

  /**
   * Update order - called by santi-living frontend when user edits order
   * Only updates DRAFT orders with PENDING payment
   */
  update: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        customerName: z.string().min(2).optional(),
        customerWhatsapp: z
          .string()
          .regex(/^(08|62)\d{8,12}$/)
          .optional(),
        deliveryAddress: z.string().optional(),
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
              id: z.string(),
              name: z.string(),
              category: z.enum(["package", "mattress", "accessory"]),
              quantity: z.number().int().positive(),
              pricePerDay: z.number().positive(),
              includes: z.array(z.string()).optional(),
            }),
          )
          .optional(),
        totalPrice: z.number().optional(),
        orderDate: z.string().optional(),
        endDate: z.string().optional(),
        duration: z.number().optional(),
        deliveryFee: z.number().nonnegative().optional(),
        paymentMethod: z.enum(["qris", "transfer", "gopay"]).optional(),
        notes: z.string().optional(),
        volumeDiscountAmount: z.number().optional(),
        volumeDiscountLabel: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const addressFields = input.addressFields || {};

      // Map items to ERP format
      const erpItems = input.items?.map((item) => {
        const baseItem = {
          quantity: item.quantity,
          name: item.name,
          pricePerDay: item.pricePerDay,
          category: item.category as "package" | "mattress" | "accessory",
          components: item.includes,
        };

        if (item.category === "package") {
          return { ...baseItem, rentalBundleId: item.id };
        } else {
          return { ...baseItem, rentalItemId: item.id };
        }
      });

      const result = await updateRentalOrder({
        token: input.token,
        customerName: input.customerName,
        customerPhone: input.customerWhatsapp,
        rentalStartDate: input.orderDate
          ? new Date(input.orderDate)
          : undefined,
        rentalEndDate: input.endDate ? new Date(input.endDate) : undefined,
        notes: input.notes,
        deliveryFee: input.deliveryFee,
        deliveryAddress: input.deliveryAddress,
        street: addressFields.street,
        kelurahan: addressFields.kelurahan,
        kecamatan: addressFields.kecamatan,
        kota: addressFields.kota,
        provinsi: addressFields.provinsi,
        zip: addressFields.zip,
        latitude: addressFields.lat
          ? parseFloat(addressFields.lat)
          : undefined,
        longitude: addressFields.lng
          ? parseFloat(addressFields.lng)
          : undefined,
        paymentMethod: input.paymentMethod,
        discountAmount: input.volumeDiscountAmount,
        discountLabel: input.volumeDiscountLabel,
        items: erpItems,
      });

      return {
        id: result.id,
        orderNumber: result.orderNumber,
        publicToken: result.publicToken,
        status: result.status,
        totalAmount: result.totalAmount,
      };
    }),

  /**
   * Confirm payment - called when customer clicks "I've paid"
   */
  confirmPayment: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        paymentMethod: z.enum(["qris", "transfer", "gopay"]),
        reference: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return confirmPaymentErp({
        token: input.token,
        paymentMethod: input.paymentMethod,
        reference: input.reference,
      });
    }),

  /**
   * Update payment method on existing order
   * Called when customer selects payment method at checkout
   */
  updatePaymentMethod: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        paymentMethod: z.enum(["qris", "transfer", "gopay"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { updatePaymentMethod: updatePaymentMethodErp } =
        await import("../../services/erp-client");
      return updatePaymentMethodErp({
        token: input.token,
        paymentMethod: input.paymentMethod,
      });
    }),

  /**
   * Create Midtrans Snap Token for payment
   */
  createPaymentToken: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        // Accept paymentMethod directly from frontend to avoid stale DB data
        paymentMethod: z.enum(["qris", "gopay", "transfer"]).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. Get order details first
      const order = await getOrderByToken(input.token);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // DEBUG: Log order paymentMethod
      console.warn(
        "[createPaymentToken] Order paymentMethod:",
        order.paymentMethod,
      );

      // 2. Generate unique order ID for Midtrans (handling retries)
      // Append timestamp to ensure uniqueness if user retries/regenerates QR
      const uniqueOrderId = `${order.orderNumber}-${Math.floor(
        Date.now() / 1000,
      )}`;

      // 3. Prepare Item Details (Products + Delivery + Discount)
      // IMPORTANT: Use item.subtotal which already includes duration calculation
      // item.unitPrice is the per-day price, item.subtotal = unitPrice * quantity * duration
      const itemDetails = order.items.map((item) => ({
        id: item.name.substring(0, 50),
        price: Math.round(item.subtotal / item.quantity), // Total price per unit (includes duration)
        quantity: item.quantity,
        name: item.name.substring(0, 50),
      }));

      // Add Delivery Fee
      if (order.deliveryFee && order.deliveryFee > 0) {
        itemDetails.push({
          id: "DELIVERY-FEE",
          price: Math.round(order.deliveryFee),
          quantity: 1,
          name: "Biaya Pengiriman",
        });
      }

      // Add Discount
      if (order.discountAmount && order.discountAmount > 0) {
        itemDetails.push({
          id: "DISCOUNT",
          price: -Math.round(order.discountAmount),
          quantity: 1,
          name: order.discountLabel || "Diskon", // Assuming discountLabel exists
        });
      }

      // 4. Create Snap Token with correct payment method
      // Prefer input.paymentMethod (direct from frontend) over order.paymentMethod (potentially stale)
      const effectivePaymentMethod = input.paymentMethod || order.paymentMethod;
      console.warn(
        "[createPaymentToken] Using paymentMethod:",
        effectivePaymentMethod,
        "(input:",
        input.paymentMethod,
        ", order:",
        order.paymentMethod,
        ")",
      );

      const token = await createSnapToken({
        transaction_details: {
          order_id: uniqueOrderId,
          gross_amount: Math.round(order.totalAmount),
        },
        customer_details: {
          first_name: order.partner.name.split(" ")[0],
          last_name: order.partner.name.split(" ").slice(1).join(" ") || "",
          email: `${order.partner.name.toLowerCase().replace(" ", "_")}@santiliving.com`,
          phone: order.partner.phone || "",
        },
        item_details: itemDetails,
        paymentMethod: effectivePaymentMethod as
          | "qris"
          | "gopay"
          | "transfer"
          | undefined,
      });

      const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
      const snapBaseUrl = isProduction
        ? "https://app.midtrans.com/snap/v2/vtweb"
        : "https://app.sandbox.midtrans.com/snap/v2/vtweb";

      return {
        token,
        redirect_url: `${snapBaseUrl}/${token}`,
      };
    }),

});
