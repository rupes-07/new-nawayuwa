import React from 'react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const { t } = useI18n();

  const logoSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Official Nawa Yuwa Foundation Emblem from brand asset */}
      <div className={`relative shrink-0 ${logoSizes[size]} rounded-xl overflow-hidden bg-white shadow-xs border border-[var(--color-border)] p-0.5 flex items-center justify-center transition-transform hover:scale-105 duration-150`}>
        <img
          src="/assets/aistudio/image_26f9ac04.png"
          alt="Nawa Yuwa Foundation Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-black tracking-tight ${textSizes[size]} flex items-center gap-1`}>
            <span className="text-[#002D62] dark:text-[#38BDF8]">NAWA</span>
            <span className="text-[#FA5A00] dark:text-[#FF7824]">YUWA</span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#002D62] dark:text-[#94A3B8] mt-0.5 flex items-center gap-1">
              <span className="inline-block w-2.5 h-[1.5px] bg-[#FA5A00]" />
              <span>FOUNDATION</span>
              <span className="inline-block w-2.5 h-[1.5px] bg-[#FA5A00]" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
