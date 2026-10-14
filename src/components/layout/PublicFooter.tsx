import React from 'react';
import { useI18n } from '../../context/I18nContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';

export interface PublicFooterProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigate,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <footer
      className={`bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-muted)] text-xs transition-colors duration-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-base shadow-xs">
                NY
              </div>
              <div>
                <span className="font-extrabold text-base text-[var(--color-foreground)] block tracking-tight">
                  {t('brandName')}
                </span>
                <span className="text-[11px] text-[var(--color-muted)] font-medium block">
                  {t('brandTagline')}
                </span>
              </div>
            </div>

            <p className="type-body text-[var(--color-muted)] max-w-sm leading-relaxed">
              {t('footerMission')}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <LanguageSwitcher variant="full" />
              <ThemeSwitcher showLabel={true} />
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
              {t('footerNavigation')}
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/chapters')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navChapters')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/issues')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navCommunityIssues')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/impact')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navImpact')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/how-it-works')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navHowItWorks')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Community Participation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
              {t('footerCommunity')}
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/issues')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navReportIssue')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/projects')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navProjects')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/my-chapter')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('navMyChapter')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/leadership')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('footerLeadership')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
              {t('footerSupport')}
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/privacy')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('footerPrivacy')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/terms')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('footerTerms')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/contact')}
                  className="hover:text-[var(--color-foreground)] transition cursor-pointer"
                >
                  {t('footerContact')}
                </button>
              </li>
            </ul>

            {/* Social Placeholders */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[var(--color-muted)] block mb-1.5">
                Community Channels
              </span>
              <div className="flex items-center gap-2">
                {['Facebook', 'Instagram', 'YouTube', 'X'].map((net) => (
                  <span
                    key={net}
                    className="px-2 py-1 rounded bg-[var(--color-surface-muted)] text-[10px] font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition cursor-pointer border border-[var(--color-border)]"
                    aria-label={`${net} channel`}
                  >
                    {net}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-muted)]">
          <p className="font-medium text-[var(--color-foreground)]">
            {t('footerTagline')}
          </p>
          <p>
            © {new Date().getFullYear()} {t('brandName')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
