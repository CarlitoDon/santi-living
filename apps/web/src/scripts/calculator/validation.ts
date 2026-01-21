/**
 * Calculator Validation & Error Handling
 * Form validation and error display utilities
 */

import config from "@/data/config.json";
import { validateForm } from "../form-validation";
import { validateDuration as validateDurationDomain } from "@/lib/domain/rental";
import { getStateRef, getElements } from "./state";

/**
 * Show error message for a field
 */
export function showError(field: string, message: string): void {
  const state = getStateRef();
  const elements = getElements();

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
 * Clear error message for a field
 */
export function clearError(field: string): void {
  const state = getStateRef();
  const elements = getElements();

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
export function scrollToError(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

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
      element.focus({ preventScroll: true });
    }
  }, 800);
}

/**
 * Validate duration and update state
 */
export function validateDuration(): void {
  const state = getStateRef();
  const elements = getElements();

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
}

/**
 * Update validation state (for form submission readiness)
 */
export function updateValidation(): void {
  const state = getStateRef();
  const elements = getElements();

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
}

/**
 * Handle form field change - clear errors when fields are filled correctly
 */
export function handleFormFieldChange(): void {
  const elements = getElements();

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
