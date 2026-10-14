import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className = '',
  required,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[var(--color-foreground)] select-none"
        >
          {label} {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}

      <div className="relative flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-muted)] transition-all">
        <select
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full min-h-[44px] appearance-none pl-3.5 pr-10 py-2.5 bg-transparent text-sm text-[var(--color-foreground)] focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-[var(--color-danger)]' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3.5 flex items-center text-[var(--color-muted)]">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-[var(--color-danger)] font-medium pt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[var(--color-muted)] pt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
