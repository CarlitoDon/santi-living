/**
 * ScheduleSection Component - matches original Calculator.astro styling
 */

import type { CalculatorActions } from "./useCalculatorState";
import "./styles.css";

interface ScheduleSectionProps {
  actions: CalculatorActions;
  errors: Record<string, string>;
}

export function ScheduleSection({ actions, errors }: ScheduleSectionProps) {
  const { state, setDuration, setStartDate, clearError } = actions;

  const today = new Date().toISOString().split("T")[0];

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setDuration(Math.max(1, Math.min(365, value)));
    clearError("duration");
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
          Lama Sewa (hari)
        </label>
        <input
          type="number"
          id="duration"
          min="1"
          max="365"
          value={state.duration}
          onChange={handleDurationChange}
          className={`calc-form-input ${errors.duration ? "error" : ""}`}
        />
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
