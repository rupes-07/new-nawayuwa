import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button.tsx';
import { useI18n } from '../../context/I18nContext.tsx';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl border border-[var(--color-danger)]/20 bg-[var(--color-surface)] flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-danger-muted)] text-[var(--color-danger)] flex items-center justify-center mb-4 border border-[var(--color-danger)]/20">
        <AlertTriangle className="w-7 h-7" aria-hidden="true" />
      </div>

      <h3 className="type-h3 font-bold text-[var(--color-foreground)] tracking-tight">
        {title || t('errorTitle')}
      </h3>

      <p className="type-body text-[var(--color-muted)] mt-1.5 max-w-sm">
        {description || t('errorDescription')}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {t('actionTryAgain')}
          </Button>
        </div>
      )}
    </div>
  );
};
