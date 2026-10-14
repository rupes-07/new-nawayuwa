import React from 'react';
import { Home, Building2, AlertCircle, FolderKanban, User } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface MemberBottomNavProps {
  activeItem?: 'home' | 'my-chapter' | 'report' | 'projects' | 'me';
  onSelect?: (item: 'home' | 'my-chapter' | 'report' | 'projects' | 'me') => void;
  className?: string;
}

export const MemberBottomNav: React.FC<MemberBottomNavProps> = ({
  activeItem = 'home',
  onSelect,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <nav
      aria-label="Member Bottom Navigation"
      className={`fixed bottom-0 inset-x-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg px-2 py-1.5 transition-colors duration-200 lg:hidden ${className}`}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelect?.('home')}
          className={`touch-target flex flex-col items-center justify-center gap-1 w-full py-1 text-xs cursor-pointer select-none transition ${
            activeItem === 'home'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          aria-current={activeItem === 'home' ? 'page' : undefined}
          aria-label={t('bottomNavHome')}
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] leading-none">{t('bottomNavHome')}</span>
        </button>

        {/* 2. My Chapter */}
        <button
          type="button"
          onClick={() => onSelect?.('my-chapter')}
          className={`touch-target flex flex-col items-center justify-center gap-1 w-full py-1 text-xs cursor-pointer select-none transition ${
            activeItem === 'my-chapter'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          aria-current={activeItem === 'my-chapter' ? 'page' : undefined}
          aria-label={t('bottomNavChapter')}
        >
          <Building2 className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] leading-none truncate max-w-[54px]">{t('bottomNavChapter')}</span>
        </button>

        {/* 3. Report (Visually Prominent Central Action) */}
        <div className="relative -top-3 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => onSelect?.('report')}
            className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-[var(--color-surface)] touch-target focus-visible:outline-none"
            aria-label={`${t('bottomNavReport')} an issue`}
          >
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </button>
          <span className="text-[10px] font-bold text-[var(--color-primary)] mt-0.5">
            {t('bottomNavReport')}
          </span>
        </div>

        {/* 4. Projects */}
        <button
          type="button"
          onClick={() => onSelect?.('projects')}
          className={`touch-target flex flex-col items-center justify-center gap-1 w-full py-1 text-xs cursor-pointer select-none transition ${
            activeItem === 'projects'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          aria-current={activeItem === 'projects' ? 'page' : undefined}
          aria-label={t('bottomNavProjects')}
        >
          <FolderKanban className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] leading-none">{t('bottomNavProjects')}</span>
        </button>

        {/* 5. Me */}
        <button
          type="button"
          onClick={() => onSelect?.('me')}
          className={`touch-target flex flex-col items-center justify-center gap-1 w-full py-1 text-xs cursor-pointer select-none transition ${
            activeItem === 'me'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          aria-current={activeItem === 'me' ? 'page' : undefined}
          aria-label={t('bottomNavMe')}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] leading-none">{t('bottomNavMe')}</span>
        </button>
      </div>
    </nav>
  );
};
