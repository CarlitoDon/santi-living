/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  saveOrder,
  getOrder,
  setPaymentMethod,
  getPaymentMethod,
  clearOrder,
  hasOrder,
} from "./checkout-session";
import type { OrderPayload } from "@/types/order";

// ============================================================
// Fixtures
// ============================================================

const mockOrder: OrderPayload = {
  customerName: "John Doe",
  customerWhatsapp: "08123456789",
  deliveryAddress: "Jl. Merdeka No. 1, Yogyakarta",
  items: [
    {
      id: "pkg-single",
      name: "Paket Single",
      category: "package",
      quantity: 2,
      pricePerDay: 35000,
    },
  ],
  totalPrice: 210000,
  orderDate: "2026-03-05",
  endDate: "2026-03-08",
  duration: 3,
  deliveryFee: 14000,
  paymentMethod: "qris",
};

// ============================================================
// Checkout Session
// ============================================================

describe("checkout-session", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("saveOrder / getOrder", () => {
    it("returns null when no session exists", () => {
      expect(getOrder()).toBeNull();
    });

    it("saves and retrieves order data", () => {
      saveOrder(mockOrder);
      const session = getOrder();

      expect(session).not.toBeNull();
      expect(session!.order.customerName).toBe("John Doe");
      expect(session!.order.totalPrice).toBe(210000);
      expect(session!.order.items).toHaveLength(1);
      expect(session!.createdAt).toBeDefined();
    });

    it("preserves all order fields through save/load cycle", () => {
      saveOrder(mockOrder);
      const session = getOrder();

      expect(session!.order.customerWhatsapp).toBe("08123456789");
      expect(session!.order.deliveryAddress).toBe(
        "Jl. Merdeka No. 1, Yogyakarta",
      );
      expect(session!.order.duration).toBe(3);
      expect(session!.order.deliveryFee).toBe(14000);
      expect(session!.order.paymentMethod).toBe("qris");
    });
  });

  describe("setPaymentMethod / getPaymentMethod", () => {
    it("updates payment method on existing session", () => {
      saveOrder(mockOrder);
      setPaymentMethod("bca");

      const method = getPaymentMethod();
      expect(method).toBe("bca");
    });

    it("returns undefined when no session", () => {
      expect(getPaymentMethod()).toBeUndefined();
    });

    it("does nothing when no session exists", () => {
      setPaymentMethod("gopay");
      expect(getOrder()).toBeNull();
    });
  });

  describe("clearOrder", () => {
    it("removes order from session", () => {
      saveOrder(mockOrder);
      expect(hasOrder()).toBe(true);

      clearOrder();
      expect(hasOrder()).toBe(false);
      expect(getOrder()).toBeNull();
    });
  });

  describe("hasOrder", () => {
    it("returns false when empty", () => {
      expect(hasOrder()).toBe(false);
    });

    it("returns true when order exists", () => {
      saveOrder(mockOrder);
      expect(hasOrder()).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles corrupted session data gracefully", () => {
      sessionStorage.setItem("santi-living-checkout", "not-valid-json");
      expect(getOrder()).toBeNull();
    });
  });
});
