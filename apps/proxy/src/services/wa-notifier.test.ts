import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendOrderConfirmation,
  sendOrderLinkToCustomer,
  notifyPaymentConfirmed,
  notifyPaymentRejected,
  notifyAdminNewOrder,
  notifyAdminPaymentClaimed,
} from "./wa-notifier";

// ============================================================
// Mock botClient
// ============================================================

const mockSendOrder = vi.fn();
const mockSendMessage = vi.fn();

vi.mock("./bot-client", () => ({
  botClient: {
    bot: {
      sendOrder: { mutate: (...args: unknown[]) => mockSendOrder(...args) },
      sendMessage: { mutate: (...args: unknown[]) => mockSendMessage(...args) },
    },
  },
}));

// ============================================================
// Fixtures
// ============================================================

const orderPayload = {
  orderId: "ORD-001",
  customerName: "Budi Santoso",
  customerWhatsapp: "08123456789",
  deliveryAddress: "Jl. Malioboro No. 1, Yogyakarta",
  items: [
    {
      id: "pkg-single",
      name: "Paket Single",
      category: "package" as const,
      quantity: 2,
      pricePerDay: 35000,
    },
  ],
  totalPrice: 210000,
  orderDate: "2026-03-05",
  endDate: "2026-03-08",
  duration: 3,
  deliveryFee: 14000,
  paymentMethod: "qris" as const,
  orderUrl: "https://santiliving.com/pesanan/abc-123",
};

// ============================================================
// Tests
// ============================================================

describe("wa-notifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendOrder.mockResolvedValue({ success: true });
    mockSendMessage.mockResolvedValue({ success: true });
  });

  // --- sendOrderConfirmation ---

  describe("sendOrderConfirmation", () => {
    it("calls botClient.bot.sendOrder.mutate with payload", async () => {
      await sendOrderConfirmation(orderPayload);
      expect(mockSendOrder).toHaveBeenCalledWith(orderPayload);
    });

    it("retries on transient failure then succeeds", async () => {
      mockSendOrder
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true });

      const result = await sendOrderConfirmation(orderPayload);
      expect(result).toEqual({ success: true });
      expect(mockSendOrder).toHaveBeenCalledTimes(2);
    });

    it("does NOT retry on invalid number (400)", async () => {
      mockSendOrder.mockRejectedValue(
        new Error("Nomor WhatsApp tidak valid"),
      );

      await expect(sendOrderConfirmation(orderPayload)).rejects.toThrow(
        "Nomor WhatsApp",
      );
      expect(mockSendOrder).toHaveBeenCalledTimes(1); // No retry
    });

    it("gives up after max retries", async () => {
      mockSendOrder.mockRejectedValue(new Error("Server down"));

      await expect(sendOrderConfirmation(orderPayload)).rejects.toThrow(
        "Server down",
      );
      expect(mockSendOrder).toHaveBeenCalledTimes(3); // 3 attempts
    }, 15000); // Longer timeout for retry delays
  });

  // --- sendOrderLinkToCustomer ---

  describe("sendOrderLinkToCustomer", () => {
    it("sends message with customer name and order URL", async () => {
      await sendOrderLinkToCustomer({
        customerWhatsapp: "08123456789",
        customerName: "Budi",
        orderNumber: "ORD-001",
        orderUrl: "https://santiliving.com/pesanan/abc-123",
      });

      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      const args = mockSendMessage.mock.calls[0];
      expect(args[0].phone).toBe("08123456789");
      expect(args[0].message).toContain("Budi");
      expect(args[0].message).toContain("ORD-001");
      expect(args[0].message).toContain("https://santiliving.com/pesanan/abc-123");
    });
  });

  // --- notifyPaymentConfirmed ---

  describe("notifyPaymentConfirmed", () => {
    it("sends confirmation message with order details", async () => {
      await notifyPaymentConfirmed({
        customerWhatsapp: "08123456789",
        customerName: "Budi",
        orderNumber: "ORD-001",
        orderUrl: "https://example.com/order",
      });

      const msg = mockSendMessage.mock.calls[0][0].message;
      expect(msg).toContain("DIKONFIRMASI");
      expect(msg).toContain("Budi");
      expect(msg).toContain("ORD-001");
    });

    it("includes payment reference when provided", async () => {
      await notifyPaymentConfirmed({
        customerWhatsapp: "08123456789",
        customerName: "Budi",
        orderNumber: "ORD-001",
        orderUrl: "https://example.com/order",
        paymentReference: "TXN-ABC-123",
      });

      const msg = mockSendMessage.mock.calls[0][0].message;
      expect(msg).toContain("TXN-ABC-123");
    });
  });

  // --- notifyPaymentRejected ---

  describe("notifyPaymentRejected", () => {
    it("sends rejection message", async () => {
      await notifyPaymentRejected({
        customerWhatsapp: "08123456789",
        customerName: "Budi",
        orderNumber: "ORD-001",
        orderUrl: "https://example.com/order",
      });

      const msg = mockSendMessage.mock.calls[0][0].message;
      expect(msg).toContain("belum dapat kami verifikasi");
      expect(msg).toContain("ORD-001");
    });

    it("includes fail reason when provided", async () => {
      await notifyPaymentRejected({
        customerWhatsapp: "08123456789",
        customerName: "Budi",
        orderNumber: "ORD-001",
        orderUrl: "https://example.com/order",
        failReason: "Jumlah transfer tidak sesuai",
      });

      const msg = mockSendMessage.mock.calls[0][0].message;
      expect(msg).toContain("Jumlah transfer tidak sesuai");
    });
  });

  // --- notifyAdminNewOrder ---

  describe("notifyAdminNewOrder", () => {
    it("sends admin notification with formatted amount", async () => {
      await notifyAdminNewOrder({
        adminWhatsapp: "08198765432",
        orderNumber: "ORD-001",
        customerName: "Budi",
        customerPhone: "08123456789",
        totalAmount: 210000,
        orderUrl: "https://santiliving.com/pesanan/abc-123",
        erpOrderId: "erp-order-xyz",
      });

      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      const args = mockSendMessage.mock.calls[0];
      expect(args[0].phone).toBe("08198765432");
      expect(args[0].message).toContain("PESANAN BARU");
      expect(args[0].message).toContain("ORD-001");
      expect(args[0].message).toContain("Budi");
      // Should contain formatted currency (Rp 210.000)
      expect(args[0].message).toMatch(/Rp\s?210\.000/);
      // Should contain ERP link
      expect(args[0].message).toContain("erp-order-xyz");
    });
  });

  // --- notifyAdminPaymentClaimed ---

  describe("notifyAdminPaymentClaimed", () => {
    it("sends payment verification request to admin", async () => {
      await notifyAdminPaymentClaimed({
        adminWhatsapp: "08198765432",
        orderNumber: "ORD-001",
        customerName: "Budi",
        paymentMethod: "transfer",
        orderUrl: "https://example.com/order",
      });

      const msg = mockSendMessage.mock.calls[0][0].message;
      expect(msg).toContain("PEMBAYARAN PERLU VERIFIKASI");
      expect(msg).toContain("ORD-001");
      expect(msg).toContain("TRANSFER"); // uppercased
    });
  });
});
