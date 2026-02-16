/**
 * Calculator Event Handlers
 * All event handlers for calculator interactions
 */

import config from "@/data/config.json";
import products from "@/data/products.json";
import type { ProductItem } from "@/types";
import {
  getCurrentLocation,
  reverseGeocode,
  calculateDistance,
} from "../geolocation";
import { openMapPicker } from "../map-picker";
import { openModal } from "@/store/modalStore";
import {
  calculateVolumeDiscount,
  calculateTotals,
  calculateDurationDiscount,
  type VolumeDiscountConfig,
} from "@/lib/calculator-logic";
import {
  calculateEndDate,
  calculateDeliveryEstimate,
} from "@/lib/domain/rental";
import { getStateRef, getElements } from "./state";
import {
  showError,
  clearError,
  validateDuration,
  handleFormFieldChange,
  updateValidation,
} from "./validation";
import {
  updateQuantityDisplay,
  updateTotalQuantityDisplay,
  updateStepperButtons,
  updateResultPanel,
} from "./ui";

// Helper to find product by ID
const findProductById = (id: string): ProductItem | undefined => {
  const allItems = [
    ...products.mattressPackages,
    ...products.mattressOnly,
    ...products.accessories,
  ];
  return allItems.find((p) => p.id === id) as ProductItem | undefined;
};

/**
 * Handle increment (+) button
 */
export function handleIncrement(event: Event): void {
  const state = getStateRef();
  const button = event.currentTarget as HTMLButtonElement;
  const id = button.dataset.id || "";
  const name = button.dataset.name || "";
  const category = button.dataset.category as
    | "package"
    | "mattress"
    | "accessory";
  const price = parseInt(button.dataset.price || "0", 10);

  // Check max quantity for mattresses
  if (category !== "accessory") {
    const currentMattressQty = state.items
      .filter((i) => i.category !== "accessory")
      .reduce((sum, i) => sum + i.quantity, 0);

    if (currentMattressQty >= config.maxQuantity) {
      showError(
        "mattressCart",
        `Maksimal ${config.maxQuantity} unit kasur. Hubungi CS untuk pemesanan partai besar.`,
      );
      return;
    }
  } else {
    // Cannot order accessories without mattress
    const currentMattressQty = state.items
      .filter((i) => i.category !== "accessory")
      .reduce((sum, i) => sum + i.quantity, 0);

    if (currentMattressQty === 0) {
      showError(
        "mattressCart",
        "Pilih minimal 1 kasur sebelum menambah aksesoris",
      );
      return;
    }
  }

  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const productData = findProductById(id);
    const includes = productData?.includes;

    state.items.push({
      id,
      name,
      category,
      quantity: 1,
      pricePerDay: price,
      includes,
    });
  }

  clearError("mattressCart");
  updateQuantityDisplay(id);
  updateCalculation();
}

/**
 * Handle decrement (-) button
 */
export function handleDecrement(event: Event): void {
  const state = getStateRef();
  const button = event.currentTarget as HTMLButtonElement;
  const id = button.dataset.id || "";

  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem && existingItem.quantity > 0) {
    existingItem.quantity -= 1;

    if (existingItem.quantity === 0) {
      state.items = state.items.filter((item) => item.id !== id);
    }

    updateQuantityDisplay(id);
    updateCalculation();
  }
}

/**
 * Handle duration change
 */
export function handleDurationChange(event: Event): void {
  const state = getStateRef();
  const target = event.target as HTMLInputElement;
  state.duration = parseInt(target.value, 10) || 1;
  updateCalculation();
}

/**
 * Handle date change
 */
export function handleDateChange(event: Event): void {
  const state = getStateRef();
  const target = event.target as HTMLInputElement;
  const selectedDate = target.value;
  const today = new Date().toISOString().split("T")[0];

  if (selectedDate < today) {
    showError("startDate", "Pilih tanggal hari ini atau setelahnya");
    target.value = today;
    state.startDate = today;
  } else {
    clearError("startDate");
    state.startDate = selectedDate;
  }

  updateCalculation();
}

/**
 * Handle accordion header click
 */
export function handleAccordionClick(event: Event): void {
  const header = event.currentTarget as HTMLElement;
  const item = header.parentElement;

  if (item) {
    const content = item.querySelector(".accordion-content") as HTMLElement;
    const icon = item.querySelector(".accordion-icon") as HTMLElement;
    const isCurrentlyActive = item.classList.contains("active");

    if (isCurrentlyActive) {
      item.classList.remove("active");
      if (content) content.style.display = "none";
      if (icon) icon.textContent = "+";
    } else {
      item.classList.add("active");
      if (content) content.style.display = "block";
      if (icon) icon.textContent = "−";
    }
  }
}

