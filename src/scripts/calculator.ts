// ==========================================================================
// Calculator Logic - Santi Living (Multi-Item Cart)
// ==========================================================================

import config from "@/data/config.json";
import products from "@/data/products.json";
import type { CalculatorState, MattressType, CartItem } from "@/types";
import { composeWhatsAppUrl } from "./whatsapp-compose";
import { validateForm } from "./form-validation";
import { getCurrentLocation, reverseGeocode } from "./geolocation";

const mattresses = products as MattressType[];

// State
let state: CalculatorState = {
  items: [],
  startDate: null,
  duration: 1,
  isPackage: true,
  endDate: null,
  totalQuantity: 0,
  subtotal: 0,
  total: 0,
  deliveryEstimate: "",
  isValid: false,
  errors: {},
};

// DOM Elements
let elements: Record<string, HTMLElement | null> = {};

/**
 * Initialize calculator
 */
export function initCalculator(): void {
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

  // Package toggle
  const toggleButtons = document.querySelectorAll(".toggle-option");
  toggleButtons.forEach((button) => {
    button.addEventListener("click", handlePackageToggle);
  });
}

/**
 * Handle package toggle
 */
function handlePackageToggle(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const value = button.dataset.value;

  // Update state
  state.isPackage = value === "package";

  // Update UI
  const toggleButtons = document.querySelectorAll(".toggle-option");
  toggleButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");

  // Recalculate
  updateCalculation();
}

/**
 * Handle increment (+) button
 */
function handleIncrement(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const type = button.dataset.type || "";
  const name = button.dataset.name || "";
  const price = parseInt(button.dataset.price || "0", 10);
  const packagePrice = parseInt(button.dataset.packagePrice || "0", 10);

  // Check if total quantity would exceed max
  if (state.totalQuantity >= config.maxQuantity) {
    showError("mattress", `Maksimal ${config.maxQuantity} unit total`);
    return;
  }

  // Find existing item or create new
  const existingItem = state.items.find((item) => item.type === type);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({
      type,
      name,
      quantity: 1,
      pricePerDay: price,
      packagePricePerDay: packagePrice,
    });
  }

  clearError("mattress");
  updateQuantityDisplay(type);
  updateCalculation();
}

/**
 * Handle decrement (-) button
 */
function handleDecrement(event: Event): void {
  const button = event.currentTarget as HTMLButtonElement;
  const type = button.dataset.type || "";

  const existingItem = state.items.find((item) => item.type === type);

  if (existingItem && existingItem.quantity > 0) {
    existingItem.quantity -= 1;

    // Remove item if quantity reaches 0
    if (existingItem.quantity === 0) {
      state.items = state.items.filter((item) => item.type !== type);
    }

    updateQuantityDisplay(type);
    updateCalculation();
  }
}

/**
 * Update quantity display for a specific mattress type
 */
function updateQuantityDisplay(type: string): void {
  const qtyEl = document.querySelector(
    `.cart-item-qty[data-type="${type}"]`
  ) as HTMLElement;

  if (qtyEl) {
    const item = state.items.find((i) => i.type === type);
    qtyEl.textContent = item ? String(item.quantity) : "0";
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
  const { minDuration, maxDuration } = config;

  if (state.duration < minDuration) {
    state.duration = minDuration;
    (elements.duration as HTMLInputElement).value = String(minDuration);
    showError("duration", `Minimal ${minDuration} hari`);
  } else if (state.duration > maxDuration) {
    state.duration = maxDuration;
    (elements.duration as HTMLInputElement).value = String(maxDuration);
    showError("duration", `Maksimal ${maxDuration} hari`);
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
 * Handle form field change
 */
function handleFormFieldChange(): void {
  updateValidation();
}

/**
 * Update calculation
 */
function updateCalculation(): void {
  // Calculate end date
  if (state.startDate) {
    const start = new Date(state.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + state.duration);
    state.endDate = end.toISOString().split("T")[0];
  }

  // Calculate total quantity
  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Calculate totals based on package selection
  if (state.isPackage) {
    // Use package price for each item
    state.total = state.items.reduce(
      (sum, item) =>
        sum + item.quantity * item.packagePricePerDay * state.duration,
      0
    );
  } else {
    // Use standard price for each item
    state.total = state.items.reduce(
      (sum, item) => sum + item.quantity * item.pricePerDay * state.duration,
      0
    );
  }
  state.subtotal = state.total;

  // Calculate delivery estimate
  state.deliveryEstimate = calculateDeliveryEstimate();

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
    ".btn-plus"
  ) as NodeListOf<HTMLButtonElement>;
  const atMax = state.totalQuantity >= config.maxQuantity;

  plusButtons.forEach((button) => {
    button.disabled = atMax;
  });
}

/**
 * Calculate delivery estimate
 */
function calculateDeliveryEstimate(): string {
  if (!state.startDate) {
    return "Pilih tanggal untuk estimasi pengantaran";
  }

  const now = new Date();
  const startDate = new Date(state.startDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday = startDate.getTime() === today.getTime();

  if (isToday) {
    const currentHour = now.getHours();
    if (currentHour < config.cutoffHour) {
      return "Bisa antar hari ini! 🚚";
    } else {
      return "Antar besok pagi";
    }
  } else {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
    const dateStr = startDate.toLocaleDateString("id-ID", options);
    return `Antar ${dateStr}`;
  }
}

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
        state.endDate
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

  // Update button state
  const button = elements.whatsappButton as HTMLButtonElement;
  if (button) {
    button.disabled = !state.isValid;
  }
}

/**
 * Handle WhatsApp click
 */
function handleWhatsAppClick(): void {
  if (!state.isValid) return;

  const customerName = (elements.customerName as HTMLInputElement)?.value || "";
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

  // Compose full address
  let fullAddress = addressStreet;
  if (addressKelurahan) fullAddress += `, ${addressKelurahan}`;
  if (addressKecamatan) fullAddress += `, ${addressKecamatan}`;
  if (addressKota) fullAddress += `, ${addressKota}`;
  if (addressProvinsi) fullAddress += `, ${addressProvinsi}`;
  if (addressZip) fullAddress += ` ${addressZip}`;
  if (addressLat && addressLng)
    fullAddress += ` (${addressLat}, ${addressLng})`;

  const bookingData = {
    items: state.items,
    startDate: state.startDate || "",
    endDate: state.endDate || "",
    duration: state.duration,
    totalQuantity: state.totalQuantity,
    total: state.total,
    name: customerName,
    address: fullAddress,
    notes: customerNotes,
    isPackage: state.isPackage,
  };

  const waUrl = composeWhatsAppUrl(bookingData);

  // Use direct navigation for better mobile support
  window.location.href = waUrl;
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
