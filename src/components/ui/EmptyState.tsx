import React from 'react';
import { Inbox, Compass } from 'lucide-react';
import { Button } from './Button.tsx';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-muted)] flex items-center justify-center mb-4 border border-[var(--color-border)]">
        {icon || <Inbox className="w-7 h-7" aria-hidden="true" />}
      </div>

      <h3 className="type-h3 font-bold text-[var(--color-foreground)] tracking-tight">
        {title}
      </h3>

      <p className="type-body text-[var(--color-muted)] mt-1.5 max-w-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={onAction}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
