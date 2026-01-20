import type { Request, Response } from "express";
import crypto from "crypto";

// import midtransClient from "midtrans-client";

// Initialize Snap API client (for helper verification if needed, but manual signature check is better)
// const apiClient = new midtransClient.Snap({
//   isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
//   serverKey: process.env.MIDTRANS_SERVER_KEY || "",
//   clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
// });

export const midtransWebhook = async (req: Request, res: Response) => {
  try {
    const notification = req.body;

    // 1. Validate Signature
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    const inputString = orderId + statusCode + grossAmount + serverKey;
    const signatureKey = crypto
      .createHash("sha512")
      .update(inputString)
      .digest("hex");

    if (signatureKey !== notification.signature_key) {
      console.warn(`[Midtrans Webhook] Invalid signature for order ${orderId}`);
      res.status(403).json({ message: "Invalid signature" });
      return;
    }

    // 2. Process Status
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    // eslint-disable-next-line no-console
    console.log(
      `[Midtrans Webhook] Processing ${orderId}: ${transactionStatus}`,
    );

    // Extract real Order Number (remove timestamp if present from retries: RNT-123-16782392)
    // Format: RNT-XXXX-TIMESTAMP or just RNT-XXXX
    // But erp-client expects the token? or the order ID?
    // confirmPayment takes a TOKEN. updateRentalOrderStatus takes an ERP ID?
    // Wait, the order details from sync-erp need to be looked up first to get the Token/ID.

    // BUT! We can just update via the order number if we have an endpoint for it, OR we fetch the order first.
    // Let's assume we need to implement `getOrderByNumber` or `updateOrderByNumber` in erp-client.
    // For now, let's parse the Order Number.

    // const [prefix] = orderId.split("-");
    // If format RNT-DATE-SEQ-TIMESTAMP, it's safer to rely on "order_id" as the key.
    // However, our internal OrderNumber is likely RNT-YYYYMMDD-SEQ.
    // So if appended with timestamp: RNT-YYYYMMDD-SEQ-TIMESTAMP

    // Let's look up the order by the `order_id` passed to Midtrans.
    // Wait, we stored `orderNumber` + timestamp in Midtrans `order_id`.

    // We need a way to find the RentalOrder by `orderNumber`.
    // erp-client has generic helpers?

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        // Challenge: Payment needs manual review
        console.warn(
          `[Midtrans Webhook] Order ${orderId} flagged for review (fraud_status: challenge)`,
        );
        // Notify admin for manual review
        await handleChallenge(orderId, notification);
      } else if (fraudStatus == "accept") {
        // Credit card success
        await handleSuccess(orderId, notification);
      }
    } else if (transactionStatus == "settlement") {
      // Success (QRIS, VA, etc)
      await handleSuccess(orderId, notification);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      await handleFailure(orderId, transactionStatus);
    } else if (transactionStatus == "pending") {
      // Waiting for payment
    }

    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error("[Midtrans Webhook] Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
}

async function handleSuccess(
  midtransOrderId: string,
  notification: MidtransNotification,
) {
  // Extract base order number (remove suffix if any)
  // Format: RNT-XXXX-TIMESTAMP or just RNT-XXXX
  const parts = midtransOrderId.split("-");

  // Assuming standard format RNT-XXXXXX (or similar)
  // If we appended a timestamp, it would be RNT-XXXXXX-TIMESTAMP
  // Standard Order Number is likely "RNT-" + digits.
  // Let's try to reconstruct or parse.
  // Safety: We can pass the full midtransOrderId if that's what we stored?
  // No, we stored `orderNumber + "-" + timestamp`.
  // So we should take everything BEFORE the last dash if it looks like a timestamp?
  // Or just pass the extracted parts.

  // Robust extraction: RNT-000001 (len 10) + - + TIMESTAMP
  // Let's look for "RNT-" prefix.

  // However, simpler approach:
  // If we sent `${order.orderNumber}-${scale}`
  // We can just try to find by `orderNumber` which is `RNT-XXXXXX`.
  // So we strip the last part if there are > 2 parts?
  // RNT-0001 (2 parts). RNT-0001-123123 (3 parts).

  let orderNumber = midtransOrderId;
  if (parts.length > 2) {
    // Remove the last part (timestamp)
    // const [orderId] = parts;
    // const timestamp = parts.pop();
    orderNumber = parts.join("-");
  }

  // eslint-disable-next-line no-console
  console.log(
    `[Midtrans Webhook] Confirming Order: ${orderNumber} (Midtrans ID: ${midtransOrderId})`,
  );

  try {
    const { confirmPaymentByOrderNumber } =
      await import("../services/erp-client");
    await confirmPaymentByOrderNumber({
      orderNumber,
      paymentMethod: notification.payment_type || "qris",
      transactionId: notification.transaction_id,
      amount: parseFloat(notification.gross_amount),
    });
    // eslint-disable-next-line no-console
    console.log(
      `[Midtrans Webhook] Successfully confirmed order ${orderNumber}`,
    );
  } catch (e) {
    console.error(
      `[Midtrans Webhook] Failed to confirm order ${orderNumber}`,
      e,
    );
    throw e; // rethrow to ensure we return 500 if critical? OR return 200 but log error?
    // Midtrans retries on non-200. We should retry.
  }
}

async function handleFailure(midtransOrderId: string, reason: string) {
  console.warn(`[Midtrans Webhook] Order ${midtransOrderId} failed: ${reason}`);
  // Optional: Update status to FAILED or CANCELLED in DB
}

async function handleChallenge(
  midtransOrderId: string,
  notification: MidtransNotification,
) {
  console.warn(
    `[Midtrans Webhook] FRAUD CHALLENGE for order ${midtransOrderId}`,
  );

  try {
    // Notify admin via WhatsApp
    const { botClient } = await import("../services/bot-client");
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "62895601968858";

    const message = `⚠️ *PERHATIAN: PEMBAYARAN PERLU REVIEW*

Order ID: ${midtransOrderId}
Status: ${notification.transaction_status}
Fraud Status: ${notification.fraud_status}
Payment Type: ${notification.payment_type}
Amount: Rp ${Number(notification.gross_amount).toLocaleString("id-ID")}

Silakan cek dashboard Midtrans untuk approve/deny transaksi ini.`;

    await botClient.bot.sendMessage.mutate({
      phone: adminPhone,
      message,
    });

    // eslint-disable-next-line no-console
    console.log(
      `[Midtrans Webhook] Challenge notification sent to admin for order ${midtransOrderId}`,
    );
  } catch (e) {
    console.error(
      `[Midtrans Webhook] Failed to notify admin about challenge for ${midtransOrderId}`,
      e,
    );
    // Don't throw - we still want to return 200 to Midtrans
  }
}
