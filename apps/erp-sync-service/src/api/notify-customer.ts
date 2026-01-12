import type { Request, Response } from "express";
import { getOrderByToken } from "../services/erp-client";
import { sendOrderLinkToCustomer } from "../services/wa-notifier";

export const notifyCustomer = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token || token.length < 10) {
    return res.status(400).json({
      error: "Invalid token",
      message: "Token pesanan tidak valid",
    });
  }

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
    const baseUrl = process.env.PUBLIC_BASE_URL || "https://santi-living.com";
    const orderUrl = `${baseUrl}/sewa-kasur/pesanan/${token}`;

    // 3. Send WA notification
    await sendOrderLinkToCustomer({
      customerWhatsapp: order.partner.phone,
      orderNumber: order.orderNumber,
      orderUrl,
      customerName: order.partner.name,
    });

    return res.status(200).json({
      success: true,
      message: "Notifikasi berhasil dikirim ke customer",
    });
  } catch (error: unknown) {
    console.error("Failed to notify customer:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengirim notifikasi";
    return res.status(500).json({
      error: "Notification Failed",
      message,
    });
  }
};