/**
 * Handle payment method toggle
 */
export function handlePaymentMethodToggle(event: Event): void {
  const state = getStateRef();
  const button = event.currentTarget as HTMLButtonElement;
  const value = button.dataset.value as "qris" | "transfer";

  state.paymentMethod = value;

  const paymentButtons = document.querySelectorAll(".payment-option");
  paymentButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}

/**
 * Handle "Show More" items click
 */
export function handleShowMoreClick(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const accordion = button.closest(".accordion-item");

  if (accordion) {
    const largeItems = accordion.querySelectorAll(".is-large-size");
    const isVisible = button.classList.contains("active");

    largeItems.forEach((item) => {
      if (isVisible) {
        item.classList.remove("is-visible");
      } else {
        item.classList.add("is-visible");
      }
    });

    button.classList.toggle("active");
    button.textContent = isVisible
      ? "Lihat Ukuran Lainnya"
      : "Sembunyikan Ukuran Lain";
  }
}

/**
 * Handle map picker button click
 */
export function handleMapPickerClick(): void {
  const elements = getElements();

  openMapPicker({
    onConfirm: (coords, address) => {
      const streetField = elements.addressStreet as HTMLInputElement;
      const kelurahanField = elements.addressKelurahan as HTMLInputElement;
      const kecamatanField = elements.addressKecamatan as HTMLInputElement;
      const kotaField = elements.addressKota as HTMLInputElement;
      const provinsiField = elements.addressProvinsi as HTMLInputElement;
      const zipField = elements.addressZip as HTMLInputElement;
      const latField = elements.addressLat as HTMLInputElement;
      const lngField = elements.addressLng as HTMLInputElement;

      if (streetField) streetField.value = address.street;
      if (kelurahanField) kelurahanField.value = address.kelurahan;
      if (kecamatanField) kecamatanField.value = address.kecamatan;
      if (kotaField) kotaField.value = address.kota;
      if (provinsiField) provinsiField.value = address.provinsi;
      if (zipField) zipField.value = address.postcode;
      if (latField) latField.value = coords.lat.toFixed(6);
      if (lngField) lngField.value = coords.lng.toFixed(6);

      handleFormFieldChange();

      if (coords.lat && coords.lng) {
        updateDeliveryFee(coords.lat, coords.lng);
      }
    },
  });
}

/**
 * Handle location button click
 */
export async function handleLocationClick(): Promise<void> {
  const elements = getElements();
  const button = elements.locationButton as HTMLButtonElement;
  const streetField = elements.addressStreet as HTMLInputElement;

  if (!button || !streetField) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "📍 Mengambil lokasi...";

  try {
    const coords = await getCurrentLocation();

    const latField = elements.addressLat as HTMLInputElement;
    const lngField = elements.addressLng as HTMLInputElement;
    if (latField) latField.value = coords.latitude.toFixed(6);
    if (lngField) lngField.value = coords.longitude.toFixed(6);

    const address = await reverseGeocode(coords);

    streetField.value = address.street;
    const kelurahanField = elements.addressKelurahan as HTMLInputElement;
    const kecamatanField = elements.addressKecamatan as HTMLInputElement;
    const kotaField = elements.addressKota as HTMLInputElement;
    const provinsiField = elements.addressProvinsi as HTMLInputElement;
    const zipField = elements.addressZip as HTMLInputElement;

    if (kelurahanField && address.kelurahan)
      kelurahanField.value = address.kelurahan;
    if (kecamatanField && address.kecamatan)
      kecamatanField.value = address.kecamatan;
    if (kotaField && address.kota) kotaField.value = address.kota;
    if (provinsiField && address.provinsi)
      provinsiField.value = address.provinsi;
    if (zipField && address.postcode) zipField.value = address.postcode;

    handleFormFieldChange();
    updateDeliveryFee(coords.latitude, coords.longitude);

    button.textContent = "✓ Lokasi terisi";
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mendapatkan lokasi";
    showError("addressStreet", errorMessage);

    button.textContent = originalText;
    button.disabled = false;
  }
}

/**
 * Handle copy number
 */
