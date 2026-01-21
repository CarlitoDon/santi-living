/**
 * Calculator Module - Entry Point
 * Santi Living Multi-Item Cart Calculator
 */

import { initElements, getStateRef } from "./state";
import {
  handleIncrement,
  handleDecrement,
  handleDurationChange,
  handleDateChange,
  handleAccordionClick,
  handlePaymentMethodToggle,
  handleShowMoreClick,
  handleMapPickerClick,
  handleLocationClick,
  handleCopyNumber,
  handleDeepLink,
  setupProductModalTriggers,
  updateCalculation,
  validateDuration,
  handleFormFieldChange,
} from "./handlers";
import { handleWhatsAppClick } from "./api";
import { getElements } from "./state";

/**
 * Initialize calculator
 */
export function initCalculator(): void {
  // Cache DOM elements
  initElements();
  const elements = getElements();

  // Set minimum date to today and update state
  const today = new Date().toISOString().split("T")[0];
  const startDateInput = elements.startDate as HTMLInputElement;
  if (startDateInput) {
    startDateInput.min = today;
    startDateInput.value = today;
    // Update state so validation passes
    const state = getStateRef();
    state.startDate = today;
  }

  // Bind events
  bindEvents();

  // Initial calculation
  updateCalculation();

  // Handle product modal triggers
  setupProductModalTriggers();

  // Handle deep links from other pages
  handleDeepLink();

  // Listen for custom event to recalculate delivery fee
  document.addEventListener("recalculate-delivery-fee", (event: Event) => {
    const customEvent = event as CustomEvent<{ lat: number; lng: number }>;
    if (customEvent.detail?.lat && customEvent.detail?.lng) {
      const { updateDeliveryFee } = require("./handlers");
      updateDeliveryFee(customEvent.detail.lat, customEvent.detail.lng);
    }
  });
}

/**
 * Bind event listeners
 */
function bindEvents(): void {
  const elements = getElements();

  // Stepper buttons (+ and -)
  document.querySelectorAll(".btn-plus").forEach((button) => {
    button.addEventListener("click", handleIncrement);
  });

  document.querySelectorAll(".btn-minus").forEach((button) => {
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
  document.querySelectorAll(".payment-option").forEach((button) => {
    button.addEventListener("click", handlePaymentMethodToggle);
  });

  // Show more buttons
  document.querySelectorAll(".btn-show-more").forEach((button) => {
    button.addEventListener("click", handleShowMoreClick);
  });

  // Accordion headers
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", handleAccordionClick);
  });
}
