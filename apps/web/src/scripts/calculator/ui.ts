/**
 * Calculator UI Updates
 * DOM manipulation and result panel rendering
 */

import config from "@/data/config.json";
import { getStateRef, getElements } from "./state";

/**
 * Update quantity display for a specific item
 */
export function updateQuantityDisplay(id: string): void {
  const state = getStateRef();

  const qtyEl = document.querySelector(
    `.cart-item-qty[data-id="${id}"]`,
  ) as HTMLElement;

  if (qtyEl) {
    const item = state.items.find((i) => i.id === id);
    qtyEl.textContent = item ? String(item.quantity) : "0";

    const cartItem = qtyEl.closest(".cart-item");
    if (cartItem) {
      if (item && item.quantity > 0) {
        cartItem.classList.add("is-selected");
      } else {
        cartItem.classList.remove("is-selected");
      }
    }
  }
}

/**
 * Update total quantity display
 */
export function updateTotalQuantityDisplay(): void {
  const state = getStateRef();
  const elements = getElements();

  const el = elements.cartTotalQty as HTMLElement;
  if (el) {
    el.textContent = `${state.totalQuantity} unit`;
  }
}

/**
 * Update stepper button states (disable at max)
 */
export function updateStepperButtons(): void {
  const state = getStateRef();

  const plusButtons = document.querySelectorAll(
    ".btn-plus",
  ) as NodeListOf<HTMLButtonElement>;

  const currentMattressQty = state.items
    .filter((i) => i.category !== "accessory")
    .reduce((sum, i) => sum + i.quantity, 0);

  const atMaxMattress = currentMattressQty >= config.maxQuantity;

  plusButtons.forEach((button) => {
    const category = button.dataset.category;
    if (category !== "accessory") {
      button.disabled = atMaxMattress;
    } else {
      button.disabled = false;
    }
  });
}

/**
 * Update result panel with current state
 */
export function updateResultPanel(): void {
  const state = getStateRef();
  const elements = getElements();

  // Mattress list
  const mattressEl = elements.resultMattress?.querySelector(".result-value");
  if (mattressEl) {
    if (state.items.length === 0) {
      mattressEl.textContent = "-";
    } else if (state.items.length === 1) {
      mattressEl.textContent = state.items[0].name;
    } else {
      mattressEl.textContent = `${state.items.length} jenis`;
    }
  }

  // Quantity
  const quantityEl = elements.resultQuantity?.querySelector(".result-value");
  if (quantityEl) {
    quantityEl.textContent = `${state.totalQuantity} unit`;
  }

  // Duration
  const durationEl = elements.resultDuration?.querySelector(".result-value");
  if (durationEl) {
    durationEl.textContent = `${state.duration} hari`;
  }

  // Dates
  const datesEl = elements.resultDates?.querySelector(".result-value");
  if (datesEl) {
    if (state.startDate && state.endDate) {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      };
      datesEl.textContent = `${formatDate(state.startDate)} - ${formatDate(
        state.endDate,
      )}`;
    } else {
      datesEl.textContent = "-";
    }
  }

  // Total
  const totalEl = elements.resultTotal?.querySelector(".result-value");
  if (totalEl) {
    const formatted = new Intl.NumberFormat("id-ID").format(state.total);
    totalEl.textContent = `Rp ${formatted}`;
  }

  // Delivery estimate
  const deliveryEl = elements.resultDelivery?.querySelector(".delivery-text");
  if (deliveryEl) {
    deliveryEl.textContent = state.deliveryEstimate;
  }

  // Delivery Fee & Distance
  const deliveryFeeEl = document.getElementById("resultDeliveryFee");
  const deliveryDistanceEl = document.getElementById("deliveryDistance");

  if (deliveryFeeEl) {
    const valEl = deliveryFeeEl.querySelector(".result-value");
    if (valEl) {
      if (state.distance > 0) {
        valEl.textContent = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(state.deliveryFee);
        deliveryFeeEl.classList.remove("hidden");
      } else {
        valEl.textContent = "-";
      }
    }
  }
  if (deliveryDistanceEl) {
    deliveryDistanceEl.textContent =
      state.distance > 0 ? `(${state.distance.toFixed(1)} km)` : "";
  }

  // Volume Discount Display
  const volumeDiscountEl = document.getElementById("resultVolumeDiscount");
  if (volumeDiscountEl) {
    const valEl = volumeDiscountEl.querySelector(".result-value");
    const labelEl = document.getElementById("volumeDiscountLabel");

    if (state.volumeDiscountAmount > 0) {
      if (valEl) {
        valEl.textContent = `-Rp ${new Intl.NumberFormat("id-ID").format(
          state.volumeDiscountAmount,
        )}`;
      }
      if (labelEl) {
        labelEl.textContent = state.volumeDiscountLabel
          ? `(${state.volumeDiscountLabel})`
          : "";
      }
      volumeDiscountEl.style.display = "flex";
    } else {
      volumeDiscountEl.style.display = "none";
    }
  }

  // Next Tier Upsell Prompt
  const upsellPromptEl = document.getElementById("upsellPrompt");
  if (upsellPromptEl) {
    if (state.nextTierUnitsNeeded > 0 && state.nextTierDiscountPercent > 0) {
      upsellPromptEl.innerHTML = `💡 Tambah <strong>${state.nextTierUnitsNeeded} unit</strong> lagi untuk diskon <strong>${state.nextTierDiscountPercent}%</strong>!`;
      upsellPromptEl.style.display = "block";
    } else {
      upsellPromptEl.style.display = "none";
    }
  }
}
