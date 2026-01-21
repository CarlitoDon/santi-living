/**
 * Calculator State Management
 * Centralized state and element references
 */

import type { CalculatorState, ElementsMap } from "./types";

// Module-level state
let state: CalculatorState = {
  items: [],
  startDate: null,
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
  nextTierUnitsNeeded: 0,
  nextTierDiscountPercent: 0,
  isValid: false,
  errors: {},
};

// Cached DOM elements
let elements: ElementsMap = {};

/**
 * Get current state (read-only copy)
 */
export function getState(): CalculatorState {
  return { ...state };
}

/**
 * Update state with partial values
 */
export function updateState(updates: Partial<CalculatorState>): void {
  state = { ...state, ...updates };
}

/**
 * Get state reference for direct mutation (use sparingly)
 */
export function getStateRef(): CalculatorState {
  return state;
}

/**
 * Get cached DOM elements
 */
export function getElements(): ElementsMap {
  return elements;
}

/**
 * Initialize/cache DOM elements
 */
export function initElements(): void {
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
}
