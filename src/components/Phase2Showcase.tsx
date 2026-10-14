import React, { useState } from 'react';
import {
  PublicHeader,
  PublicFooter,
  MemberBottomNav,
  PageContainer,
  Breadcrumbs,
  PageHeader,
  ThemeSwitcher,
  LanguageSwitcher,
} from './layout/index.ts';
import { Button } from './ui/Button.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card.tsx';
import { StatusBadge } from './ui/StatusBadge.tsx';
import { Badge } from './ui/Badge.tsx';
import { Dialog } from './ui/Dialog.tsx';
import { useI18n } from '../context/I18nContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  AlertCircle,
  Plus,
  Users,
  Compass,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const Phase2Showcase: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { theme } = useTheme();

  // Navigation simulation state
  const [activePath, setActivePath] = useState<string>('/issues');
  const [memberNavActive, setMemberNavActive] = useState<'home' | 'my-chapter' | 'report' | 'projects' | 'me'>('report');
  const [viewportWidth, setViewportWidth] = useState<'360' | '390' | '768' | '1024' | '1440' | 'full'>('full');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [showMemberBar, setShowMemberBar] = useState(true);
  const [enableDhaka, setEnableDhaka] = useState(false);

  const breadcrumbsList = [
    { label: t('navHome'), href: '/' },
    { label: t('navCommunityIssues'), href: '/issues', current: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Phase 2 Inspector Toolbar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-primary)]">Phase 2 Global Layout Inspector:</span>
            <span className="text-[var(--color-muted)] hidden sm:inline">
              Public Header, Footer, Mobile Navigation, Member Bottom Nav, Breadcrumbs, Page Header
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Viewport Presets Mandated by Spec */}
            <span className="text-[11px] text-[var(--color-muted)] font-semibold hidden md:inline">Test Viewport:</span>
            <div className="flex items-center bg-[var(--color-surface-muted)] p-1 rounded-lg border border-[var(--color-border)]">
              {(['360', '390', '768', '1024', '1440', 'full'] as const).map((width) => (
                <button
                  key={width}
                  type="button"
                  onClick={() => setViewportWidth(width)}
                  className={`touch-target px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    viewportWidth === width
                      ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs font-bold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {width === 'full' ? '100% Fluid' : `${width}px`}
                </button>
              ))}
            </div>

            {/* Toggle Member Bottom Bar */}
            <button
              type="button"
              onClick={() => setShowMemberBar(!showMemberBar)}
              className={`touch-target px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                showMemberBar
                  ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary)]/30'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
              }`}
            >
              {showMemberBar ? 'Member Bottom Nav: Active' : 'Member Bottom Nav: Hidden'}
            </button>

            {/* Toggle Dhaka Texture */}
            <button
              type="button"
              onClick={() => setEnableDhaka(!enableDhaka)}
              className={`touch-target px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                enableDhaka
                  ? 'bg-[var(--color-secondary-muted)] text-[var(--color-secondary)] border-[var(--color-secondary)]/30'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)]'
              }`}
            >
              {enableDhaka ? 'Dhaka Pattern: On' : 'Dhaka Pattern: Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Frame Container for Viewport Testing */}
      <div
        className={`mx-auto w-full transition-all duration-300 flex flex-col flex-1 ${
          viewportWidth === '360'
            ? 'max-w-[360px] border-x border-[var(--color-border)] shadow-2xl my-4 rounded-xl bg-[var(--color-background)]'
            : viewportWidth === '390'
            ? 'max-w-[390px] border-x border-[var(--color-border)] shadow-2xl my-4 rounded-xl bg-[var(--color-background)]'
            : viewportWidth === '768'
            ? 'max-w-[768px] border-x border-[var(--color-border)] shadow-2xl my-4 rounded-xl bg-[var(--color-background)]'
            : viewportWidth === '1024'
            ? 'max-w-[1024px] border-x border-[var(--color-border)] shadow-xl my-4 rounded-xl bg-[var(--color-background)]'
            : viewportWidth === '1440'
            ? 'max-w-[1440px] border-x border-[var(--color-border)] shadow-md my-2 bg-[var(--color-background)]'
            : 'max-w-full'
        }`}
      >
        {/* 1. Public Header */}
        <PublicHeader
          activePath={activePath}
          onNavigate={(p) => setActivePath(p)}
          onOpenReport={() => setReportModalOpen(true)}
          onOpenJoin={() => setJoinModalOpen(true)}
        />

        {/* 2. Page Container with Dhaka Texture Option */}
        <PageContainer subtleDhaka={enableDhaka} className="flex-1 pb-24 lg:pb-16">
          {/* 3. Page Header with Breadcrumbs & Actions */}
          <PageHeader
            title={
              activePath === '/chapters'
                ? t('navChapters')
                : activePath === '/issues'
                ? t('navCommunityIssues')
                : activePath === '/impact'
                ? t('navImpact')
                : activePath === '/how-it-works'
                ? t('navHowItWorks')
                : t('brandTagline')
            }
            description={
              activePath === '/issues'
                ? 'Explore reported community issues across Madhesh Pradesh and local wards, and follow their progress from submission to resolution.'
                : activePath === '/chapters'
                ? 'Connect with local Nawa Yuwa Club chapters and discover civic projects in your municipality.'
                : t('brandSupport')
            }
            breadcrumbs={breadcrumbsList}
            onNavigateBreadcrumb={(h) => setActivePath(h)}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Filter action')}
                >
                  {t('actionFilter')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setReportModalOpen(true)}
                  leftIcon={<AlertCircle className="w-3.5 h-3.5" />}
                >
                  {t('navReportIssue')}
                </Button>
              </div>
            }
          />

          {/* Sample Page Content Demonstrating Layout Reuse */}
          <div className="space-y-6">
            {/* Interactive Navigation Simulator Banner */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interactive Global Layout Verification</CardTitle>
                  <span className="text-xs text-[var(--color-muted)] font-mono">
                    Current Route: {activePath}
                  </span>
                </div>
                <CardDescription>
                  Click any navigation link above or use the test links below to verify responsive behavior across 360px, 390px, 768px, 1024px, and 1440px.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { path: '/', label: 'Home' },
                    { path: '/chapters', label: 'Chapters' },
                    { path: '/issues', label: 'Community Issues' },
                    { path: '/impact', label: 'Impact' },
                    { path: '/how-it-works', label: 'How It Works' },
                  ].map((route) => (
                    <Button
                      key={route.path}
                      size="sm"
                      variant={activePath === route.path ? 'primary' : 'outline'}
                      onClick={() => setActivePath(route.path)}
                    >
                      Go to: {route.label}
                    </Button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-surface-muted)] text-xs text-[var(--color-muted)] space-y-1">
                  <div className="font-semibold text-[var(--color-foreground)]">Verified Layout Standards:</div>
                  <div>• <strong>Top Bar Contract</strong>: Single brand element wordmark, 5 concise single-line links, 2 CTAs, responsive mobile drawer.</div>
                  <div>• <strong>Member Bottom Nav</strong>: Home, My Chapter, elevated crimson <strong>Report</strong> action button, Projects, Me.</div>
                  <div>• <strong>Page Container</strong>: Fluid 1440px baseline with responsive horizontal padding (16px to 32px), zero horizontal overflow.</div>
                  <div>• <strong>Breadcrumbs</strong>: Semantic ordered list with home root, chevrons, and accessible aria-current="page".</div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Civic Issue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hoverable={true}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Ward 4 · Dhanusha</span>
                    <StatusBadge status="Under Review" size="sm" />
                  </div>
                  <CardTitle className="text-base mt-2">
                    Drinking Water Pipe Leakage near Janakpurdham Chowk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="type-body text-[var(--color-muted)] text-xs line-clamp-2">
                    Main underground water pipeline rupture affecting 45 households since Tuesday morning.
                  </p>
                </CardContent>
              </Card>

              <Card hoverable={true}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Ward 16 · Bardaghat</span>
                    <StatusBadge status="In Progress" size="sm" />
                  </div>
                  <CardTitle className="text-base mt-2">
                    Community Waste Segregation & Compost Drive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="type-body text-[var(--color-muted)] text-xs line-clamp-2">
                    Youth volunteers coordinating with municipal sanitation department to install 12 compost bins.
                  </p>
                </CardContent>
              </Card>

              <Card hoverable={true}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Ward 2 · Birgunj</span>
                    <StatusBadge status="Resolved" size="sm" />
                  </div>
                  <CardTitle className="text-base mt-2">
                    Solar Street Lamp Repair in Adarshanagar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="type-body text-[var(--color-muted)] text-xs line-clamp-2">
                    Four non-functional streetlights repaired with ward authority backing, restoring pedestrian safety.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageContainer>

        {/* 4. Member Bottom Navigation (Prominent Report Center Button) */}
        {showMemberBar && (
          <MemberBottomNav
            activeItem={memberNavActive}
            onSelect={(item) => {
              setMemberNavActive(item);
              if (item === 'report') setReportModalOpen(true);
            }}
          />
        )}

        {/* 5. Public Footer */}
        <PublicFooter onNavigate={(p) => setActivePath(p)} />
      </div>

      {/* Report Modal */}
      <Dialog
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={t('navReportIssue')}
        description="Help your community by reporting a local issue. You can track progress transparently."
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-muted)]">
            Anonymous and signed-in reporting with offline queue support will be fully active in Phase 5.
          </p>
          <div className="p-3 bg-[var(--color-surface-muted)] rounded-lg text-xs font-semibold">
            Status: Form modal integrated and responsive across all viewports.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setReportModalOpen(false)}>
              {t('actionClose')}
            </Button>
            <Button variant="primary" onClick={() => setReportModalOpen(false)}>
              {t('actionSubmit')}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Join Modal */}
      <Dialog
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title={t('ctaJoinNawaYuwa')}
        description="Join young people working together to build stronger, more active and connected communities."
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-muted)]">
            User onboarding and account verification workflow will be fully active in Phase 3.
          </p>
          <div className="p-3 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-lg text-xs font-semibold">
            {t('brandTagline')}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={() => setJoinModalOpen(false)}>
              {t('actionContinue')}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
