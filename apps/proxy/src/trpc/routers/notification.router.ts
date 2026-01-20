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
      const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4321";
      const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${input.token}`;

      await sendOrderLinkToCustomer({
        customerWhatsapp: order.partner.phone,
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
      const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4321";
      const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${input.token}`;

      if (input.action === "confirmed") {
        await notifyPaymentConfirmed({
          customerWhatsapp: order.partner.phone,
          customerName: order.partner.name,
          orderNumber: order.orderNumber,
          orderUrl,
        });
      } else {
        await notifyPaymentRejected({
          customerWhatsapp: order.partner.phone,
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
      const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER;
      if (!adminWhatsapp) {
        return {
          success: false,
          message: "ADMIN_WHATSAPP_NUMBER not configured",
        };
      }

      const order = await getOrderByToken(input.token);
      const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:4321";
      const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${input.token}`;

      await notifyAdminNewOrder({
        adminWhatsapp,
        orderNumber: order.orderNumber,
        customerName: order.partner.name,
        customerPhone: order.partner.phone,
        totalAmount: order.totalAmount,
        orderUrl,
        erpOrderId: input.erpOrderId,
      });

      return { success: true };
    }),
});
