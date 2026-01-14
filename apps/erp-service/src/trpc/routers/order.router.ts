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
  createRentalOrder,
  findOrCreatePartner,
  getOrderByToken,
  confirmPayment as confirmPaymentErp,
  deleteRentalOrder,
} from "../../services/erp-client";
import { createSnapToken } from "../../services/midtrans-client";
import {
  sendOrderConfirmation,
  notifyAdminNewOrder,
} from "../../services/wa-notifier";

// Default company ID for Santi Living
const SANTI_LIVING_COMPANY_ID =
  process.env.SANTI_LIVING_COMPANY_ID || "demo-company-rental";

export const orderRouter = router({
  /**
   * Create order - called by santi-living frontend
   */
  create: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ input }) => {
      const addressFields = input.addressFields || {};

      // 1. Find or create partner in sync-erp
      const partner = await findOrCreatePartner({
        companyId: SANTI_LIVING_COMPANY_ID,
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
        companyId: SANTI_LIVING_COMPANY_ID,
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
      const isDev = process.env.NODE_ENV !== "production";
      const baseUrl =
        process.env.PUBLIC_BASE_URL ||
        (isDev ? "http://localhost:4321" : "https://santiliving.com");
      const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${order.publicToken}`;

      // 5. Send WhatsApp notifications (async, non-blocking)
      // 5. Send WhatsApp notifications (async, blocking for validation)
      // We await this to ensure the number is valid. If it fails with "Invalid Number", we rollback.
      try {
        await sendOrderConfirmation({
          orderId: order.orderNumber,
          customerName: input.customerName,
          customerWhatsapp: input.customerWhatsapp,
          deliveryAddress: input.deliveryAddress,
          addressFields: {
            street: addressFields.street,
            kelurahan: addressFields.kelurahan,
            kecamatan: addressFields.kecamatan,
            kota: addressFields.kota,
            provinsi: addressFields.provinsi,
            zip: addressFields.zip,
            lat: addressFields.lat,
            lng: addressFields.lng,
          },
          items: input.items.map((item) => ({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            pricePerDay: item.pricePerDay,
          })),
          totalPrice: input.totalPrice,
          orderDate: input.orderDate,
          endDate: input.endDate,
          duration: input.duration,
          deliveryFee: input.deliveryFee,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
          volumeDiscountAmount: input.volumeDiscountAmount,
          volumeDiscountLabel: input.volumeDiscountLabel,
          orderUrl,
        });
      } catch (err: any) {
        console.error("[WA Notify] Failed to send order confirmation:", err);

        const errorMessage = err.message || "";
        // Check for invalid number (from Bot Service 400)
        if (
          errorMessage.includes("[INVALID_PHONE]") ||
          errorMessage.includes("Invalid WhatsApp Number") || // Legacy fallback
          errorMessage.includes("no lid")
        ) {
          try {
            console.warn(
              `[OrderRouter] Rolling back order ${order.orderNumber} due to invalid number`
            );
            await deleteRentalOrder(order.id);
          } catch (deleteErr) {
            console.error(
              `[OrderRouter] Failed to rollback order ${order.orderNumber}:`,
              deleteErr
            );
            // We still throw the original validation error so the user knows
          }

          // Throw specific TRPC error for frontend to catch
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "[INVALID_PHONE] Nomor WhatsApp tidak terdaftar atau tidak aktif",
          });
        }

        // For other errors (network, bot down), we just log and continue
      }

      // Notify admin
      const adminWhatsapp = process.env.ADMIN_WHATSAPP;
      if (adminWhatsapp) {
        notifyAdminNewOrder({
          adminWhatsapp,
          orderNumber: order.orderNumber,
          customerName: input.customerName,
          customerPhone: input.customerWhatsapp,
          totalAmount: input.totalPrice,
          orderUrl,
          erpOrderId: order.id,
        }).catch((err) =>
          console.error("[WA Notify] Failed to send admin notification:", err)
        );
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        publicToken: order.publicToken,
        status: order.status,
        createdAt: order.createdAt,
        orderUrl,
      };
    }),

  /**
   * Get order by token - public endpoint for customer tracking
   */
  getByToken: publicProcedure
    .input(z.object({ token: z.string().uuid() }))
    .query(async ({ input }) => {
      return getOrderByToken(input.token);
    }),

  /**
   * Confirm payment - called when customer clicks "I've paid"
   */
  confirmPayment: protectedProcedure
    .input(
      z.object({
        token: z.string().uuid(),
        paymentMethod: z.enum(["qris", "transfer"]),
        reference: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return confirmPaymentErp({
        token: input.token,
        paymentMethod: input.paymentMethod,
        reference: input.reference,
      });
    }),

  /**
   * Create Midtrans Snap Token for payment
   */
  createPaymentToken: protectedProcedure
    .input(z.object({ token: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // 1. Get order details first
      const order = await getOrderByToken(input.token);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // 2. Generate unique order ID for Midtrans (handling retries)
      // Append timestamp to ensure uniqueness if user retries/regenerates QR
      const uniqueOrderId = `${order.orderNumber}-${Math.floor(
        Date.now() / 1000
      )}`;

      // 3. Create Snap Token
      const token = await createSnapToken({
        transaction_details: {
          order_id: uniqueOrderId,
          gross_amount: Math.round(order.totalAmount), // Ensure integer
        },
        customer_details: {
          first_name: order.partner.name.split(" ")[0],
          last_name: order.partner.name.split(" ").slice(1).join(" ") || "",
          email: "customer@santiliving.com", // Fallback if not available
          phone: order.partner.phone,
        },
        item_details: order.items.map((item) => ({
          id: item.name.substring(0, 50),
          price: Math.round(item.unitPrice),
          quantity: item.quantity,
          name: item.name.substring(0, 50),
        })),
      });

      return {
        token,
        redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`,
      };
    }),
});
