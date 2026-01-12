import type { Request, Response } from "express";
import { z } from "zod";
import { BotSession } from "../bot/session";
import { formatPhoneNumber, isValidIndonesianNumber } from "../utils/phone";

const SendMessageSchema = z.object({
  phone: z.string(),
  message: z.string(),
});

export const sendMessage = async (req: Request, res: Response) => {
  // 1. Validate Payload
  const result = SendMessageSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  const { phone, message } = result.data;

  // 2. Validate Phone Number
  if (!isValidIndonesianNumber(phone)) {
    return res.status(400).json({
      error: "Invalid Phone Number",
      message: "Nomor WhatsApp tidak valid (Gunakan format 08... atau 62...)",
    });
  }

  // 3. Check Bot Status
  const session = BotSession.getInstance();
  if (session.getStatus() !== "READY") {
    return res.status(503).json({
      error: "Service Unavailable",
      message: "Bot WhatsApp belum siap. Hubungi admin.",
    });
  }

  const client = session.getClient();
  if (!client) {
    return res
      .status(500)
      .json({ error: "Internal Error: Client instance missing" });
  }

  // 4. Send Message
  const targetNumber = formatPhoneNumber(phone);

  try {
    const response = await client.sendMessage(targetNumber, message);

    // Log success
    console.log(`Message sent to ${targetNumber}`);

    return res.status(200).json({
      success: true,
      messageId: response.id._serialized,
    });
  } catch (error: unknown) {
    console.error("Failed to send message:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengirim pesan WhatsApp";

    return res.status(500).json({
      error: "Delivery Failed",
      message: errorMessage,
    });
  }
};
