import type { Request, Response } from "express";
import { botClient } from "../services/bot-client";
import { getOrderByToken, deleteRentalOrder } from "../services/erp-client";

// Format currency to IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const notifyAdminWebhook = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const { action, orderNumber, customerName, customerPhone, totalAmount } =
    req.body;

  console.log(
    `[Webhook] Received admin notification for order: ${orderNumber}`
  );

  if (action !== "new_order") {
    res.status(400).json({ message: "Invalid action" });
    return;
  }

  try {
    // Notify Admin via WhatsApp
    // TODO: Move admin phone number to env variable
    const adminPhone = process.env.ADMIN_PHONE || "62895601968858";
    const orderUrl = `https://santi-living.com/admin/orders/${token}`;

    // Note: We don't have ERP Order ID here, so skipping that line for now
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

    // Notify Customer
    if (customerPhone) {
      let order: any = null;
      try {
        // Fetch full order details
        order = await getOrderByToken(token);

        if (order) {
          console.log(
            `[Webhook] Order fetched successfully: ${order.orderNumber}`
          );
          console.log(
            "[Webhook] First item keys:",
            Object.keys(order.items[0] || {})
          );
          console.log(
            "[Webhook] First item raw:",
            JSON.stringify(order.items[0])
          );

          const startDate = new Date(order.rentalStartDate);
          const endDate = new Date(order.rentalEndDate);
          const duration =
            Math.round(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            ) || 1;

          const inferCategory = (
            name: string
          ): "package" | "mattress" | "accessory" => {
            const lower = name.toLowerCase();
            if (lower.includes("paket")) return "package";
            if (lower.includes("kasur")) return "mattress";
            return "accessory";
          };

          await botClient.bot.sendOrder.mutate({
            orderId: order.orderNumber,
            customerName: order.partner.name,
            customerWhatsapp: order.partner.phone,
            deliveryAddress:
              (order.deliveryAddress || order.partner.address || "").length < 5
                ? "Alamat belum lengkap (Hubungi Admin)"
                : order.deliveryAddress || order.partner.address,
            // Map optional fields
            items: order.items.map((item: any, index: number) => ({
              // Schema requires ID, but getByToken simplified items might not have it.
              // Use index fallback if needed.
              id: item.rentalItemId || item.rentalBundleId || `item-${index}`,
              name: item.name,
              category: "package", // Default category
              quantity: item.quantity,
              pricePerDay: Number(item.unitPrice),
              includes: [], // Default empty
            })),
            totalPrice: Number(order.totalAmount),
            orderDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            duration,
            deliveryFee: Number(order.deliveryFee || 0),
            paymentMethod: order.paymentMethod || "transfer",
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
            `[Webhook] Detailed notification sent to customer: ${customerPhone}`
          );
        } else {
          throw new Error("Order not found");
        }
      } catch (err: any) {
        console.warn(
          "[Webhook] Failed to notify customer details (Falling back to simple message). Error:",
          err.message,
          // Log detailed validation errors if available (TRPC errors often have data.zodError)
          JSON.stringify(err?.shape || err?.data || {}, null, 2)
        );

        // Check for Invalid Number error and ROLLBACK
        const errorMsg = (err.message || "").toLowerCase();
        if (
          errorMsg.includes("invalid") ||
          errorMsg.includes("not registered") ||
          errorMsg.includes("bad_request") ||
          errorMsg.includes("tidak valid")
        ) {
          console.error(
            `[Webhook] Invalid WhatsApp number detected for order ${token}. Rolling back...`
          );
          if (order && order.id) {
            try {
              // Use top-level import
              await deleteRentalOrder(order.id);
              console.log(`[Webhook] Order ${token} rolled back successfully.`);
            } catch (rollbackErr) {
              console.error("[Webhook] Failed to rollback order:", rollbackErr);
            }
          } else {
            console.error("[Webhook] Cannot rollback: Order ID missing.");
          }
          // IMPORTANT: Return 400 so the caller knows validation failed
          res.status(400).json({ 
             success: false, 
             error: "Invalid WhatsApp Number",
             message: "Nomor WhatsApp tidak terdaftar"
          });
          return;
        } else {
          // Fallback to simple message for NON-validation errors (e.g. timeout)
          const publicOrderUrl = `https://santi-living.com/sewa-kasur/pesanan/${token}`;
          const customerMessage = `Halo Kak *${customerName}*! 👋

Ini link untuk melihat status pesanan Kakak:
${publicOrderUrl}

Nomor Pesanan: *${orderNumber}*

Terima kasih sudah memesan di *Sewa Kasur Jogja by Santi Mebel*! 🙏`;

          try {
            await botClient.bot.sendMessage.mutate({
              phone: customerPhone,
              message: customerMessage,
            });
            console.log(
              `[Webhook] Simple notification sent to customer: ${customerPhone}`
            );
          } catch (simpleErr) {
            console.error(
              "[Webhook] Failed to send simple fallback:",
              simpleErr
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
  res: Response
) => {
  const token = req.params.token as string;
  const { action, paymentReference, failReason } = req.body;

  // Implementation for payment status notification to customer
  // This can be expanded later

  console.log(`[Webhook] Payment status update for ${token}: ${action}`);
  res.json({ success: true, processed: false });
};
