// ==========================================================================
// Calculator Logic - Santi Living (Multi-Item Cart)
// ==========================================================================

import config from "@/data/config.json";
import products from "@/data/products.json";
import type { CalculatorState, ProductItem } from "@/types";
import { validateForm } from "./form-validation";
import {
  getCurrentLocation,
  reverseGeocode,
  calculateDistance,
} from "./geolocation";
import { openMapPicker } from "./map-picker";
// import { initProductModal } from "./product-modal"; // Deprecated
import { saveOrder } from "./checkout-session";
import { openModal } from "@/store/modalStore";
import {
  calculateVolumeDiscount,
  calculateTotals,
} from "@/lib/calculator-logic";
import {
  calculateEndDate,
  calculateDeliveryEstimate,
  validateDuration as validateDurationDomain,
} from "@/lib/domain/rental";

// Helper to find product by ID across all categories
const findProductById = (id: string): ProductItem | undefined => {
  const allItems = [
    ...products.mattressPackages,
    ...products.mattressOnly,
    ...products.accessories,
  ];
  // @ts-ignore
  return allItems.find((p) => p.id === id);
};

// State
let state: CalculatorState = {
  items: [],
  startDate: null,
  duration: 1,
  paymentMethod: "qris", // Kept for API compatibility, but not user-selectable
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
  nextTierUnitsNeeded: 0,
  nextTierDiscountPercent: 0,
  isValid: false,
  errors: {},
};

// DOM Elements
let elements: Record<string, HTMLElement | null> = {};

/**
 * Initialize calculator
 */
export function initCalculator(): void {
  console.log("Calculator Logic Loaded - Fix Applied (Blocking Validation)");
  // Cache DOM elements
  elements = {
    form: document.getElementById("calculatorForm"),
    mattressCart: document.getElementById("mattressCart"),
    cartTotalQty: document.getElementById("cartTotalQty"),
    duration: document.getElementById("duration"),
    startDate: document.getElementById("startDate"),
    customerName: document.getElementById("customerName"),
    customerWhatsapp: document.getElementById("customerWhatsapp"),
    addressStreet: document.getElementById("addressStreet"),
    addressKelurahan: document.getElementById("addressKelurahan"),
    addressKecamatan: document.getElementById("addressKecamatan"),
    addressKota: document.getElementById("addressKota"),
    addressProvinsi: document.getElementById("addressProvinsi"),
    addressZip: document.getElementById("addressZip"),
    addressLat: document.getElementById("addressLat"),
    addressLng: document.getElementById("addressLng"),
    customerNotes: document.getElementById("customerNotes"),
    locationButton: document.getElementById("locationButton"),
    resultMattress: document.getElementById("resultMattress"),
    resultQuantity: document.getElementById("resultQuantity"),
    resultDuration: document.getElementById("resultDuration"),
    resultDates: document.getElementById("resultDates"),
    resultTotal: document.getElementById("resultTotal"),
    resultDelivery: document.getElementById("resultDelivery"),
    whatsappButton: document.getElementById("whatsappButton"),
    whatsappFallback: document.getElementById("whatsappFallback"),
    copyNumber: document.getElementById("copyNumber"),
    packageToggle: document.getElementById("packageToggle"),
    mapPickerButton: document.getElementById("mapPickerButton"),
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  const startDateInput = elements.startDate as HTMLInputElement;
  if (startDateInput) {
    startDateInput.min = today;
    startDateInput.value = today;
    state.startDate = today;
  }

  // Bind events
  bindEvents();

  // Initial calculation
  updateCalculation();

  // Initialize shared product modal
  // initProductModal();

  // Handle product modal triggers
  document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const id = target.dataset.id;
      if (id) {
        // Find product data
        const product = findProductById(id);
        if (product) {
          openModal(product);
        }
      }
    });
  });

  // Handle deep links from other pages
  handleDeepLink();

  // Listen for custom event to recalculate delivery fee (used by cart prefill)
  document.addEventListener("recalculate-delivery-fee", (event: Event) => {
    const customEvent = event as CustomEvent<{ lat: number; lng: number }>;
    if (customEvent.detail?.lat && customEvent.detail?.lng) {
      updateDeliveryFee(customEvent.detail.lat, customEvent.detail.lng);
    }
  });
}

