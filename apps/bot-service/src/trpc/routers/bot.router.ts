import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { OrderPayloadSchema } from "../../types/order";
import { BotSession } from "../../bot/session";
import { formatOrderMessage } from "../../utils/formatter";
import { formatPhoneNumber, isValidIndonesianNumber } from "../../utils/phone";
import { TRPCError } from "@trpc/server";

export const botRouter = router({
  /**
   * Send Order Confirmation (Full Details)
   */
  sendOrder: protectedProcedure
    .input(OrderPayloadSchema)
    .mutation(async ({ input }) => {
      // 1. Validate Phone Number
      if (!isValidIndonesianNumber(input.customerWhatsapp)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Nomor WhatsApp tidak valid (Gunakan format 08... atau 62...)",
        });
      }

      // 2. Check Bot Status
      const session = BotSession.getInstance();
      if (session.getStatus() !== "READY") {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Bot WhatsApp belum siap. Hubungi admin.",
        });
      }

      const client = session.getClient();
      if (!client) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error: Client instance missing",
        });
      }

      // 3. Format Message & Target
      const targetNumber = formatPhoneNumber(input.customerWhatsapp);
      const message = formatOrderMessage(input);

      try {
        // 4. Send Message
        const response = await client.sendMessage(targetNumber, message);

        // Log success
        console.log(
          `Order sent to ${targetNumber} (Payment: ${
            input.paymentMethod || "pending"
          })`
        );

        return {
          success: true,
          messageId: response.id._serialized,
        };
      } catch (error: any) {
        console.error("[BotService] ERROR sending message:", error);

        const msg = (error.message || "").toLowerCase();
        if (
          msg.includes("no lid") ||
          msg.includes("invalid") ||
          msg.includes("not registered")
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "[INVALID_PHONE] Nomor WhatsApp tidak terdaftar atau tidak aktif",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Gagal mengirim pesan WhatsApp",
        });
      }
    }),

  /**
   * Send Simple Message
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        phone: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 1. Validate Phone Number
      if (!isValidIndonesianNumber(input.phone)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Nomor WhatsApp tidak valid (Gunakan format 08... atau 62...)",
        });
      }

      // 2. Check Bot Status
      const session = BotSession.getInstance();
      if (session.getStatus() !== "READY") {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Bot WhatsApp belum siap. Hubungi admin.",
        });
      }

      const client = session.getClient();
      if (!client) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error: Client instance missing",
        });
      }

      // 3. Send Message
      const targetNumber = formatPhoneNumber(input.phone);

      try {
        const response = await client.sendMessage(targetNumber, input.message);
        console.log(`Message sent to ${targetNumber}`);

        return {
          success: true,
          messageId: response.id._serialized,
        };
      } catch (error: any) {
        console.error("Failed to send message:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Gagal mengirim pesan WhatsApp",
        });
      }
    }),
});
