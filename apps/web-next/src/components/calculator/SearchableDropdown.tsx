/**
 * SearchableDropdown Component
 * Custom styled dropdown with search/filter capability
 */

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import "./styles.css";
import { usePresence } from "@/hooks/usePresence";

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
  const [activeOptionValue, setActiveOptionValue] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);

  // Support both controlled and uncontrolled modes
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const presence = usePresence(isOpen, 180);
  const setIsOpen = useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    setInternalIsOpen(open);
  }, [onOpenChange]);

  const closeDropdown = useCallback(() => {
    triggerRef.current?.focus({ preventScroll: true });
    setIsOpen(false);
    setSearchTerm("");
    setActiveOptionValue(null);
  }, [setIsOpen]);

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const activeOptionIndex = filteredOptions.findIndex(
    (option) => option.value === activeOptionValue,
  );
  const activeOptionId =
    activeOptionIndex >= 0 ? `${id}-option-${activeOptionIndex}` : undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId, isOpen]);

  // Controlled parents can close this dropdown without calling closeDropdown. If
  // focus is still inside the retained exit subtree, move it before that subtree is
  // inert so keyboard users never lose their focus target.
  useLayoutEffect(() => {
    if (
      wasOpenRef.current &&
      !isOpen &&
      document.activeElement instanceof HTMLElement &&
      containerRef.current?.contains(document.activeElement)
    ) {
      triggerRef.current?.focus({ preventScroll: true });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (!disabled && !loading) {
      if (isOpen) closeDropdown();
      else {
        setIsOpen(true);
        setSearchTerm("");
        setActiveOptionValue(
          options.find((option) => option.value === value)?.value ??
            options[0]?.value ??
            null,
        );
      }
    }
  }, [closeDropdown, disabled, isOpen, loading, options, setIsOpen, value]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      closeDropdown();
    },
    [closeDropdown, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
        return;
      }

      if (filteredOptions.length === 0) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        const currentIndex =
          activeOptionIndex >= 0 ? activeOptionIndex : direction === 1 ? -1 : 0;
        const nextIndex =
          (currentIndex + direction + filteredOptions.length) %
          filteredOptions.length;
        setActiveOptionValue(filteredOptions[nextIndex].value);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        const nextIndex = e.key === "Home" ? 0 : filteredOptions.length - 1;
        setActiveOptionValue(filteredOptions[nextIndex].value);
      } else if (e.key === "Enter") {
        const option =
          filteredOptions[activeOptionIndex] ??
          (filteredOptions.length === 1 ? filteredOptions[0] : undefined);
        if (option) {
          e.preventDefault();
          handleSelect(option.value);
        }
      }
    },
    [activeOptionIndex, closeDropdown, filteredOptions, handleSelect],
  );

  return (
    <div
      ref={containerRef}
      className={`calc-dropdown ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${loading ? "loading" : ""} ${error ? "error" : ""} ${className}`}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="calc-dropdown-trigger"
        onClick={handleToggle}
        disabled={disabled || loading}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
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
      {presence.shouldRender && (
        <div
          className="calc-dropdown-menu"
          data-state={presence.state}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
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
              onChange={(e) => {
                const nextTerm = e.target.value;
                const firstMatch = options.find((option) =>
                  option.label.toLowerCase().includes(nextTerm.toLowerCase()),
                );
                setSearchTerm(nextTerm);
                setActiveOptionValue(firstMatch?.value ?? null);
              }}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-label="Cari pilihan"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={`${id}-listbox`}
              aria-activedescendant={activeOptionId}
              suppressHydrationWarning
            />
          </div>

          {/* Options List */}
          <ul
            id={`${id}-listbox`}
            className="calc-dropdown-options"
            role="listbox"
            aria-labelledby={id}
          >
            {filteredOptions.length === 0 ? (
              <li className="calc-dropdown-empty">Tidak ditemukan</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  className={`calc-dropdown-option ${option.value === value ? "selected" : ""} ${option.value === activeOptionValue ? "active" : ""}`}
                  onMouseEnter={() => setActiveOptionValue(option.value)}
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