export function handleCopyNumber(): void {
  const elements = getElements();
  const button = elements.copyNumber as HTMLButtonElement;
  const number = button?.dataset.number || config.whatsappDisplay;

  navigator.clipboard.writeText(number).then(() => {
    const originalText = button.textContent;
    button.textContent = "Tersalin! ✓";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}

/**
 * Update delivery fee based on distance
 */
export function updateDeliveryFee(lat: number, lng: number): void {
  const state = getStateRef();

  if (!config.storeLocation) return;

  const distance = calculateDistance(
    config.storeLocation.lat,
    config.storeLocation.lng,
    lat,
    lng,
  );

  state.distance = distance;

  // Fuel cost formula: distance × 4 (antar PP + ambil PP) ÷ 10 (km/liter) × 6800 (harga solar/liter)
  const ROUND_TRIPS = 4;
  const KM_PER_LITER = 10;
  const FUEL_PRICE = 6800;
  const rawFee = ((distance * ROUND_TRIPS) / KM_PER_LITER) * FUEL_PRICE;
  state.deliveryFee = Math.ceil(rawFee / 1000) * 1000; // round up to nearest Rp1.000
  updateCalculation();
}

/**
 * Main calculation update function
 */
export function updateCalculation(): void {
  const state = getStateRef();

  // Calculate end date
  if (state.startDate) {
    state.endDate = calculateEndDate(state.startDate, state.duration);
  }

  // Calculate totals
  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const mattressQty = state.items
    .filter((i) => i.category !== "accessory")
    .reduce((s, i) => s + i.quantity, 0);

  const {
    percent: volumeDiscountPercent,
    label,
    discount: volumeDiscountRate,
    nextTierUnitsNeeded,
    nextTierDiscountPercent,
  } = calculateVolumeDiscount(mattressQty, config as VolumeDiscountConfig);

  state.volumeDiscountAmount = 0;
  state.volumeDiscountLabel = label;
  state.volumeDiscountPercent = volumeDiscountPercent;
  state.nextTierUnitsNeeded = nextTierUnitsNeeded;
  state.nextTierDiscountPercent = nextTierDiscountPercent;

  const durationDiscount = calculateDurationDiscount(state.duration);
  state.durationDiscountPercent = durationDiscount.percent;

  const totals = calculateTotals(
    state.items,
    state.duration,
    state.deliveryFee || 0,
    volumeDiscountRate,
    durationDiscount.discount,
  );

  state.subtotal = totals.subtotal;
  state.volumeDiscountAmount = totals.discountAmount;
  state.durationDiscountAmount = totals.durationDiscountAmount;
  state.total = totals.total;

  state.deliveryEstimate = calculateDeliveryEstimate(
    state.startDate,
    config.cutoffHour,
  );

  // Update UI
  updateTotalQuantityDisplay();
  updateResultPanel();
  updateValidation();
  updateStepperButtons();
}

/**
 * Handle deep links from other pages
 */
export function handleDeepLink(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const hash = window.location.hash;

  if (hash === "#calculator") {
    setTimeout(() => {
      const calculatorSection = document.getElementById("calculator");
      if (calculatorSection) {
        calculatorSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (productId) {
        const productEl = document.querySelector(
          `.cart-item[data-id="${productId}"]`,
        );
        if (productEl) {
          const item = productEl.closest(".accordion-item");
          if (item && !item.classList.contains("active")) {
            const header = item.querySelector(
              ".accordion-header",
            ) as HTMLElement;
            header?.click();
          }

          if (productEl.classList.contains("is-large-size")) {
            const accordion = productEl.closest(".accordion-item");
            const showMoreBtn = accordion?.querySelector(
              ".btn-show-more",
            ) as HTMLElement;
            if (showMoreBtn && !showMoreBtn.classList.contains("active")) {
              showMoreBtn.click();
            }
          }

          setTimeout(() => {
            productEl.scrollIntoView({ behavior: "smooth", block: "center" });
            productEl.classList.add("highlight-pulse");
            setTimeout(
              () => productEl.classList.remove("highlight-pulse"),
              4000,
            );
          }, 300);
        }
      }
    }, 500);
  }
}

/**
 * Setup product modal triggers
 */
export function setupProductModalTriggers(): void {
  document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const id = target.dataset.id;
      if (id) {
        const product = findProductById(id);
        if (product) {
          openModal(product);
        }
      }
    });
  });
}

// Export validateDuration wrapper
export { validateDuration, handleFormFieldChange };
