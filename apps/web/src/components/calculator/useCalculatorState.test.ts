/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalculatorState } from "./useCalculatorState";
import type { CartItem } from "./types";

// ============================================================
// Fixtures
// ============================================================

const mattressItem: Omit<CartItem, "quantity"> = {
  id: "pkg-single",
  name: "Paket Single",
  category: "package",
  pricePerDay: 35000,
  includes: ["kasur busa", "sprei", "bantal", "selimut"],
};

const mattressItem2: Omit<CartItem, "quantity"> = {
  id: "pkg-queen",
  name: "Paket Queen",
  category: "package",
  pricePerDay: 55000,
};

const accessoryItem: Omit<CartItem, "quantity"> = {
  id: "acc-pillow",
  name: "Bantal Extra",
  category: "accessory",
  pricePerDay: 5000,
};

// ============================================================
// useCalculatorState
// ============================================================

describe("useCalculatorState", () => {
  it("starts with empty cart and zero totals", () => {
    const { result } = renderHook(() => useCalculatorState());

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.totalQuantity).toBe(0);
    expect(result.current.state.subtotal).toBe(0);
    expect(result.current.state.total).toBe(0);
    expect(result.current.state.duration).toBe(1);
  });

  it("addItem adds new item with quantity 1", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
    });

    // Need to trigger recalculation by reading state after act
    const item = result.current.state.items.find(
      (i) => i.id === mattressItem.id,
    );
    expect(item).toBeDefined();
    expect(item!.quantity).toBe(1);
  });

  it("addItem same item increments quantity", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
    });
    act(() => {
      result.current.addItem(mattressItem);
    });

    const item = result.current.state.items.find(
      (i) => i.id === mattressItem.id,
    );
    expect(item!.quantity).toBe(2);
  });

  it("removeItem decrements quantity", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
      result.current.addItem(mattressItem);
    });
    act(() => {
      result.current.removeItem(mattressItem.id);
    });

    const item = result.current.state.items.find(
      (i) => i.id === mattressItem.id,
    );
    expect(item!.quantity).toBe(1);
  });

  it("removeItem removes item at quantity 1", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
    });
    act(() => {
      result.current.removeItem(mattressItem.id);
    });

    expect(result.current.state.items).toHaveLength(0);
  });

  it("setDuration updates duration and triggers recalculation", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
    });
    act(() => {
      result.current.setDuration(3);
    });

    expect(result.current.state.duration).toBe(3);
    // Subtotal should reflect: 1 × 35000 × 3 = 105000
    expect(result.current.state.subtotal).toBe(105000);
  });

  it("setDeliveryFee adds delivery cost to total", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
    });
    act(() => {
      result.current.setDeliveryFee(14000, 5);
    });

    expect(result.current.state.deliveryFee).toBe(14000);
    expect(result.current.state.distance).toBe(5);
    // Total = subtotal (35000) + delivery (14000) = 49000
    expect(result.current.state.total).toBe(49000);
  });

  it("setStartDate updates endDate", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.setDuration(3);
    });
    act(() => {
      result.current.setStartDate("2026-06-01");
    });

    expect(result.current.state.startDate).toBe("2026-06-01");
    expect(result.current.state.endDate).toBe("2026-06-04");
  });

  it("calculates mixed cart (mattress + accessory) correctly", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem); // 35000/day
      result.current.addItem(accessoryItem); // 5000/day
    });
    act(() => {
      result.current.setDuration(2);
    });

    // Mattress: 1 × 35000 × 2 = 70000
    // Accessory: 1 × 5000 × 2 = 10000
    // Total: 80000
    expect(result.current.state.subtotal).toBe(80000);
    expect(result.current.state.total).toBe(80000);
  });

  it("setError and clearError manage error state", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.setError("name", "Nama wajib diisi");
    });

    expect(result.current.state.errors["name"]).toBe("Nama wajib diisi");

    act(() => {
      result.current.clearError("name");
    });

    expect(result.current.state.errors["name"]).toBeUndefined();
  });

  it("getItemQuantity returns correct quantity", () => {
    const { result } = renderHook(() => useCalculatorState());

    act(() => {
      result.current.addItem(mattressItem);
      result.current.addItem(mattressItem);
    });

    expect(result.current.getItemQuantity(mattressItem.id)).toBe(2);
    expect(result.current.getItemQuantity("nonexistent")).toBe(0);
  });
});
