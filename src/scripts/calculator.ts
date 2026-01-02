// ==========================================================================
// Calculator Logic - Santi Living
// ==========================================================================

import config from "@/data/config.json";
import products from "@/data/products.json";
import type { CalculatorState, MattressType } from "@/types";
import { composeWhatsAppUrl } from "./whatsapp-compose";
import { validateForm, type FormErrors } from "./form-validation";

const mattresses = products as MattressType[];

// State
let state: CalculatorState = {
  mattressType: null,
  quantity: 1,
  startDate: null,
  duration: 1,
  endDate: null,
  pricePerDay: 0,
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
    quantity: document.getElementById("quantity"),
    duration: document.getElementById("duration"),
    startDate: document.getElementById("startDate"),
    customerName: document.getElementById("customerName"),
    customerWhatsapp: document.getElementById("customerWhatsapp"),
    customerAddress: document.getElementById("customerAddress"),
    customerNotes: document.getElementById("customerNotes"),
    resultMattress: document.getElementById("resultMattress"),
    resultQuantity: document.getElementById("resultQuantity"),
    resultDuration: document.getElementById("resultDuration"),
    resultDates: document.getElementById("resultDates"),
    resultTotal: document.getElementById("resultTotal"),
    resultDelivery: document.getElementById("resultDelivery"),
    whatsappButton: document.getElementById("whatsappButton"),
    whatsappFallback: document.getElementById("whatsappFallback"),
    copyNumber: document.getElementById("copyNumber"),
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
  // Mattress type selection
  const mattressInputs = document.querySelectorAll(
    'input[name="mattressType"]'
  );
  mattressInputs.forEach((input) => {
    input.addEventListener("change", handleMattressChange);
  });

  // Quantity
  const quantityInput = elements.quantity as HTMLInputElement;
  if (quantityInput) {
    quantityInput.addEventListener("input", handleQuantityChange);
    quantityInput.addEventListener("blur", validateQuantity);
  }

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
  ["customerName", "customerWhatsapp", "customerAddress"].forEach((fieldId) => {
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
}

/**
 * Handle mattress type change
 */
function handleMattressChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  state.mattressType = target.value;
  state.pricePerDay = parseInt(target.dataset.price || "0", 10);
  clearError("mattress");
  updateCalculation();
}

/**
 * Handle quantity change
 */
function handleQuantityChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  state.quantity = parseInt(target.value, 10) || 1;
  updateCalculation();
}

/**
 * Validate quantity
 */
function validateQuantity(): void {
  const { minQuantity, maxQuantity } = config;

  if (state.quantity < minQuantity) {
    state.quantity = minQuantity;
    (elements.quantity as HTMLInputElement).value = String(minQuantity);
    showError("quantity", `Minimal ${minQuantity} unit`);
  } else if (state.quantity > maxQuantity) {
    state.quantity = maxQuantity;
    (elements.quantity as HTMLInputElement).value = String(maxQuantity);
    showError("quantity", `Maksimal ${maxQuantity} unit`);
  } else {
    clearError("quantity");
  }

  updateCalculation();
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

  // Calculate totals
  state.subtotal = state.pricePerDay * state.quantity * state.duration;
  state.total = state.subtotal;

  // Calculate delivery estimate
  state.deliveryEstimate = calculateDeliveryEstimate();

  // Update UI
  updateResultPanel();
  updateValidation();
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
  // Mattress
  const mattressEl = elements.resultMattress?.querySelector(".result-value");
  if (mattressEl) {
    const mattress = mattresses.find((m) => m.id === state.mattressType);
    mattressEl.textContent = mattress ? mattress.shortName : "-";
  }

  // Quantity
  const quantityEl = elements.resultQuantity?.querySelector(".result-value");
  if (quantityEl) {
    quantityEl.textContent = `${state.quantity} unit`;
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
  const customerAddress =
    (elements.customerAddress as HTMLTextAreaElement)?.value || "";

  const formData = {
    name: customerName,
    whatsapp: customerWhatsapp,
    address: customerAddress,
    notes: "",
  };

  const formErrors = validateForm(formData);

  // Check all required fields
  state.isValid =
    state.mattressType !== null &&
    state.quantity >= config.minQuantity &&
    state.quantity <= config.maxQuantity &&
    state.duration >= config.minDuration &&
    state.duration <= config.maxDuration &&
    state.startDate !== null &&
    customerName.trim() !== "" &&
    customerWhatsapp.trim() !== "" &&
    customerAddress.trim() !== "" &&
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
  const customerAddress =
    (elements.customerAddress as HTMLTextAreaElement)?.value || "";
  const customerNotes =
    (elements.customerNotes as HTMLTextAreaElement)?.value || "";

  const mattress = mattresses.find((m) => m.id === state.mattressType);

  const bookingData = {
    mattressType: mattress?.shortName || "",
    quantity: state.quantity,
    startDate: state.startDate || "",
    endDate: state.endDate || "",
    duration: state.duration,
    total: state.total,
    name: customerName,
    address: customerAddress,
    notes: customerNotes,
  };

  const waUrl = composeWhatsAppUrl(bookingData);

  // Try to open WhatsApp
  const newWindow = window.open(waUrl, "_blank");

  // Show fallback if popup blocked or failed
  if (
    !newWindow ||
    newWindow.closed ||
    typeof newWindow.closed === "undefined"
  ) {
    showWhatsAppFallback();
  }
}

/**
 * Show WhatsApp fallback (copy number)
 */
function showWhatsAppFallback(): void {
  const fallback = elements.whatsappFallback as HTMLElement;
  if (fallback) {
    fallback.style.display = "block";
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
