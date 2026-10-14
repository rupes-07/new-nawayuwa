import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs.tsx';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onNavigateBreadcrumb?: (href: string) => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  onNavigateBreadcrumb,
  className = '',
}) => {
  return (
    <div className={`space-y-3 pb-6 border-b border-[var(--color-border-subtle)] mb-6 sm:mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="pb-1">
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigateBreadcrumb} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <h1 className="type-h1 text-[var(--color-foreground)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="type-body text-[var(--color-muted)] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