/**
 * Bind event listeners
 */
function bindEvents(): void {
  // Stepper buttons (+ and -)
  const plusButtons = document.querySelectorAll(".btn-plus");
  const minusButtons = document.querySelectorAll(".btn-minus");

  plusButtons.forEach((button) => {
    button.addEventListener("click", handleIncrement);
  });

  minusButtons.forEach((button) => {
    button.addEventListener("click", handleDecrement);
  });

  // Duration
  const durationInput = elements.duration as HTMLInputElement;
  if (durationInput) {
    durationInput.addEventListener("input", handleDurationChange);
    durationInput.addEventListener("blur", validateDuration);
  }

  // Start date
  const startDateInput = elements.startDate as HTMLInputElement;
  if (startDateInput) {
    startDateInput.addEventListener("change", handleDateChange);
  }

  // Customer fields
  [
    "customerName",
    "customerWhatsapp",
    "addressStreet",
    "addressKelurahan",
    "addressKecamatan",
    "addressKota",
  ].forEach((fieldId) => {
    const field = elements[fieldId] as HTMLInputElement | HTMLTextAreaElement;
    if (field) {
      field.addEventListener("input", handleFormFieldChange);
      field.addEventListener("blur", handleFormFieldChange);
    }
  });

  // WhatsApp button
  const whatsappButton = elements.whatsappButton as HTMLButtonElement;
  if (whatsappButton) {
    whatsappButton.addEventListener("click", handleWhatsAppClick);
  }

  // Copy number button
  const copyButton = elements.copyNumber as HTMLButtonElement;
  if (copyButton) {
    copyButton.addEventListener("click", handleCopyNumber);
  }

  // Location button
  const locationButton = elements.locationButton as HTMLButtonElement;
  if (locationButton) {
    locationButton.addEventListener("click", handleLocationClick);
  }

  // Map picker button
  const mapPickerButton = elements.mapPickerButton as HTMLButtonElement;
  if (mapPickerButton) {
    mapPickerButton.addEventListener("click", handleMapPickerClick);
  }

  // Payment method toggle
  const paymentToggleButtons = document.querySelectorAll(".payment-option");
  paymentToggleButtons.forEach((button) => {
    button.addEventListener("click", handlePaymentMethodToggle);
  });

  // Show more buttons
  const showMoreButtons = document.querySelectorAll(".btn-show-more");
  showMoreButtons.forEach((button) => {
    button.addEventListener("click", handleShowMoreClick);
  });

  // Accordion headers
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", handleAccordionClick);
  });
}

/**
 * Handle deep links from other pages
 */
