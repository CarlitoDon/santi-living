import type { Request, Response } from "express";
import { z } from "zod";
import { getOrderByToken } from "../services/erp-client";
import {
  notifyAdminNewOrder,
  notifyAdminPaymentClaimed,
} from "../services/wa-notifier";

const NotifyAdminSchema = z.object({
  action: z.enum(["new_order", "payment_claimed"]),
  orderNumber: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  totalAmount: z.number().optional(),
  paymentMethod: z.string().optional(),
});

export const notifyAdmin = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token || token.length < 10) {
    return res.status(400).json({
      error: "Invalid token",
      message: "Token pesanan tidak valid",
    });
  }

  // Check if admin WA is configured
  const adminWhatsapp = process.env.ADMIN_WHATSAPP;
  if (!adminWhatsapp) {
    return res.status(200).json({
      success: false,
      message: "ADMIN_WHATSAPP not configured, skipping admin notification",
    });
  }

  // Validate body
  const result = NotifyAdminSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  const { action, orderNumber, customerName, customerPhone, totalAmount, paymentMethod } = result.data;

  try {
    // Generate order URL
    const baseUrl = process.env.PUBLIC_BASE_URL || "https://santiliving.com";
    const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${token}`;

    if (action === "new_order") {
      // For new order, we may have data from request or need to fetch
      let name = customerName;
      let phone = customerPhone;
      let amount = totalAmount;
      let number = orderNumber;


      // If not provided, fetch from ERP
      let erpOrderId: string | undefined = undefined;
      if (!name || !phone || !amount || !number) {
        const order = await getOrderByToken(token);
        if (order) {
          name = name || order.partner.name;
          phone = phone || order.partner.phone;
          amount = amount || Number(order.totalAmount);
          number = number || order.orderNumber;
          erpOrderId = order.id;
        }
      } else {
        // If all fields provided, still try to get erpOrderId
        const order = await getOrderByToken(token);
        if (order) {
          erpOrderId = order.id;
        }
      }

      if (!name || !phone || !amount || !number || !erpOrderId) {
        return res.status(400).json({
          error: "Missing data",
          message: "Could not determine order details for notification",
        });
      }

      await notifyAdminNewOrder({
        adminWhatsapp,
        orderNumber: number,
        customerName: name,
        customerPhone: phone,
        totalAmount: amount,
        orderUrl,
        erpOrderId,
      });

      return res.status(200).json({
        success: true,
        message: "Notifikasi pesanan baru terkirim ke admin",
      });
    }

    if (action === "payment_claimed") {
      // Fetch order for details
      const order = await getOrderByToken(token);
      if (!order) {
        return res.status(404).json({
          error: "Not Found",
          message: "Pesanan tidak ditemukan",
        });
      }

      await notifyAdminPaymentClaimed({
        adminWhatsapp,
        orderNumber: order.orderNumber,
        customerName: order.partner.name,
        paymentMethod: paymentMethod || order.paymentMethod || "unknown",
        orderUrl,
      });

      return res.status(200).json({
        success: true,
        message: "Notifikasi pembayaran claimed terkirim ke admin",
      });
    }

    return res.status(400).json({
      error: "Invalid action",
      message: "Action tidak dikenali",
    });
  } catch (error: unknown) {
    console.error("Failed to send admin notification:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengirim notifikasi";

    return res.status(500).json({
      error: "Notification Failed",
      message,
    });
  }
};
