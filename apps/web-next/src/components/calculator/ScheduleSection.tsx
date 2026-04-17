/**
 * ScheduleSection Component - matches original Calculator.astro styling
 */

import { useState, useEffect } from "react";
import type { CalculatorActions } from "./useCalculatorState";
import "./styles.css";

interface ScheduleSectionProps {
  actions: CalculatorActions;
  errors: Record<string, string>;
}

export function ScheduleSection({ actions, errors }: ScheduleSectionProps) {
  const { state, setDuration, setStartDate, clearError } = actions;

  const today = new Date().toISOString().split("T")[0];

  // Local state for duration input to allow empty/intermediate values
  const [durationInput, setDurationInput] = useState(String(state.duration));

  // Sync local state when state.duration changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing derived local state from prop
    setDurationInput(String(state.duration));
  }, [state.duration]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDurationInput(rawValue); // Allow any input while typing

    // Only update state if it's a valid number
    const parsed = parseInt(rawValue, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setDuration(Math.min(365, parsed));
      clearError("duration");
    }
  };

  const handleDurationBlur = () => {
    // On blur, ensure valid value
    const parsed = parseInt(durationInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setDurationInput("1");
      setDuration(1);
    } else if (parsed > 365) {
      setDurationInput("365");
      setDuration(365);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    clearError("startDate");
  };

  return (
    <div className="calc-form-section">
      {/* Section Header */}
      <div className="calc-section-header">
        <span className="calc-section-number">2</span>
        <span className="calc-section-title">Jadwal Sewa</span>
      </div>

      {/* Duration */}
      <div className="calc-form-group">
        <label htmlFor="duration" className="calc-form-label">
          Lama Sewa
        </label>
        <div className="calc-duration-stepper">
          <button
            type="button"
            className="calc-btn-stepper"
            onClick={() => {
              const newValue = Math.max(1, state.duration - 1);
              setDuration(newValue);
              clearError("duration");
            }}
            disabled={state.duration <= 1}
          >
            −
          </button>
          <input
            type="number"
            id="duration"
            min="1"
            max="365"
            value={durationInput}
            onChange={handleDurationChange}
            onBlur={handleDurationBlur}
            className={`calc-form-input calc-duration-input ${errors.duration ? "error" : ""}`}
          />
          <span className="calc-duration-unit">hari</span>
          <button
            type="button"
            className="calc-btn-stepper"
            onClick={() => {
              const newValue = Math.min(365, state.duration + 1);
              setDuration(newValue);
              clearError("duration");
            }}
            disabled={state.duration >= 365}
          >
            +
          </button>
        </div>
        {errors.duration && (
          <p className="calc-error-message">{errors.duration}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="calc-form-group">
        <label htmlFor="startDate" className="calc-form-label">
          Tanggal Mulai
        </label>
        <input
          type="date"
          id="startDate"
          min={today}
          value={state.startDate || ""}
          onChange={handleDateChange}
          className={`calc-form-input ${errors.startDate ? "error" : ""}`}
        />
        {errors.startDate && (
          <p className="calc-error-message">{errors.startDate}</p>
        )}
      </div>
    </div>
  );
}
