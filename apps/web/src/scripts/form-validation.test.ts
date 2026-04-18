/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  validateWhatsAppNumber,
  validateForm,
  showFieldError,
  clearFieldError,
} from "./form-validation";

// ============================================================
// validateWhatsAppNumber
// ============================================================

describe("validateWhatsAppNumber", () => {
  describe("valid numbers", () => {
    it("accepts 08xxxxxxxxx format", () => {
      expect(validateWhatsAppNumber("08123456789")).toBe(true);
    });

    it("accepts +628xxxxxxxxx format", () => {
      expect(validateWhatsAppNumber("+628123456789")).toBe(true);
    });

    it("accepts 628xxxxxxxxx format", () => {
      expect(validateWhatsAppNumber("628123456789")).toBe(true);
    });

    it("accepts 10-digit 08 number", () => {
      expect(validateWhatsAppNumber("0812345678")).toBe(true);
    });

    it("accepts 13-digit 08 number", () => {
      expect(validateWhatsAppNumber("0812345678901")).toBe(true);
    });

    it("handles spaces in number", () => {
      expect(validateWhatsAppNumber("0812 3456 789")).toBe(true);
    });

    it("handles dashes in number", () => {
      expect(validateWhatsAppNumber("0812-3456-789")).toBe(true);
    });

    it("handles mixed spaces and dashes", () => {
      expect(validateWhatsAppNumber("0812 3456-789")).toBe(true);
    });
  });

  describe("invalid numbers", () => {
    it("rejects empty string", () => {
      expect(validateWhatsAppNumber("")).toBe(false);
    });

    it("rejects too short number", () => {
      expect(validateWhatsAppNumber("0812345")).toBe(false);
    });

    it("rejects non-08 prefix", () => {
      expect(validateWhatsAppNumber("09123456789")).toBe(false);
    });

    it("rejects random text", () => {
      expect(validateWhatsAppNumber("abc")).toBe(false);
    });

    it("rejects international non-ID", () => {
      expect(validateWhatsAppNumber("+1234567890")).toBe(false);
    });

    it("rejects too long number", () => {
      // 08 + 12 digits = too long (max is 08 + 11)
      expect(validateWhatsAppNumber("081234567890123")).toBe(false);
    });
  });
});

// ============================================================
// validateForm
// ============================================================

describe("validateForm", () => {
  const validData = {
    name: "John Doe",
    whatsapp: "08123456789",
    address: "Jl. Merdeka No. 1",
    notes: "",
  };

  it("returns no errors for valid data", () => {
    const errors = validateForm(validData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  describe("name validation", () => {
    it("returns error for empty name", () => {
      const errors = validateForm({ ...validData, name: "" });
      expect(errors.name).toBeDefined();
      expect(errors.name).toContain("wajib");
    });

    it("returns error for whitespace-only name", () => {
      const errors = validateForm({ ...validData, name: "   " });
      expect(errors.name).toBeDefined();
    });

    it("returns error for 1-char name", () => {
      const errors = validateForm({ ...validData, name: "A" });
      expect(errors.name).toContain("minimal");
    });

    it("accepts 2-char name", () => {
      const errors = validateForm({ ...validData, name: "AB" });
      expect(errors.name).toBeUndefined();
    });
  });

  describe("whatsapp validation", () => {
    it("returns error for empty whatsapp", () => {
      const errors = validateForm({ ...validData, whatsapp: "" });
      expect(errors.whatsapp).toBeDefined();
      expect(errors.whatsapp).toContain("wajib");
    });

    it("returns error for invalid format", () => {
      const errors = validateForm({ ...validData, whatsapp: "12345" });
      expect(errors.whatsapp).toContain("tidak valid");
    });
  });

  describe("address validation", () => {
    it("returns error for empty address", () => {
      const errors = validateForm({ ...validData, address: "" });
      expect(errors.address).toBeDefined();
      expect(errors.address).toContain("wajib");
    });

    it("returns error for whitespace-only address", () => {
      const errors = validateForm({ ...validData, address: "   " });
      expect(errors.address).toBeDefined();
    });
  });

  it("returns multiple errors when multiple fields invalid", () => {
    const errors = validateForm({
      name: "",
      whatsapp: "",
      address: "",
      notes: "",
    });
    expect(Object.keys(errors)).toHaveLength(3);
    expect(errors.name).toBeDefined();
    expect(errors.whatsapp).toBeDefined();
    expect(errors.address).toBeDefined();
  });
});

// ============================================================
// showFieldError / clearFieldError (DOM)
// ============================================================

describe("showFieldError", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="customerName" />
      <span id="customerNameError"></span>
      <input id="customerWhatsapp" />
      <span id="customerWhatsappError"></span>
    `;
  });

  it("sets error text on error element", () => {
    showFieldError("customerName", "Nama wajib diisi");
    const errorEl = document.getElementById("customerNameError");
    expect(errorEl!.textContent).toBe("Nama wajib diisi");
  });

  it("adds 'error' class to input element", () => {
    showFieldError("customerName", "Error");
    const inputEl = document.getElementById("customerName");
    expect(inputEl!.classList.contains("error")).toBe(true);
  });

  it("handles missing error element gracefully", () => {
    // No "missingFieldError" element exists
    expect(() => showFieldError("missingField", "Error")).not.toThrow();
  });

  it("handles missing input element gracefully", () => {
    document.body.innerHTML = '<span id="onlyErrorError"></span>';
    expect(() => showFieldError("onlyError", "Msg")).not.toThrow();
    expect(document.getElementById("onlyErrorError")!.textContent).toBe("Msg");
  });
});

describe("clearFieldError", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="customerName" class="error" />
      <span id="customerNameError">Some error</span>
    `;
  });

  it("clears error text", () => {
    clearFieldError("customerName");
    const errorEl = document.getElementById("customerNameError");
    expect(errorEl!.textContent).toBe("");
  });

  it("removes 'error' class from input", () => {
    clearFieldError("customerName");
    const inputEl = document.getElementById("customerName");
    expect(inputEl!.classList.contains("error")).toBe(false);
  });

  it("handles missing elements gracefully", () => {
    expect(() => clearFieldError("nonExistent")).not.toThrow();
  });
});

