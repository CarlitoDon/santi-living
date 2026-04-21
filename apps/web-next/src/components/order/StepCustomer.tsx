'use client';

import { useCallback } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';

interface StepCustomerProps {
  errors: Record<string, string>;
  setErrors: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  onClearError: (field: string) => void;
  onNext: () => void;
}

export function StepCustomer({ errors, setErrors, onClearError, onNext }: StepCustomerProps) {
  const { customer, setCustomer } = useCalculatorContext();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ name: e.target.value });
    if (e.target.value.trim()) onClearError('customerName');
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ whatsapp: e.target.value });
    const cleaned = e.target.value.replace(/[\s-]/g, '');
    const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
    if (patterns.some((p) => p.test(cleaned))) {
      onClearError('customerWhatsapp');
    }
  };

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.name.trim()) {
      newErrors.customerName = 'Nama wajib diisi';
    }

    if (!customer.whatsapp.trim()) {
      newErrors.customerWhatsapp = 'No. WhatsApp wajib diisi';
    } else {
      const cleaned = customer.whatsapp.replace(/[\s-]/g, '');
      const patterns = [/^08\d{8,11}$/, /^\+628\d{8,11}$/, /^628\d{8,11}$/];
      if (!patterns.some((p) => p.test(cleaned))) {
        newErrors.customerWhatsapp = 'Format nomor tidak valid (contoh: 08123456789)';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  }, [customer.name, customer.whatsapp, setErrors]);

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">👤 Data Pemesan</h2>
      <p className="wizard-step-subtitle">Siapa yang memesan?</p>

      {/* Name */}
      <div className="wizard-field">
        <label htmlFor="w-name" className="wizard-label">Nama Lengkap</label>
        <input
          type="text"
          id="w-name"
          placeholder="Nama lengkap"
          value={customer.name}
          onChange={handleNameChange}
          className={`wizard-input ${errors.customerName ? 'error' : ''}`}
          autoComplete="name"
          suppressHydrationWarning
        />
        {errors.customerName && <p className="wizard-error">{errors.customerName}</p>}
      </div>

      {/* WhatsApp */}
      <div className="wizard-field">
        <label htmlFor="w-whatsapp" className="wizard-label">No. WhatsApp</label>
        <input
          type="tel"
          id="w-whatsapp"
          placeholder="08xxxxxxxxxx"
          value={customer.whatsapp}
          onChange={handleWhatsappChange}
          className={`wizard-input ${errors.customerWhatsapp ? 'error' : ''}`}
          autoComplete="tel"
          suppressHydrationWarning
        />
        {errors.customerWhatsapp && <p className="wizard-error">{errors.customerWhatsapp}</p>}
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="wizard-next-btn"
      >
        Lanjutkan →
      </button>
    </div>
  );
}
