// ==========================================================================
// Form Validation - Santi Living
// ==========================================================================

import type { BookingFormData } from "@/types";

export interface FormErrors {
  name?: string;
  whatsapp?: string;
  address?: string;
}

/**
 * Validate Indonesian phone number format
 */
export function validateWhatsAppNumber(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Indonesian phone formats:
  // 08xxxxxxxxx (10-13 digits)
  // +628xxxxxxxxx
  // 628xxxxxxxxx
  const patterns = [
    /^08\d{8,11}$/, // 08xxxxxxxxx
    /^\+628\d{8,11}$/, // +628xxxxxxxxx
    /^628\d{8,11}$/, // 628xxxxxxxxx
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
}

/**
 * Validate booking form data
 */
export function validateForm(data: BookingFormData): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name || data.name.trim() === "") {
    errors.name = "Nama wajib diisi";
  } else if (data.name.trim().length < 2) {
    errors.name = "Nama minimal 2 karakter";
  }

  // WhatsApp validation
  if (!data.whatsapp || data.whatsapp.trim() === "") {
    errors.whatsapp = "No. WhatsApp wajib diisi";
  } else if (!validateWhatsAppNumber(data.whatsapp)) {
    errors.whatsapp = "Format nomor tidak valid (contoh: 08123456789)";
  }

  // Address validation (just check not empty, length validation removed since address is now split into fields)
  if (!data.address || data.address.trim() === "") {
    errors.address = "Alamat wajib diisi";
  }

  return errors;
}

/**
 * Show inline error on form field
 */
export function showFieldError(fieldId: string, message: string): void {
  const errorEl = document.getElementById(`${fieldId}Error`);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) {
    errorEl.textContent = message;
  }

  if (inputEl) {
    inputEl.classList.add("error");
  }
}

/**
 * Clear inline error on form field
 */
export function clearFieldError(fieldId: string): void {
  const errorEl = document.getElementById(`${fieldId}Error`);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) {
    errorEl.textContent = "";
  }

  if (inputEl) {
    inputEl.classList.remove("error");
  }
}
