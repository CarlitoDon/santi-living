import type { Request, Response } from "express";
import { z } from "zod";
import { confirmPayment as confirmPaymentErp } from "../services/erp-client";

const ConfirmPaymentSchema = z.object({
  paymentMethod: z.enum(["qris", "transfer"]),
  reference: z.string().optional(),
});

export const confirmPayment = async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  // Validate body
  const result = ConfirmPaymentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  try {
    const confirmation = await confirmPaymentErp({
      token,
      paymentMethod: result.data.paymentMethod,
      reference: result.data.reference,
    });

    return res.json(confirmation);
  } catch (error: unknown) {
    console.error("Failed to confirm payment:", error);
    const message =
      error instanceof Error ? error.message : "Gagal konfirmasi pembayaran";

    // Map specific errors
    if (message.includes("Order not found")) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (message.includes("Cannot confirm payment")) {
      return res.status(400).json({ error: message });
    }

    return res.status(500).json({
      error: "Server Error",
      message,
    });
  }
};
