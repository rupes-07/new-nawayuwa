import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-[var(--color-muted)] ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {/* Home Root */}
        <li className="flex items-center">
          <button
            type="button"
            onClick={() => onNavigate?.('/')}
            className="flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition cursor-pointer"
            aria-label={t('navHome')}
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only text-xs">{t('navHome')}</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight
                className="w-3 h-3 text-[var(--color-border)] shrink-0"
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  className="font-semibold text-[var(--color-foreground)] truncate max-w-[180px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.href!)}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer truncate max-w-[140px] sm:max-w-none"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
