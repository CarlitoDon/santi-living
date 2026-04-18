/**
 * Notification Router
 *
 * TRPC procedures for WhatsApp notification operations.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  sendOrderLinkToCustomer,
  notifyPaymentConfirmed,
  notifyPaymentRejected,
  notifyAdminNewOrder,
} from "../../services/wa-notifier";
import { getOrderByToken } from "../../services/erp-client";
import {
  getAdminWhatsappNumber,
  getPublicBaseUrl,
} from "../../config/runtime";

export const notificationRouter = router({
  /**
   * Notify customer about order (send order link)
   */
  notifyCustomer: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const order = await getOrderByToken(input.token);
      const customerPhone = order.partner.phone;
      const baseUrl = getPublicBaseUrl();
      const orderUrl = `${baseUrl}/pesanan/${input.token}`;

      if (!customerPhone) {
        throw new Error("Customer phone is missing on this order");
      }

      await sendOrderLinkToCustomer({
        customerWhatsapp: customerPhone,
        customerName: order.partner.name,
        orderNumber: order.orderNumber,
        orderUrl,
      });

      return { success: true };
    }),

  /**
   * Notify customer about payment status change
   */
  notifyPaymentStatus: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        action: z.enum(["confirmed", "failed"]),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const order = await getOrderByToken(input.token);
      const customerPhone = order.partner.phone;
      const baseUrl = getPublicBaseUrl();
      const orderUrl = `${baseUrl}/pesanan/${input.token}`;

      if (!customerPhone) {
        throw new Error("Customer phone is missing on this order");
      }

      if (input.action === "confirmed") {
        await notifyPaymentConfirmed({
          customerWhatsapp: customerPhone,
          customerName: order.partner.name,
          orderNumber: order.orderNumber,
          orderUrl,
        });
      } else {
        await notifyPaymentRejected({
          customerWhatsapp: customerPhone,
          customerName: order.partner.name,
          orderNumber: order.orderNumber,
          orderUrl,
          failReason: input.reason,
        });
      }

      return { success: true };
    }),

  /**
   * Notify admin about new order
   */
  notifyAdmin: protectedProcedure
    .input(
      z.object({
        token: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          ),
        erpOrderId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const adminWhatsapp = getAdminWhatsappNumber();
      if (!adminWhatsapp) {
        return {
          success: false,
          message: "ADMIN_WHATSAPP_NUMBER not configured",
        };
      }

      const order = await getOrderByToken(input.token);
      const baseUrl = getPublicBaseUrl();
      const orderUrl = `${baseUrl}/pesanan/${input.token}`;

      await notifyAdminNewOrder({
        adminWhatsapp,
        orderNumber: order.orderNumber,
        customerName: order.partner.name,
        customerPhone: order.partner.phone || "-",
        totalAmount: order.totalAmount,
        orderUrl,
        erpOrderId: input.erpOrderId,
      });

      return { success: true };
    }),
});