function handleDeepLink(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const hash = window.location.hash;

  if (hash === "#calculator") {
    // Wait a bit for everything to be rendered
    setTimeout(() => {
      const calculatorSection = document.getElementById("calculator");
      if (calculatorSection) {
        calculatorSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // If there's a specific product, highlight it
      if (productId) {
        const productEl = document.querySelector(
          `.cart-item[data-id="${productId}"]`,
        );
        if (productEl) {
          // Open accordion if product is inside one
          const item = productEl.closest(".accordion-item");
          if (item && !item.classList.contains("active")) {
            const header = item.querySelector(
              ".accordion-header",
            ) as HTMLElement;
            header?.click();
          }

          // Show large items if product is a large one
          if (productEl.classList.contains("is-large-size")) {
            const accordion = productEl.closest(".accordion-item");
            const showMoreBtn = accordion?.querySelector(
              ".btn-show-more",
            ) as HTMLElement;
            if (showMoreBtn && !showMoreBtn.classList.contains("active")) {
              showMoreBtn.click();
            }
          }

          // Scroll to product and highlight
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
 * Handle accordion header click
 */
function handleAccordionClick(event: Event): void {
  const header = event.currentTarget as HTMLElement;
  const item = header.parentElement;

  if (item) {
    const content = item.querySelector(".accordion-content") as HTMLElement;
    const icon = item.querySelector(".accordion-icon") as HTMLElement;
    const isCurrentlyActive = item.classList.contains("active");

    // Logic: Toggle current item. If it was active, deactivate (close). If inactive, activate (open).
    // Note: The user requirement implies a toggle behavior.

    if (isCurrentlyActive) {
      item.classList.remove("active");
      if (content) content.style.display = "none";
      if (icon) icon.textContent = "+";
    } else {
      // Optional: Close other accordions for "one-at-a-time" behavior,
      // but let's stick to independent toggles unless forced.
      // Wait, "gimana kalau 3 kategori ini dibuat toggle aja? yang defaultnya terbuka paket, 2 lainnya tertutup."
      // Usually "toggle aja" implies independent or linked.
      // I will implement "exclusive" behavior (accordion style) where opening one might be expected,
      // BUT independent is safer for UX if they want to see multiple.
      // However, usually accordions close others to save space.
      // Let's implement independent toggling for now as it's more flexible for comparison.

      item.classList.add("active");
      if (content) content.style.display = "block";
      if (icon) icon.textContent = "−";
    }
  }
}

/**
 * Handle payment method toggle
 */
function handlePaymentMethodToggle(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const value = button.dataset.value as "qris" | "transfer";

  // Update state
  state.paymentMethod = value;

  // Update UI
  const paymentButtons = document.querySelectorAll(".payment-option");
  paymentButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}

/**
 * Handle "Show More" items click
 */
function handleShowMoreClick(event: Event): void {
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
function handleMapPickerClick(): void {
  openMapPicker({
    onConfirm: (coords, address) => {
      // Fill all address fields
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

      // Trigger validation
      handleFormFieldChange();

      // Update delivery fee
      if (coords.lat && coords.lng) {
        updateDeliveryFee(coords.lat, coords.lng);
      }
    },
  });
}

/**
 * Handle increment (+) button
 */
/**
 * Handle increment (+) button
 */
function handleIncrement(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const id = button.dataset.id || "";
  const name = button.dataset.name || "";
  const category = button.dataset.category as
    | "package"
    | "mattress"
    | "accessory";
  const price = parseInt(button.dataset.price || "0", 10);

  // Check if total quantity (mattresses only) would exceed max
  if (category !== "accessory") {
    const currentMattressQty = state.items
      .filter((i) => i.category !== "accessory")
      .reduce((sum, i) => sum + i.quantity, 0);

    if (currentMattressQty >= config.maxQuantity) {
      showError(
        "mattressCart",
        `Maksimal ${config.maxQuantity} unit kasur (per jenis maupun total). Hubungi CS untuk pemesanan partai besar.`,
      );
      return;
    }
  } else {
    // Basic validation: Cannot order accessories without mattress
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

  // Find existing item or create new
  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Lookup product data to get includes (bundle components)
    const productData = findProductById(id);
    const includes = productData?.includes;

    state.items.push({
      id,
      name,
      category,
      quantity: 1,
      pricePerDay: price,
      includes, // Bundle components for packages
    });
  }

  clearError("mattressCart");
  updateQuantityDisplay(id);
  updateCalculation();
}

/**
 * Handle decrement (-) button
 */
function handleDecrement(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const id = button.dataset.id || "";

  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem && existingItem.quantity > 0) {
    existingItem.quantity -= 1;

    // Remove item if quantity reaches 0
    if (existingItem.quantity === 0) {
      state.items = state.items.filter((item) => item.id !== id);
    }

    // Creating accessories cleanup logic if 0 mattresses
    const mattressCount = state.items
      .filter((i) => i.category !== "accessory")
      .reduce((s, i) => s + i.quantity, 0);

    if (mattressCount === 0) {
      // Automatically remove accessories if no mattress left (optional)
      // For now, let's just leave them but validation will fail on submit
    }

    updateQuantityDisplay(id);
    updateCalculation();
  }
}

/**
 * Update quantity display for a specific item
 */
function updateQuantityDisplay(id: string): void {
  const qtyEl = document.querySelector(
    `.cart-item-qty[data-id="${id}"]`,
  ) as HTMLElement;

  if (qtyEl) {
    const item = state.items.find((i) => i.id === id);
    qtyEl.textContent = item ? String(item.quantity) : "0";

    // Update selected state class on parent
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
 * Handle duration change
 */
function handleDurationChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  state.duration = parseInt(target.value, 10) || 1;
  updateCalculation();
}

/**
 * Validate duration
 */
function validateDuration(): void {
  const result = validateDurationDomain(state.duration, {
    minDuration: config.minDuration,
    maxDuration: config.maxDuration,
  });

  if (!result.isValid) {
    if (result.adjustedValue) {
      state.duration = result.adjustedValue;
      (elements.duration as HTMLInputElement).value = String(
        result.adjustedValue,
      );
    }
    showError("duration", result.message || "Durasi tidak valid");
  } else {
    clearError("duration");
  }

  updateCalculation();
}

/**
 * Handle date change
 */
function handleDateChange(event: Event): void {
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
 * Handle form field change - clear errors when fields are filled correctly
 */
function handleFormFieldChange(): void {
  // Clear errors for fields that now have valid values
  const customerName = (elements.customerName as HTMLInputElement)?.value || "";
  const customerWhatsapp =
    (elements.customerWhatsapp as HTMLInputElement)?.value || "";
  const addressStreet =
    (elements.addressStreet as HTMLInputElement)?.value || "";
  const addressKota = (elements.addressKota as HTMLInputElement)?.value || "";

  // Clear name error if field is filled
  if (customerName.trim()) {
    clearError("customerName");
  }

  // Clear WhatsApp error if field is filled with valid format
  if (customerWhatsapp.trim()) {
    const cleaned = customerWhatsapp.replace(/[\s-]/g, "");
    const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
    if (patterns.some((p) => p.test(cleaned))) {
      clearError("customerWhatsapp");
    }
  }

  // Clear address street error if field is filled
  if (addressStreet.trim()) {
    clearError("addressStreet");
  }

  // Clear kota error if field is filled
  if (addressKota.trim()) {
    clearError("addressKota");
  }

  updateValidation();
}

/**
 * Update calculation
 */
/**
 * Calculate delivery fee based on distance
 */
function updateDeliveryFee(lat: number, lng: number): void {
  if (!config.storeLocation) return;

  const distance = calculateDistance(
    config.storeLocation.lat,
    config.storeLocation.lng,
    lat,
    lng,
  );

  state.distance = distance;

  // Calculate fee based on zones
  let fee = 0;
  const zones = config.deliveryZones || [];

  // Find matching zone
  const zone = zones.find((z) => distance <= z.maxDistance);

  if (zone) {
    fee = zone.price;
  } else {
    // Exceeds max zone - calculate per km
    const lastZone = zones[zones.length - 1];
    const extraDist = distance - lastZone.maxDistance;
    const baseFee = lastZone.price;
    const extraFee = Math.ceil(extraDist) * (config.deliveryPricePerKm || 0);
    fee = baseFee + extraFee;

    // Ensure minimum price if set
    if (config.minDeliveryPrice && fee < config.minDeliveryPrice) {
      fee = config.minDeliveryPrice;
    }
  }

  // Round to nearest 1000
  fee = Math.ceil(fee / 1000) * 1000;

  state.deliveryFee = fee;
  updateCalculation();
}

/**
 * Update calculation
 */
function updateCalculation(): void {
  // 1. Calculate end date using pure function
  if (state.startDate) {
    state.endDate = calculateEndDate(state.startDate, state.duration);
  }

  // 2. Calculate prices using pure function
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
  } = calculateVolumeDiscount(mattressQty, config as any);

  // Update state with discount info
  state.volumeDiscountAmount = 0; // Will be calc in calculateTotals
  state.volumeDiscountLabel = label;
  state.volumeDiscountPercent = volumeDiscountPercent;

  state.nextTierUnitsNeeded = nextTierUnitsNeeded;
  state.nextTierDiscountPercent = nextTierDiscountPercent;

  // Calculate totals
  const totals = calculateTotals(
    state.items,
    state.duration,
    state.deliveryFee || 0,
    volumeDiscountRate,
  );

  state.subtotal = totals.subtotal;
  state.volumeDiscountAmount = totals.discountAmount;
  state.total = totals.total;

  // 3. Calculate delivery estimate
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
 * Update total quantity display
 */
function updateTotalQuantityDisplay(): void {
  const el = elements.cartTotalQty as HTMLElement;
  if (el) {
    el.textContent = `${state.totalQuantity} unit`;
  }
}

/**
 * Update stepper button states
 */
function updateStepperButtons(): void {
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
      // Accessories always enabled
      button.disabled = false;
    }
  });
}

// Helper removed - using pure function from domain/rental

/**
 * Update result panel
 */
function updateResultPanel(): void {
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

/**
 * Update validation state
 */
function updateValidation(): void {
  const customerName = (elements.customerName as HTMLInputElement)?.value || "";
  const customerWhatsapp =
    (elements.customerWhatsapp as HTMLInputElement)?.value || "";
  const addressStreet =
    (elements.addressStreet as HTMLInputElement)?.value || "";
  const addressKota = (elements.addressKota as HTMLInputElement)?.value || "";

  const formData = {
    name: customerName,
    whatsapp: customerWhatsapp,
    address: addressStreet,
    notes: "",
  };

  const formErrors = validateForm(formData);

  // Check all required fields (min: name, whatsapp, street, kota)
  state.isValid =
    state.totalQuantity > 0 &&
    state.totalQuantity <= config.maxQuantity &&
    state.duration >= config.minDuration &&
    state.duration <= config.maxDuration &&
    state.startDate !== null &&
    customerName.trim() !== "" &&
    customerWhatsapp.trim() !== "" &&
    addressStreet.trim() !== "" &&
    addressKota.trim() !== "" &&
    Object.keys(formErrors).length === 0;

  // Button is always enabled - validation happens on click
}

/**
 * Handle WhatsApp click - validate and scroll to first error if invalid
 */
async function handleWhatsAppClick(): Promise<void> {
  // Get all field values
  const customerName = (elements.customerName as HTMLInputElement)?.value || "";
  const customerWhatsapp =
    (elements.customerWhatsapp as HTMLInputElement)?.value || "";
  const addressStreet =
    (elements.addressStreet as HTMLInputElement)?.value || "";
  const addressKelurahan =
    (elements.addressKelurahan as HTMLInputElement)?.value || "";
  const addressKecamatan =
    (elements.addressKecamatan as HTMLInputElement)?.value || "";
  const addressKota = (elements.addressKota as HTMLInputElement)?.value || "";
  const addressProvinsi =
    (elements.addressProvinsi as HTMLInputElement)?.value || "";
  const addressZip = (elements.addressZip as HTMLInputElement)?.value || "";
  const addressLat = (elements.addressLat as HTMLInputElement)?.value || "";
  const addressLng = (elements.addressLng as HTMLInputElement)?.value || "";
  const customerNotes =
    (elements.customerNotes as HTMLTextAreaElement)?.value || "";

  // Collect validation errors with field IDs for scrolling
  const validationErrors: { fieldId: string; message: string }[] = [];

  // Check quantity
  if (state.totalQuantity === 0) {
    validationErrors.push({
      fieldId: "mattressCart",
      message: "Pilih minimal 1 kasur",
    });
  }

  // Check start date
  if (!state.startDate) {
    validationErrors.push({
      fieldId: "startDate",
      message: "Tanggal mulai wajib diisi",
    });
  }

  // Check customer name
  if (!customerName.trim()) {
    validationErrors.push({
      fieldId: "customerName",
      message: "Nama wajib diisi",
    });
  }

  // Check WhatsApp
  if (!customerWhatsapp.trim()) {
    validationErrors.push({
      fieldId: "customerWhatsapp",
      message: "No. WhatsApp wajib diisi",
    });
  } else {
    // Validate WhatsApp format
    const cleaned = customerWhatsapp.replace(/[\s-]/g, "");
    const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
    if (!patterns.some((p) => p.test(cleaned))) {
      validationErrors.push({
        fieldId: "customerWhatsapp",
        message: "Format nomor tidak valid (contoh: 08123456789)",
      });
    }
  }

  // Check address street
  if (!addressStreet.trim()) {
    validationErrors.push({
      fieldId: "addressStreet",
      message: "Alamat jalan wajib diisi",
    });
  }

  // Check kota
  if (!addressKota.trim()) {
    validationErrors.push({
      fieldId: "addressKota",
      message: "Kabupaten/Kota wajib diisi",
    });
  }

  // If there are errors, show them and scroll to first
  if (validationErrors.length > 0) {
    // Clear previous errors
    document
      .querySelectorAll(".form-error")
      .forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll(".form-input, .form-textarea")
      .forEach((el) => el.classList.remove("error"));

    // Show all errors
    validationErrors.forEach((err) => {
      showError(err.fieldId, err.message);
    });

    // Scroll to first error field
    // Scroll to first error field with offset for sticky header
    scrollToError(validationErrors[0].fieldId);
    return;
  }

  // All valid - compose address and send to WhatsApp
  let fullAddress = addressStreet;
  if (addressKelurahan) fullAddress += `, ${addressKelurahan}`;
  if (addressKecamatan) fullAddress += `, ${addressKecamatan}`;
  if (addressKota) fullAddress += `, ${addressKota}`;
  if (addressProvinsi) fullAddress += `, ${addressProvinsi}`;
  if (addressZip) fullAddress += ` ${addressZip}`;
  if (addressLat && addressLng)
    fullAddress += ` (${addressLat}, ${addressLng})`;

  // Generate order ID
  const orderId = `SL-${Date.now().toString(36).toUpperCase()}`;

  const bookingData = {
    orderId: orderId,
    customerName: customerName,
    customerWhatsapp: customerWhatsapp,
    deliveryAddress: fullAddress,
    addressFields: {
      street: addressStreet,
      kelurahan: addressKelurahan,
      kecamatan: addressKecamatan,
      kota: addressKota,
      provinsi: addressProvinsi,
      zip: addressZip,
      lat: addressLat,
      lng: addressLng,
    },
    items: state.items.map((item) => ({
      id: item.id, // Product ID for bundle lookup
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      pricePerDay: item.pricePerDay,
      includes: item.includes, // Bundle components for auto-creation
    })),
    totalPrice: state.total,
    orderDate: state.startDate || "",
    endDate: state.endDate || "",
    duration: state.duration,
    deliveryFee: state.deliveryFee || 0,
    paymentMethod: state.paymentMethod,
    notes: customerNotes,
    volumeDiscountAmount: state.volumeDiscountAmount,
    volumeDiscountLabel: state.volumeDiscountLabel,
  };

  // Change button state to loading
  const waButton = elements.whatsappButton as HTMLButtonElement;
  const originalBtnText = waButton.innerHTML;
  waButton.disabled = true;
  waButton.innerHTML = `<span class="loading-spinner"></span> Memproses...`;

  try {
    // Save order to sessionStorage FIRST (before API call)
    // This ensures checkout page works even if bot API fails
    saveOrder(bookingData);

    // Step 1: Call ERP first to get order tracking URL
    let orderUrl: string | undefined;
    const { createOrderInERP } = await import("../services/erp-api");
    const erpResponse = await createOrderInERP(bookingData);
    console.log("Order created in ERP:", erpResponse.orderNumber);
    orderUrl = erpResponse.orderUrl;

    // Store for thank-you page and checkout confirmation
    if (orderUrl) {
      sessionStorage.setItem("erpOrderUrl", orderUrl);
      sessionStorage.setItem("erpOrderNumber", erpResponse.orderNumber);
      sessionStorage.setItem("erpPublicToken", erpResponse.publicToken);
    }

    // Note: WhatsApp notification is now handled by ERP Sync Service
    // No need to call sendOrderToBot separately

    // Update button to show success briefly
    waButton.innerHTML = `✓ Melanjutkan ke Checkout`;
    waButton.classList.add("success-btn");

    // Redirect to checkout page after short delay
    // Redirect to checkout page after short delay
    setTimeout(() => {
      window.location.href = "/sewa-kasur/checkout";
    }, 500);
  } catch (error: any) {
    console.error("Failed to process order:", error);
    waButton.disabled = false;
    waButton.innerHTML = originalBtnText;

    // Show error message
    // Check for specific WhatsApp validation errors or general validation
    const errorMessage = (error.message || "").toLowerCase();

    // Check for specific field errors
    if (
      errorMessage.includes("invalid_phone") ||
      errorMessage.includes("whatsapp") ||
      errorMessage.includes("nomor")
    ) {
      showError(
        "customerWhatsapp",
        "Nomor WhatsApp tidak terdaftar atau tidak aktif. Harap cek kembali.",
      );
      scrollToError("customerWhatsapp");
    } else if (errorMessage.includes("name") || errorMessage.includes("nama")) {
      showError("customerName", error.message);
      scrollToError("customerName");
    } else if (
      errorMessage.includes("address") ||
      errorMessage.includes("alamat")
    ) {
      showError("addressStreet", error.message);
      scrollToError("addressStreet");
    } else if (
      errorMessage.includes("mattress") ||
      errorMessage.includes("kasur") ||
      errorMessage.includes("quantity") ||
      errorMessage.includes("jumlah") ||
      errorMessage.includes("pilih")
    ) {
      showError(
        "mattressCart",
        error.message || "Pilih jumlah kasur dengan benar.",
      );
      scrollToError("mattressCart");
    } else {
      // Generic error - do NOT show on mattress section as it's confusing
      // Show as a global alert or on the submit button area
      console.error("Generic Booking Error:", error);
      // DEBUG: Show env values for troubleshooting (REMOVE AFTER DEBUG)
      const proxyUrl = (import.meta as any).env?.PUBLIC_PROXY_URL || "not set";
      alert(
        `Mohon maaf, terjadi kesalahan: ${
          error.message || "Gagal memproses pesanan"
        }. Silakan coba lagi.\n\n[DEBUG] PROXY_URL: ${proxyUrl}`,
      );

      // Optional: Visual feedback on button
      waButton.classList.add("error-btn");
      setTimeout(() => waButton.classList.remove("error-btn"), 2000);
    }
  }
}

/**
 * Handle location button click
 */
async function handleLocationClick(): Promise<void> {
  const button = elements.locationButton as HTMLButtonElement;
  const streetField = elements.addressStreet as HTMLInputElement;
  const kotaField = elements.addressKota as HTMLInputElement;
  const latField = elements.addressLat as HTMLInputElement;
  const lngField = elements.addressLng as HTMLInputElement;

  if (!button || !streetField) return;

  // Disable button and show loading
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "📍 Mengambil lokasi...";

  try {
    // Get coordinates first
    const coords = await getCurrentLocation();

    // Fill coordinate fields
    if (latField) latField.value = coords.latitude.toFixed(6);
    if (lngField) lngField.value = coords.longitude.toFixed(6);

    // Get address from coordinates
    const address = await reverseGeocode(coords);

    // Fill all address fields
    streetField.value = address.street;
    const kelurahanField = elements.addressKelurahan as HTMLInputElement;
    const kecamatanField = elements.addressKecamatan as HTMLInputElement;
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

    // Trigger validation
    handleFormFieldChange();

    // Calculate delivery fee
    updateDeliveryFee(coords.latitude, coords.longitude);

    // Show success
    button.textContent = "✓ Lokasi terisi";
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  } catch (error) {
    // Show error message
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mendapatkan lokasi";
    showError("addressStreet", errorMessage);

    // Reset button
    button.textContent = originalText;
    button.disabled = false;
  }
}

/**
 * Handle copy number
 */
function handleCopyNumber(): void {
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
 * Show error message
 */
function showError(field: string, message: string): void {
  state.errors[field] = message;
  const errorEl = document.getElementById(`${field}Error`);
  if (errorEl) {
    errorEl.textContent = message;
  }

  const inputEl = elements[field] as HTMLElement;
  if (inputEl) {
    inputEl.classList.add("error");
  }
}

/**
 * Clear error message
 */
function clearError(field: string): void {
  delete state.errors[field];
  const errorEl = document.getElementById(`${field}Error`);
  if (errorEl) {
    errorEl.textContent = "";
  }

  const inputEl = elements[field] as HTMLElement;
  if (inputEl) {
    inputEl.classList.remove("error");
  }
}

/**
 * Scroll to error field with offset for sticky header
 */
/**
 * Scroll to error field with offset for sticky header
 */
function scrollToError(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Use native scrollIntoView - CSS scroll-margin-top handles the offset
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  // Focus the field after scrolling
  setTimeout(() => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      // Use preventScroll to avoid browser jumping back
      element.focus({ preventScroll: true });
    }
  }, 800); // Wait for scroll to finish
}
