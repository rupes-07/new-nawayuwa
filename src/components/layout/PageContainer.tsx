import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'main' | 'div' | 'section';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  subtleDhaka?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  as = 'main',
  maxWidth = 'xl',
  subtleDhaka = false,
  className = '',
  ...props
}) => {
  const Component = as;

  const maxWidthStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl', // 1440px target container width
    '2xl': 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <Component
      className={`relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 ${maxWidthStyles[maxWidth]} ${className}`}
      {...props}
    >
      {subtleDhaka && (
        <div
          className="absolute inset-0 pattern-dhaka pointer-events-none -z-10"
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  );
};
