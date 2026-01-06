import type { Request, Response } from "express";
import { OrderPayloadSchema } from "../types/order";
import { BotSession } from "../bot/session";
import { formatOrderMessage } from "../utils/formatter";
import { formatPhoneNumber, isValidIndonesianNumber } from "../utils/phone";

export const sendOrder = async (req: Request, res: Response) => {
  // 1. Validate Payload
  const result = OrderPayloadSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.issues,
    });
  }

  const payload = result.data;

  // 2. Validate Phone Number
  if (!isValidIndonesianNumber(payload.customerWhatsapp)) {
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

  // 4. Format Message & Target
  const targetNumber = formatPhoneNumber(payload.customerWhatsapp);
  const message = formatOrderMessage(payload);

  try {
    const { MessageMedia } = await import("whatsapp-web.js");
    const { generateQrisDynamic, generateQrisImageBase64 } = await import(
      "../utils/qris"
    );

    // 5. Generate QRIS Dynamic (only if payment method is QRIS)
    const staticPayload = process.env.QRIS_STATIC_PAYLOAD || "";
    let media: any = null;
    let finalMessage = message;

    if (payload.paymentMethod === "qris" && staticPayload) {
      try {
        const qrisPayload = await generateQrisDynamic(
          staticPayload,
          payload.totalPrice
        );
        const qrisBase64 = await generateQrisImageBase64(qrisPayload);
        media = new MessageMedia(
          "image/png",
          qrisBase64,
          "qris-pembayaran.png"
        );
        finalMessage +=
          "\n\n📱 *Silakan scan QR Code di atas untuk pembayaran.*";
      } catch (err) {
        console.error("Failed to generate QRIS:", err);
      }
    } else if (payload.paymentMethod === "transfer") {
      // Add bank transfer details
      finalMessage += "\n\n🏦 *Pembayaran via Transfer Bank:*";
      finalMessage += "\n• BCA: 1234567890 a.n. Santi Mebel";
      finalMessage += "\n• Mandiri: 0987654321 a.n. Santi Mebel";
      finalMessage +=
        "\n\n_Mohon konfirmasi setelah transfer dengan mengirim bukti pembayaran._";
    }

    // 6. Send Message (Media or Text)
    let response: any;
    if (media) {
      response = await client.sendMessage(targetNumber, media, {
        caption: finalMessage,
      });
    } else {
      response = await client.sendMessage(targetNumber, finalMessage);
    }

    // Log success
    console.log(
      `Order sent to ${targetNumber} (Payment: ${payload.paymentMethod})`
    );

    return res.status(200).json({
      success: true,
      messageId: response.id._serialized,
    });
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return res.status(500).json({
      error: "Delivery Failed",
      message: error.message || "Gagal mengirim pesan WhatsApp",
    });
  }
};
