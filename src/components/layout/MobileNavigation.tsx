import React, { useEffect } from 'react';
import { X, Home, Building2, AlertCircle, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { Button } from '../ui/Button.tsx';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onOpenReport?: () => void;
  onOpenJoin?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  activePath = '/',
  onNavigate,
  onOpenReport,
  onOpenJoin,
}) => {
  const { t } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { path: '/', label: t('navHome'), icon: Home },
    { path: '/chapters', label: t('navChapters'), icon: Building2 },
    { path: '/issues', label: t('navCommunityIssues'), icon: AlertCircle },
    { path: '/impact', label: t('navImpact'), icon: TrendingUp },
    { path: '/how-it-works', label: t('navHowItWorks'), icon: HelpCircle },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate?.(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs transition-opacity duration-200 lg:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div className="w-full max-w-xs sm:max-w-sm bg-[var(--color-surface)] h-full ml-auto shadow-2xl flex flex-col justify-between border-l border-[var(--color-border)] animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-sm">
                NY
              </div>
              <span className="font-extrabold text-sm text-[var(--color-foreground)]">
                {t('brandName')}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="touch-target p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] transition cursor-pointer"
              aria-label="Close mobile navigation menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Mobile Navigation Links" className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleLinkClick(item.path)}
                  className={`w-full touch-target px-3.5 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold'
                      : 'text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[var(--color-muted)]" aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Controls */}
        <div className="p-4 border-t border-[var(--color-border)] space-y-3 bg-[var(--color-surface-muted)]/50">
          <div className="flex items-center justify-between gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher showLabel={true} />
          </div>

          <div className="space-y-2 pt-2">
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                onOpenReport?.();
                onClose();
              }}
              leftIcon={<AlertCircle className="w-4 h-4 text-[var(--color-primary)]" />}
            >
              {t('navReportIssue')}
            </Button>

            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                onOpenJoin?.();
                onClose();
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('ctaJoinNawaYuwa')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
