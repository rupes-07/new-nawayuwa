import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-sm h-4 my-1',
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[var(--color-surface-muted)] ${variantStyles[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ hasImage?: boolean }> = ({ hasImage = true }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4 shadow-xs">
      {hasImage && <Skeleton height={180} className="w-full rounded-lg" />}
      <div className="space-y-2">
        <Skeleton height={20} className="w-3/4" />
        <Skeleton height={14} className="w-full" />
        <Skeleton height={14} className="w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
        <Skeleton height={16} width={80} />
        <Skeleton height={16} width={100} />
      </div>
    </div>
  );
};
