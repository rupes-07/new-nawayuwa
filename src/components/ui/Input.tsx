import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftAddon,
  rightAddon,
  id,
  className = '',
  required,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[var(--color-foreground)] select-none"
        >
          {label} {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}

      <div className="relative flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-muted)] transition-all">
        {leftAddon && (
          <div className="pl-3.5 pr-1.5 flex items-center text-[var(--color-muted)] select-none text-sm">
            {leftAddon}
          </div>
        )}

        <input
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full min-h-[44px] px-3.5 py-2.5 bg-transparent text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-[var(--color-danger)]' : ''
          } ${className}`}
          {...props}
        />

        {rightAddon && (
          <div className="pr-3.5 pl-1.5 flex items-center text-[var(--color-muted)] select-none text-sm">
            {rightAddon}
          </div>
        )}
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
