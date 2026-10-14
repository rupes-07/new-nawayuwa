import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { locale, setLocale } = useI18n();

  const handleToggle = () => {
    setLocale(locale === 'en' ? 'ne' : 'en');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`touch-target px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] text-[var(--color-foreground)] transition flex items-center gap-1.5 cursor-pointer text-xs font-semibold focus-visible:outline-none ${className}`}
      aria-label={`Current language: ${locale === 'en' ? 'English' : 'Nepali'}. Click to switch to ${locale === 'en' ? 'Nepali' : 'English'}.`}
      title={locale === 'en' ? 'नेपालीमा हेर्नुहोस्' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
      <span>{locale === 'en' ? 'नेपाली' : 'English'}</span>
      {variant === 'full' && (
        <span className="text-[10px] text-[var(--color-muted)] font-normal ml-0.5">
          ({locale.toUpperCase()})
        </span>
      )}
    </button>
  );
};
