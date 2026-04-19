/**
 * CustomerSection Component - matches original Calculator.astro styling
 */

import type { CustomerData } from "./types";
import "./styles.css";

interface CustomerSectionProps {
  customer: CustomerData;
  onChange: (updates: Partial<CustomerData>) => void;
  errors: Record<string, string>;
  onClearError: (field: string) => void;
}

export function CustomerSection({
  customer,
  onChange,
  errors,
  onClearError,
}: CustomerSectionProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: e.target.value });
    if (e.target.value.trim()) {
      onClearError("customerName");
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ whatsapp: e.target.value });
    const cleaned = e.target.value.replace(/[\s-]/g, "");
    const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
    if (patterns.some((p) => p.test(cleaned))) {
      onClearError("customerWhatsapp");
    }
  };

  return (
    <div className="calc-form-section">
      {/* Section Header */}
      <div className="calc-section-header">
        <span className="calc-section-number">3</span>
        <span className="calc-section-title">Data Pemesan</span>
      </div>

      {/* Name */}
      <div className="calc-form-group">
        <label htmlFor="customerName" className="calc-form-label">
          Nama
        </label>
        <input
          type="text"
          id="customerName"
          placeholder="Nama lengkap"
          value={customer.name}
          onChange={handleNameChange}
          className={`calc-form-input ${errors.customerName ? "error" : ""}`}
          suppressHydrationWarning
        />
        {errors.customerName && (
          <p className="calc-error-message">{errors.customerName}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="calc-form-group">
        <label htmlFor="customerWhatsapp" className="calc-form-label">
          No. WhatsApp
        </label>
        <input
          type="tel"
          id="customerWhatsapp"
          placeholder="08xxxxxxxxxx"
          value={customer.whatsapp}
          onChange={handleWhatsappChange}
          className={`calc-form-input ${errors.customerWhatsapp ? "error" : ""}`}
          suppressHydrationWarning
        />
        {errors.customerWhatsapp && (
          <p className="calc-error-message">{errors.customerWhatsapp}</p>
        )}
      </div>
    </div>
  );
}
