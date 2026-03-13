import type { Request, Response } from "express";
import { botClient } from "../services/bot-client";
import { getOrderByToken, deleteRentalOrder } from "../services/erp-client";
import { retryWithBackoff } from "../utils/retry";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Check if an error is permanent (should NOT be retried).
 * Invalid phone numbers, validation errors, etc.
 */
const isPermanentError = (error: unknown): boolean => {
  const msg = (
    error instanceof Error ? error.message : String(error)
  ).toLowerCase();
  return (
    msg.includes("invalid") ||
    msg.includes("not registered") ||
    msg.includes("bad_request") ||
    msg.includes("tidak valid") ||
    msg.includes("tidak terdaftar")
  );
};

/**
 * Send detailed order notification to customer via bot sendOrder.
 * Wrapped with retry for transient failures.
 */
async function sendCustomerOrderNotification(
  token: string,
  customerName: string,
  customerPhone: string,
  orderNumber: string,
): Promise<{ order: any; method: "detailed" | "simple" }> {
  // Fetch full order details (also retried as part of the outer retry)
  const order = await getOrderByToken(token);

  if (!order) {
    throw new Error("Order not found");
  }

  console.log(
    `[Webhook] Order fetched successfully: ${order.orderNumber}`,
  );

  const startDate = new Date(order.rentalStartDate);
  const endDate = new Date(order.rentalEndDate);
  const duration =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) || 1;

  await botClient.bot.sendOrder.mutate({
    orderId: order.orderNumber,
    customerName: order.partner.name,
    customerWhatsapp: order.partner.phone,
    deliveryAddress:
      (order.deliveryAddress || order.partner.address || "").length < 5
        ? "Alamat belum lengkap (Hubungi Admin)"
        : (order.deliveryAddress || order.partner.address || ""),
    items: order.items.map((item: any, index: number) => ({
      id: item.rentalItemId || item.rentalBundleId || `item-${index}`,
      name: item.name,
      category: "package" as const,
      quantity: item.quantity,
      pricePerDay: Number(item.unitPrice),
    })),
    totalPrice: Number(order.totalAmount),
    orderDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    duration,
    deliveryFee: Number(order.deliveryFee || 0),
    paymentMethod: (order.paymentMethod || "transfer") as "qris" | "transfer" | "gopay",
    volumeDiscountLabel: order.discountLabel || "",
    addressFields: {
      lat: order.latitude?.toString(),
      lng: order.longitude?.toString(),
      street: order.street || undefined,
      kecamatan: order.kecamatan || undefined,
      kota: order.kota || undefined,
    },
    orderUrl: `https://santi-living.com/sewa-kasur/pesanan/${token}`,
  });

  console.log("[Webhook] Bot sendOrder mutation success");
  console.log(
    `[Webhook] Detailed notification sent to customer: ${customerPhone}`,
  );

  return { order, method: "detailed" };
}

/**
 * Send simple fallback message to customer.
 * Used when detailed sendOrder fails with a transient error.
 */
async function sendCustomerSimpleNotification(
  token: string,
  customerName: string,
  customerPhone: string,
  orderNumber: string,
): Promise<void> {
  const publicOrderUrl = `https://santi-living.com/sewa-kasur/pesanan/${token}`;
  const customerMessage = `Halo Kak *${customerName}*! 👋

Ini link untuk melihat status pesanan Kakak:
${publicOrderUrl}

Nomor Pesanan: *${orderNumber}*

Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*! 🙏`;

  await botClient.bot.sendMessage.mutate({
    phone: customerPhone,
    message: customerMessage,
  });

  console.log(
    `[Webhook] Simple notification sent to customer: ${customerPhone}`,
  );
}

