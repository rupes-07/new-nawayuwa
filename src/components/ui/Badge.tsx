import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    default:
      'bg-[var(--color-surface-muted)] text-[var(--color-foreground)] border border-[var(--color-border)]',
    primary:
      'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-transparent font-medium',
    secondary:
      'bg-[var(--color-secondary-muted)] text-[var(--color-secondary)] border border-transparent font-medium',
    outline:
      'bg-transparent text-[var(--color-muted)] border border-[var(--color-border)]',
    subtle:
      'text-[var(--color-muted)] bg-transparent',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
