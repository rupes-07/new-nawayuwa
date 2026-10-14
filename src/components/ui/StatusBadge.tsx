import React from 'react';
import { AlertCircle, Clock, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export type IssueStatus = 'Reported' | 'Under Review' | 'Verified' | 'In Progress' | 'Resolved';

export interface StatusBadgeProps {
  status: IssueStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const { t } = useI18n();

  const getStatusConfig = (s: string) => {
    switch (s.toLowerCase()) {
      case 'reported':
        return {
          label: t('statusReported'),
          icon: AlertCircle,
          colorClass: 'text-[var(--color-danger)] bg-[var(--color-danger-muted)] border-[var(--color-danger)]/20',
        };
      case 'under review':
      case 'under_review':
        return {
          label: t('statusUnderReview'),
          icon: Clock,
          colorClass: 'text-[var(--color-warning)] bg-[var(--color-warning-muted)] border-[var(--color-warning)]/20',
        };
      case 'verified':
        return {
          label: t('statusVerified'),
          icon: ShieldCheck,
          colorClass: 'text-[var(--color-info)] bg-[var(--color-info-muted)] border-[var(--color-info)]/20',
        };
      case 'in progress':
      case 'in_progress':
        return {
          label: t('statusInProgress'),
          icon: RefreshCw,
          colorClass: 'text-[var(--color-secondary)] bg-[var(--color-secondary-muted)] border-[var(--color-secondary)]/20',
        };
      case 'resolved':
        return {
          label: t('statusResolved'),
          icon: CheckCircle2,
          colorClass: 'text-[var(--color-success)] bg-[var(--color-success-muted)] border-[var(--color-success)]/20',
        };
      default:
        return {
          label: s,
          icon: AlertCircle,
          colorClass: 'text-[var(--color-muted)] bg-[var(--color-surface-muted)] border-[var(--color-border)]',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';
  const iconSizeClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border whitespace-nowrap select-none ${sizeClass} ${config.colorClass} ${className}`}
      aria-label={`Status: ${config.label}`}
    >
      <Icon className={`${iconSizeClass} shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