export const notifyAdminWebhook = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const { action, orderNumber, customerName, customerPhone, totalAmount } =
    req.body;

  console.log(
    `[Webhook] Received admin notification for order: ${orderNumber}`,
  );

  if (action !== "new_order") {
    res.status(400).json({ message: "Invalid action" });
    return;
  }

  try {
    // ── 1. Notify Admin via WhatsApp ──
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "62895601968858";
    const orderUrl = `https://santi-living.com/admin/orders/${token}`;

    const message = `🔔 *PESANAN BARU DARI WEBSITE*

Nomor: *${orderNumber}*
Customer: ${customerName}
WA: ${customerPhone}
Total: ${formatCurrency(totalAmount)}

Detail customer: ${orderUrl}

⏳ Menunggu pembayaran customer.`;

    await botClient.bot.sendMessage.mutate({
      phone: adminPhone,
      message,
    });

    console.log(`[Webhook] Notification sent to admin: ${adminPhone}`);

    // ── 2. Notify Customer (with retry) ──
    if (customerPhone) {
      try {
        // Try detailed order notification with retry (3 attempts, 2s base delay)
        await retryWithBackoff(
          () =>
            sendCustomerOrderNotification(
              token,
              customerName,
              customerPhone,
              orderNumber,
            ),
          {
            label: "CustomerOrderNotification",
            maxRetries: 3,
            baseDelayMs: 2000,
            maxDelayMs: 15000,
            isPermanentError,
          },
        );
      } catch (err: any) {
        console.warn(
          "[Webhook] Detailed customer notification failed after retries:",
          err.message,
          JSON.stringify(err?.shape || err?.data || {}, null, 2),
        );

        // Check for permanent Invalid Number error → ROLLBACK
        if (isPermanentError(err)) {
          console.error(
            `[Webhook] Invalid WhatsApp number detected for order ${token}. Rolling back...`,
          );

          // Try to get order for rollback
          try {
            const order = await getOrderByToken(token);
            if (order?.id) {
              await deleteRentalOrder(order.id);
              console.log(
                `[Webhook] Order ${token} rolled back successfully.`,
              );
            } else {
              console.error("[Webhook] Cannot rollback: Order ID missing.");
            }
          } catch (rollbackErr) {
            console.error("[Webhook] Failed to rollback order:", rollbackErr);
          }

          res.status(400).json({
            success: false,
            error: "Invalid WhatsApp Number",
            message: "Nomor WhatsApp tidak terdaftar",
          });
          return;
        }

        // Non-permanent error: try simple fallback WITH retry
        try {
          await retryWithBackoff(
            () =>
              sendCustomerSimpleNotification(
                token,
                customerName,
                customerPhone,
                orderNumber,
              ),
            {
              label: "CustomerSimpleFallback",
              maxRetries: 2,
              baseDelayMs: 1500,
              maxDelayMs: 10000,
              isPermanentError,
            },
          );
        } catch (simpleErr) {
          // Log but don't fail the whole webhook — admin was already notified
          console.error(
            "[Webhook] All customer notification attempts failed:",
            simpleErr,
          );

          // Notify admin that customer notification failed
          try {
            await botClient.bot.sendMessage.mutate({
              phone: adminPhone,
              message: `⚠️ *GAGAL KIRIM NOTIFIKASI KE CUSTOMER*\n\nOrder: *${orderNumber}*\nCustomer: ${customerName} (${customerPhone})\n\nNotifikasi admin berhasil, tapi notifikasi ke customer gagal setelah beberapa kali percobaan. Mohon hubungi customer secara manual.`,
            });
          } catch {
            // Last resort: just log
            console.error(
              "[Webhook] Failed to notify admin about customer notification failure",
            );
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[Webhook] Failed to notify admin:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};

export const notifyPaymentStatusWebhook = async (
  req: Request,
  res: Response,
) => {
  const token = req.params.token as string;
  const { action, paymentMethod, paymentReference } = req.body;

  console.log(`[Webhook] Payment status update for ${token}: ${action}`);

  try {
    // 1. Fetch Order Details (with retry for transient DB errors)
    const order = await retryWithBackoff(
      () => getOrderByToken(token),
      {
        label: "FetchOrderForPayment",
        maxRetries: 2,
        baseDelayMs: 1500,
      },
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "62895601968858";
    const customerPhone = order.partner.phone;
    const orderUrl = `https://santi-living.com/admin/orders/${token}`;
    const publicOrderUrl = `https://santi-living.com/sewa-kasur/pesanan/${token}`;

    // 2. Handle "confirmed" (Payment verified/QRIS auto-success)
    if (action === "confirmed") {
      // --- Notify Admin ---
      const adminMsg = `✅ *PEMBAYARAN DITERIMA*
      
Order: *${order.orderNumber}*
Customer: ${order.partner.name}
Total: ${formatCurrency(Number(order.totalAmount))}
Method: ${paymentMethod || order.paymentMethod}
Ref: ${paymentReference || "-"}

Silakan proses pesanan ini:
${orderUrl}`;

      await botClient.bot.sendMessage.mutate({
        phone: adminPhone,
        message: adminMsg,
      });

      // --- Notify Customer (with retry) ---
      if (customerPhone) {
        const customerMsg = `✅ *Pembayaran Berhasil!*

Halo Kak ${order.partner.name}, terima kasih! Pembayaran untuk pesanan *${order.orderNumber}* telah kami terima.

Pesanan Kakak sedang kami proses dan akan segera dikonfirmasi jadwal pengirimannya.

Cek status pesanan:
${publicOrderUrl}

Terima kasih! 🙏`;

        await retryWithBackoff(
          () =>
            botClient.bot.sendMessage.mutate({
              phone: customerPhone,
              message: customerMsg,
            }),
          {
            label: "PaymentConfirmedCustomer",
            maxRetries: 2,
            baseDelayMs: 2000,
            isPermanentError,
          },
        );
      }
    }
    // 3. Handle "claimed" (Manual Transfer Confirmation)
    else if (action === "claimed") {
      // --- Notify Admin ---
      const adminMsg = `💸 *KONFIRMASI PEMBAYARAN BARU*
      
Order: *${order.orderNumber}*
Customer: ${order.partner.name}
Total: ${formatCurrency(Number(order.totalAmount))}
Method: Transfer Manual

Segera cek mutasi & verifikasi:
${orderUrl}`;

      await botClient.bot.sendMessage.mutate({
        phone: adminPhone,
        message: adminMsg,
      });

      // --- Notify Customer (with retry) ---
      if (customerPhone) {
        const customerMsg = `⏳ *Konfirmasi Pembayaran Diterima*

Halo Kak ${order.partner.name}, kami telah menerima konfirmasi pembayaran Kakak.
Admin kami akan segera mengecek mutasi bank. Mohon tunggu sebentar ya! 😊

Cek status:
${publicOrderUrl}`;

        await retryWithBackoff(
          () =>
            botClient.bot.sendMessage.mutate({
              phone: customerPhone,
              message: customerMsg,
            }),
          {
            label: "PaymentClaimedCustomer",
            maxRetries: 2,
            baseDelayMs: 2000,
            isPermanentError,
          },
        );
      }
    }

    res.json({ success: true, processed: true });
  } catch (error) {
    console.error("[Webhook] Failed to process payment notification:", error);
    res.status(500).json({ message: "Internal Error" });
  }
};
