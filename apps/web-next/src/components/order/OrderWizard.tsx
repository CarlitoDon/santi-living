'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorContext } from '@/contexts/CalculatorContext';
import { StepSchedule } from './StepSchedule';
import { StepCustomer } from './StepCustomer';
import { StepAddress } from './StepAddress';
import { StepReview } from './StepReview';
import '@/styles/order-wizard.css';

const STEPS = [
  { id: 1, label: 'Jadwal' },
  { id: 2, label: 'Data Diri' },
  { id: 3, label: 'Alamat' },
  { id: 4, label: 'Review' },
] as const;

function ProgressBar({ current, total, onStepClick }: { current: number; total: number; onStepClick: (step: number) => void }) {
  return (
    <div className="wizard-progress">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < current;
        const isActive = step === current;
        const isClickable = isCompleted;
        return (
          <div key={step} className="wizard-progress-step">
            <button
              type="button"
              className={`wizard-progress-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              aria-label={`Ke langkah ${step}: ${STEPS[i].label}`}
            >
              {isCompleted ? '✓' : step}
            </button>
            <span className={`wizard-progress-label ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && onStepClick(step)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => isClickable && e.key === 'Enter' && onStepClick(step)}
            >
              {STEPS[i].label}
            </span>
            {i < total - 1 && (
              <div className={`wizard-progress-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OrderWizard() {
  const router = useRouter();
  const { actions } = useCalculatorContext();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Redirect to homepage if no items in cart
  useEffect(() => {
    // Small delay to allow sessionStorage hydration
    const timer = setTimeout(() => {
      if (actions.state.totalQuantity === 0) {
        router.replace('/');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [actions.state.totalQuantity, router]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    if (step === 1) {
      router.back();
      return;
    }
    setDirection('backward');
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, router]);

  const goToStep = useCallback((target: number) => {
    if (target < step) {
      setDirection('backward');
      setStep(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Cart summary bar (always visible)
  const { state } = actions;
  const pricePerDay = state.items.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity,
    0,
  );
  const formatCurrency = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  if (state.totalQuantity === 0) {
    return (
      <div className="wizard-empty">
        <p>Memuat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <button type="button" onClick={goBack} className="wizard-back-btn" aria-label="Kembali">
          ← Kembali
        </button>
        <div className="wizard-header-summary">
          <span className="wizard-header-count">{state.totalQuantity} item</span>
          <span className="wizard-header-price">Rp{formatCurrency(pricePerDay)}/hari</span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar current={step} total={4} onStepClick={goToStep} />

      {/* Step Content */}
      <div className={`wizard-step-content wizard-slide-${direction}`} key={step}>
        {step === 1 && (
          <StepSchedule
            errors={errors}
            onClearError={clearError}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 2 && (
          <StepCustomer
            errors={errors}
            setErrors={setErrors}
            onClearError={clearError}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <StepAddress
            errors={errors}
            setErrors={setErrors}
            onClearError={clearError}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 4 && (
          <StepReview setErrors={setErrors} onBack={goBack} />
        )}
      </div>
    </div>
  );
}
