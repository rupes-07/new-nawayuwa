import React from 'react';
import {
  Home,
  Compass,
  AlertCircle,
  BarChart3,
  HelpCircle,
  X,
  ArrowRight,
  Shield,
  Building2,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { BrandLogo } from '../ui/BrandLogo.tsx';
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
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const navLinks = [
    { path: '/', label: t('navHome'), icon: Home },
    { path: '/chapters', label: t('navChapters'), icon: Compass },
    { path: '/issues', label: t('navCommunityIssues'), icon: AlertCircle },
    { path: '/impact', label: t('navImpact'), icon: BarChart3 },
    { path: '/how-it-works', label: t('navHowItWorks'), icon: HelpCircle },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate?.(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    onNavigate?.('/');
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
      <div className="w-full max-w-xs sm:max-w-sm bg-[var(--color-surface)] h-full ml-auto shadow-2xl flex flex-col justify-between border-l border-[var(--color-border)] animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <BrandLogo size="sm" showText={true} showSubtitle={false} onClick={() => handleLinkClick('/')} />
            <button
              type="button"
              onClick={onClose}
              className="touch-target p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] transition cursor-pointer"
              aria-label="Close mobile navigation menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* User Auth Banner in Mobile Menu */}
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/40">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[var(--color-border)] shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[#FA5A00]">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-[var(--color-foreground)] truncate">
                      {user.name}
                    </div>
                    <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('/dashboard')}
                    className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center gap-1.5 text-[var(--color-foreground)]"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#FA5A00]" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Button
                fullWidth
                variant="outline"
                size="sm"
                onClick={() => handleLinkClick('/sign-in')}
                leftIcon={<LogIn className="w-4 h-4 text-[#FA5A00]" />}
              >
                Sign In to Account
              </Button>
            )}
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
                  className={`w-full touch-target px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
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

            {/* Authorized Portals in Mobile */}
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleLinkClick('/admin/dashboard')}
                className="w-full touch-target px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between cursor-pointer text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 px-1.5 py-0.5 rounded font-bold">
                  Admin
                </span>
              </button>
            )}

            {(user?.role === 'chapter_leader' || user?.role === 'admin') && (
              <button
                type="button"
                onClick={() => handleLinkClick('/leader/dashboard')}
                className="w-full touch-target px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between cursor-pointer text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Chapter Leader Portal</span>
                </div>
                <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-950 px-1.5 py-0.5 rounded font-bold">
                  Leader
                </span>
              </button>
            )}
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
