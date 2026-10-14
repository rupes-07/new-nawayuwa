import React, { useState } from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { MobileNavigation } from './MobileNavigation.tsx';
import { Button } from '../ui/Button.tsx';

export interface PublicHeaderProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  onOpenReport?: () => void;
  onOpenJoin?: () => void;
  className?: string;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePath = '/',
  onNavigate,
  onOpenReport,
  onOpenJoin,
  className = '',
}) => {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 5 navigation items mandated by specification
  const navItems = [
    { path: '/', label: t('navHome') },
    { path: '/chapters', label: t('navChapters') },
    { path: '/issues', label: t('navCommunityIssues') },
    { path: '/impact', label: t('navImpact') },
    { path: '/how-it-works', label: t('navHowItWorks') },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-xs transition-colors duration-200 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4 sm:gap-8">
            {/* Zone 1: Single-Element Brand Wordmark */}
            <div
              onClick={() => onNavigate?.('/')}
              className="flex items-center gap-3 cursor-pointer select-none shrink-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate?.('/');
              }}
              aria-label="Nawa Yuwa Club Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                NY
              </div>
              <div className="whitespace-nowrap shrink-0">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--color-foreground)] block leading-tight">
                  {t('brandName')}
                </span>
                <span className="text-[10px] text-[var(--color-muted)] font-medium block">
                  Youth & Community Action
                </span>
              </div>
            </div>

            {/* Zone 2: Desktop Navigation Links (Single Line, 5 exact items) */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-foreground)] whitespace-nowrap"
            >
              {navItems.map((item) => {
                const isActive = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onNavigate?.(item.path)}
                    className={`touch-target py-2 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                      isActive
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions & CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Switcher */}
              <div className="hidden sm:block">
                <ThemeSwitcher />
              </div>

              {/* Secondary CTA: Report an Issue */}
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenReport}
                  leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                >
                  {t('navReportIssue')}
                </Button>
              </div>

              {/* Primary CTA: Join Nawa Yuwa */}
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenJoin}
                className="whitespace-nowrap"
              >
                {t('ctaJoinNawaYuwa')}
              </Button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden touch-target p-2 rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] border border-[var(--color-border)] transition cursor-pointer"
                aria-label="Open mobile navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePath={activePath}
        onNavigate={onNavigate}
        onOpenReport={onOpenReport}
        onOpenJoin={onOpenJoin}
      />
    </>
  );
};
