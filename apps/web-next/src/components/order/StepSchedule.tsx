'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCalculatorContext } from '@/contexts/CalculatorContext';

interface StepScheduleProps {
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  onNext: () => void;
}

export function StepSchedule({ errors, onClearError, onNext }: StepScheduleProps) {
  const { actions } = useCalculatorContext();
  const { state } = actions;

  const today = new Date().toISOString().split('T')[0];
  const [durationInput, setDurationInput] = useState(String(state.duration));

  useEffect(() => {
    setDurationInput(String(state.duration));
  }, [state.duration]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDurationInput(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      actions.setDuration(Math.min(365, parsed));
      onClearError('duration');
    }
  };

  const handleDurationBlur = () => {
    const parsed = parseInt(durationInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setDurationInput('1');
      actions.setDuration(1);
    } else if (parsed > 365) {
      setDurationInput('365');
      actions.setDuration(365);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setStartDate(e.target.value);
    onClearError('startDate');
  };

  const validate = useCallback((): boolean => {
    if (!state.startDate) return false;
    if (state.duration < 1) return false;
    return true;
  }, [state.startDate, state.duration]);

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  // Upsell prompts
  const showDurationUpsell = state.totalQuantity > 0 && state.duration < 3;

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">📅 Jadwal Sewa</h2>
      <p className="wizard-step-subtitle">Berapa lama dan mulai kapan?</p>

      {/* Duration */}
      <div className="wizard-field">
        <label htmlFor="w-duration" className="wizard-label">Lama Sewa</label>
        <div className="wizard-duration-row">
          <button
            type="button"
            className="wizard-stepper-btn"
            onClick={() => {
              const v = Math.max(1, state.duration - 1);
              actions.setDuration(v);
              onClearError('duration');
            }}
            disabled={state.duration <= 1}
          >
            −
          </button>
          <input
            type="number"
            id="w-duration"
            min="1"
            max="365"
            value={durationInput}
            onChange={handleDurationChange}
            onBlur={handleDurationBlur}
            className="wizard-duration-input"
            suppressHydrationWarning
          />
          <span className="wizard-duration-unit">hari</span>
          <button
            type="button"
            className="wizard-stepper-btn"
            onClick={() => {
              const v = Math.min(365, state.duration + 1);
              actions.setDuration(v);
              onClearError('duration');
            }}
            disabled={state.duration >= 365}
          >
            +
          </button>
        </div>
        {errors.duration && <p className="wizard-error">{errors.duration}</p>}
      </div>

      {/* Duration upsell */}
      {showDurationUpsell && (
        <div className="wizard-upsell">
          📅 Tambah <strong>{3 - state.duration} hari</strong> lagi untuk diskon durasi <strong>5%</strong>!
        </div>
      )}

      {/* Start date */}
      <div className="wizard-field">
        <label htmlFor="w-startDate" className="wizard-label">Tanggal Mulai Sewa</label>
        <input
          type="date"
          id="w-startDate"
          min={today}
          value={state.startDate || ''}
          onChange={handleDateChange}
          className={`wizard-input ${errors.startDate ? 'error' : ''}`}
          suppressHydrationWarning
        />
        {errors.startDate && <p className="wizard-error">{errors.startDate}</p>}
      </div>

      {/* Delivery estimate */}
      {state.deliveryEstimate && (
        <div className="wizard-info-box">
          🚚 {state.deliveryEstimate}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="wizard-next-btn"
        disabled={!validate()}
      >
        Lanjutkan →
      </button>
    </div>
  );
}
