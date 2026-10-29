import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  PlusCircle,
  ClipboardCheck,
  Award,
  ShieldCheck,
  Building2,
  RefreshCw,
  LogIn,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useI18n } from '../../context/I18nContext.tsx';
import { api } from '../../services/api.ts';
import type { LeaderContext } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';

export interface LeaderLayoutProps {
  activePath: string;
  onNavigate: (path: string) => void;
  children: (context: LeaderContext, refreshContext: () => void) => React.ReactNode;
}

export const LeaderLayout: React.FC<LeaderLayoutProps> = ({
  activePath,
  onNavigate,
  children,
}) => {
  const { user, quickLogin } = useAuth();
  const { t } = useI18n();

  const [context, setContext] = useState<LeaderContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const fetchContext = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getLeaderContext();
      setContext(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load leadership permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
  }, [user]);

  const handleSwitchToLeader = async () => {
    try {
      setIsSwitching(true);
      await quickLogin('chapter_leader');
      await fetchContext();
    } catch (err: any) {
      setError(err.message || 'Failed to switch to chapter leader');
    } finally {
      setIsSwitching(false);
    }
  };

  const navTabs = [
    {
      id: 'dashboard',
      path: '/leader/dashboard',
      label: t('leaderDashboard'),
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'members',
      path: '/leader/members',
      label: t('leaderMembers'),
      icon: Users,
      badge: '6',
    },
    {
      id: 'issues',
      path: '/leader/issues',
      label: t('leaderIssues'),
      icon: AlertCircle,
      badge: '2',
    },
    {
      id: 'new-project',
      path: '/leader/projects/new',
      label: t('leaderNewProject'),
      icon: PlusCircle,
    },
    {
      id: 'attendance',
      path: '/leader/attendance',
      label: t('leaderAttendance'),
      icon: ClipboardCheck,
    },
    {
      id: 'promotions',
      path: '/leader/promotions',
      label: t('leaderPromotions'),
      icon: Award,
      badge: '2',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[var(--color-background)]">
      {/* Subheader / Leadership Bar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-foreground)]">
                    {context?.chapter?.name || 'Bardaghat Chapter'}
                  </h1>
                  <Badge variant="primary" size="sm">
                    {context?.chapter?.location?.split(',')[0] || 'Ward 16'}
                  </Badge>
                  {context?.authorized && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Server Authorized
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-muted)] font-medium mt-0.5">
                  Coordinator: <span className="font-semibold text-[var(--color-foreground)]">{context?.userName || user?.name || 'Bibek Sharma'}</span>
                  {' '}• {context?.chapter?.province || 'Lumbini Province'}
                </p>
              </div>
            </div>

            {/* Quick Actions / Role Switcher for Evaluation */}
            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/chapters/bardaghat')}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Public Page
              </Button>

              {(!context?.authorized || user?.role !== 'chapter_leader') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSwitchToLeader}
                  isLoading={isSwitching}
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                >
                  Switch to Leader Demo
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Mobile-Scrollable & Accessible) */}
          <nav
            aria-label="Chapter leader navigation tabs"
            className="flex items-center gap-1 sm:gap-2 mt-4 pt-1 overflow-x-auto no-scrollbar border-t border-[var(--color-border-subtle)]"
          >
            {navTabs.map((tab) => {
              const isActive = activePath === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.path)}
                  className={`touch-target flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--color-muted)]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] border border-[var(--color-border)]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <p className="text-sm font-medium text-[var(--color-muted)]">
              Verifying chapter leadership authorization...
            </p>
          </div>
        ) : !context?.authorized ? (
          /* Server Authorization Denied Guard Screen */
          <div className="max-w-xl mx-auto my-12 p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
              Chapter Leadership Authorization Required
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              You are currently viewing this view as <strong className="text-[var(--color-foreground)]">{user ? `${user.name} (${user.role})` : 'a guest / unauthenticated user'}</strong>. Chapter administration routes require server-granted leadership capabilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={handleSwitchToLeader}
                isLoading={isSwitching}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Sign in as Chapter Coordinator
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate('/')}
              >
                Return Home
              </Button>
            </div>
          </div>
        ) : (
          children(context, fetchContext)
        )}
      </main>
    </div>
  );
};
