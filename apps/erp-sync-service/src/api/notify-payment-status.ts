import type { Request, Response } from "express";
import { z } from "zod";
import { getOrderByToken } from "../services/erp-client";
import {
  notifyPaymentConfirmed,
  notifyPaymentRejected,
  notifyAdminPaymentClaimed,
} from "../services/wa-notifier";

const NotifyPaymentStatusSchema = z.object({
  action: z.enum(["confirmed", "rejected", "claimed"]),
  paymentReference: z.string().optional(),
  failReason: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const notifyPaymentStatus = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token || token.length < 10) {
    return res.status(400).json({
      error: "Invalid token",
      message: "Token pesanan tidak valid",
    });
  }

  // Validate body
  const result = NotifyPaymentStatusSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  const { action, paymentReference, failReason, paymentMethod } = result.data;

  try {
    // 1. Get order details
    const order = await getOrderByToken(token);

    if (!order) {
      return res.status(404).json({
        error: "Not Found",
        message: "Pesanan tidak ditemukan",
      });
    }

    // 2. Generate order URL
    const baseUrl = process.env.PUBLIC_BASE_URL || "https://santiliving.com";
    const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${token}`;

    // 3. Send appropriate notification based on action
    if (action === "confirmed") {
      await notifyPaymentConfirmed({
        customerWhatsapp: order.partner.phone,
        customerName: order.partner.name,
        orderNumber: order.orderNumber,
        orderUrl,
        paymentReference,
      });

      return res.status(200).json({
        success: true,
        message: "Notifikasi pembayaran dikonfirmasi terkirim ke customer",
      });
    }

    if (action === "rejected") {
      await notifyPaymentRejected({
        customerWhatsapp: order.partner.phone,
        customerName: order.partner.name,
        orderNumber: order.orderNumber,
        orderUrl,
        failReason,
      });

      return res.status(200).json({
        success: true,
        message: "Notifikasi pembayaran ditolak terkirim ke customer",
      });
    }

    if (action === "claimed") {
      // Notify admin when customer claims payment
      const adminWhatsapp = process.env.ADMIN_WHATSAPP;

      if (!adminWhatsapp) {
        return res.status(200).json({
          success: false,
          message: "ADMIN_WHATSAPP not configured, skipping admin notification",
        });
      }

      await notifyAdminPaymentClaimed({
        adminWhatsapp,
        orderNumber: order.orderNumber,
        customerName: order.partner.name,
        paymentMethod: paymentMethod || "unknown",
        orderUrl,
      });

      return res.status(200).json({
        success: true,
        message: "Notifikasi terkirim ke admin",
      });
    }

    return res.status(400).json({
      error: "Invalid action",
      message: "Action tidak dikenali",
    });
  } catch (error: unknown) {
    console.error("Failed to send payment status notification:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengirim notifikasi";

    return res.status(500).json({
      error: "Notification Failed",
      message,
    });
  }
};
