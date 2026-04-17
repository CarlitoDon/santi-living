/**
 * Calculator State Hook
 * Manages the complete state for the rental calculator
 */

import { useState, useCallback } from "react";
import type { CartItem, CalculatorState } from "./types";
import {
  calculateEndDate,
  calculateDeliveryEstimate,
} from "@/lib/domain/rental";
import {
  calculateVolumeDiscount,
  calculateDurationDiscount,
  calculateTotals,
  type VolumeDiscountConfig,
} from "@/lib/calculator-logic";
import { config } from "@/data/config";

const initialState: CalculatorState = {
  items: [],
  startDate: new Date().toISOString().split("T")[0],
  duration: 1,
  paymentMethod: "qris",
  endDate: null,
  totalQuantity: 0,
  subtotal: 0,
  total: 0,
  deliveryEstimate: "",
  deliveryFee: 0,
  distance: 0,
  volumeDiscountAmount: 0,
  volumeDiscountLabel: "",
  volumeDiscountPercent: 0,
  durationDiscountAmount: 0,
  durationDiscountPercent: 0,
  nextTierUnitsNeeded: 0,
  nextTierDiscountPercent: 0,
  isValid: false,
  errors: {},
};

export function useCalculatorState() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const recalculate = useCallback((updates: Partial<CalculatorState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };

      // Calculate end date
      if (next.startDate) {
        next.endDate = calculateEndDate(next.startDate, next.duration);
      }

      // Calculate totals
      next.totalQuantity = next.items.reduce((sum, i) => sum + i.quantity, 0);

      const mattressQty = next.items
        .filter((i) => i.category !== "accessory")
        .reduce((s, i) => s + i.quantity, 0);

      const {
        percent: volumeDiscountPercent,
        label,
        discount: volumeDiscountRate,
        nextTierUnitsNeeded,
        nextTierDiscountPercent,
      } = calculateVolumeDiscount(mattressQty, config as VolumeDiscountConfig);

      next.volumeDiscountLabel = label;
      next.volumeDiscountPercent = volumeDiscountPercent;
      next.nextTierUnitsNeeded = nextTierUnitsNeeded;
      next.nextTierDiscountPercent = nextTierDiscountPercent;

      const durationDiscount = calculateDurationDiscount(next.duration);
      next.durationDiscountPercent = durationDiscount.percent;

      const totals = calculateTotals(
        next.items,
        next.duration,
        next.deliveryFee || 0,
        volumeDiscountRate,
        durationDiscount.discount,
      );

      next.subtotal = totals.subtotal;
      next.volumeDiscountAmount = totals.discountAmount;
      next.durationDiscountAmount = totals.durationDiscountAmount;
      next.total = totals.total;

      next.deliveryEstimate = calculateDeliveryEstimate(
        next.startDate,
        config.cutoffHour,
      );

      return next;
    });
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">) => {
      setState((prev) => {
        const existing = prev.items.find((i) => i.id === item.id);
        let newItems: CartItem[];

        if (existing) {
          newItems = prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          newItems = [...prev.items, { ...item, quantity: 1 }];
        }

        return { ...prev, items: newItems };
      });
      recalculate({});
    },
    [recalculate],
  );

  const removeItem = useCallback(
    (id: string) => {
      setState((prev) => {
        const existing = prev.items.find((i) => i.id === id);
        if (!existing || existing.quantity <= 0) return prev;

        let newItems: CartItem[];
        if (existing.quantity === 1) {
          newItems = prev.items.filter((i) => i.id !== id);
        } else {
          newItems = prev.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
          );
        }

        return { ...prev, items: newItems };
      });
      recalculate({});
    },
    [recalculate],
  );

  const setDuration = useCallback(
    (duration: number) => {
      recalculate({ duration });
    },
    [recalculate],
  );

  const setStartDate = useCallback(
    (startDate: string) => {
      recalculate({ startDate });
    },
    [recalculate],
  );

  const setDeliveryFee = useCallback(
    (deliveryFee: number, distance: number) => {
      recalculate({ deliveryFee, distance });
    },
    [recalculate],
  );

  const setError = useCallback((field: string, message: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: message },
    }));
  }, []);

  const clearError = useCallback((field: string) => {
    setState((prev) => {
      const { [field]: _removed, ...rest } = prev.errors;
      void _removed;
      return { ...prev, errors: rest };
    });
  }, []);

  const getItemQuantity = useCallback(
    (id: string) => {
      return state.items.find((i) => i.id === id)?.quantity || 0;
    },
    [state.items],
  );

  return {
    state,
    addItem,
    removeItem,
    setDuration,
    setStartDate,
    setDeliveryFee,
    setError,
    clearError,
    getItemQuantity,
    recalculate,
  };
}

export type CalculatorActions = ReturnType<typeof useCalculatorState>;
