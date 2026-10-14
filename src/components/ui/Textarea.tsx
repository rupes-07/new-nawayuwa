import React, { useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  id,
  className = '',
  required,
  rows = 4,
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

      <textarea
        id={inputId}
        required={required}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`w-full p-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-muted)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed ${
          error ? 'border-[var(--color-danger)]' : ''
        } ${className}`}
        {...props}
      />

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
