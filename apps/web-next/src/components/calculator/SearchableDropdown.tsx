/**
 * SearchableDropdown Component
 * Custom styled dropdown with search/filter capability
 */

import { useState, useRef, useEffect, useCallback } from "react";
import "./styles.css";

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  id: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  className?: string;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function SearchableDropdown({
  id,
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  disabled = false,
  loading = false,
  error = false,
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}: SearchableDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Support both controlled and uncontrolled modes
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    setInternalIsOpen(open);
  };

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- setIsOpen is a render-scoped wrapper
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- setIsOpen is a render-scoped wrapper
  }, [disabled, loading, isOpen]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps -- setIsOpen is a render-scoped wrapper
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      } else if (e.key === "Enter" && filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps -- setIsOpen is a render-scoped wrapper
    [filteredOptions, handleSelect],
  );

  return (
    <div
      ref={containerRef}
      className={`calc-dropdown ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${loading ? "loading" : ""} ${error ? "error" : ""} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        className="calc-dropdown-trigger"
        onClick={handleToggle}
        disabled={disabled || loading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={`calc-dropdown-value ${!displayValue ? "placeholder" : ""}`}
        >
          {loading ? "Memuat..." : displayValue || placeholder}
        </span>
        <span className="calc-dropdown-arrow">
          {loading ? (
            <svg
              className="calc-dropdown-spinner"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="calc-dropdown-menu" role="listbox">
          {/* Search Input */}
          <div className="calc-dropdown-search">
            <svg
              className="calc-dropdown-search-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="calc-dropdown-search-input"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              suppressHydrationWarning
            />
          </div>

          {/* Options List */}
          <ul className="calc-dropdown-options">
            {filteredOptions.length === 0 ? (
              <li className="calc-dropdown-empty">Tidak ditemukan</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`calc-dropdown-option ${option.value === value ? "selected" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option.value);
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                  {option.value === value && (
                    <svg
                      className="calc-dropdown-check"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
