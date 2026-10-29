/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { I18nProvider } from './context/I18nContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { HomePage } from './components/home/HomePage.tsx';
import {
  ChaptersDirectoryPage,
  ChapterDetailPage,
  IssuesRegistryPage,
  IssueDetailPage,
  ImpactPage,
  HowItWorksPage,
} from './components/pages/index.ts';
import {
  LeaderLayout,
  LeaderDashboardPage,
  LeaderMembersPage,
  LeaderIssuesPage,
  LeaderNewProjectPage,
  LeaderAttendancePage,
  LeaderPromotionsPage,
} from './components/leader/index.ts';
import {
  AdminLayout,
  AdminDashboardPage,
  AdminChaptersPage,
  AdminPromotionsPage,
  AdminModerationPage,
  AdminConfigPage,
  AdminAuditPage,
} from './components/admin/index.ts';
import { SignInPage, OnboardingPage } from './components/auth/index.ts';
import { GlobalLayout } from './components/layout/GlobalLayout.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { MatchesSection } from './components/MatchesSection.tsx';
import { SquadSection } from './components/SquadSection.tsx';
import { EventsSection } from './components/EventsSection.tsx';
import { TransparencySection } from './components/TransparencySection.tsx';
import { NoticesSection } from './components/NoticesSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { MembershipFormModal } from './components/MembershipFormModal.tsx';
import { ReportIssueModal } from './components/ReportIssueModal.tsx';
import { DesignSystemShowcase } from './components/DesignSystemShowcase.tsx';
import { Phase2Showcase } from './components/Phase2Showcase.tsx';

// Dashboard components
import { DashboardLayout } from './components/Dashboard/DashboardLayout.tsx';
import { DashboardOverview } from './components/Dashboard/DashboardOverview.tsx';
import { DashboardFixtures } from './components/Dashboard/DashboardFixtures.tsx';
import { DashboardSquad } from './components/Dashboard/DashboardSquad.tsx';
import { DashboardMembers } from './components/Dashboard/DashboardMembers.tsx';
import { DashboardIdCard } from './components/Dashboard/DashboardIdCard.tsx';
import { DashboardFinances } from './components/Dashboard/DashboardFinances.tsx';
import { DashboardNotices } from './components/Dashboard/DashboardNotices.tsx';
import { DashboardProfile } from './components/Dashboard/DashboardProfile.tsx';

function MainContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'phase2-layout' | 'phase1-tokens' | 'portal' | 'dashboard'>('home');
  const [activePath, setActivePath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'my-chapter' | 'report' | 'projects' | 'me'>('home');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Sync browser back/forward popstate
  React.useEffect(() => {
    const onPopState = () => {
      setActivePath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Smooth Navigation handler with URL bar sync
  const handleNavigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // In restricted iframe environments, pushState is handled gracefully
    }
    setActivePath(path);
    if (currentView !== 'home') {
      setCurrentView('home');
    }

    if (path.includes('#')) {
      const hash = path.split('#')[1];
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToPortalSection = (id: string) => {
    if (currentView !== 'portal') {
      setCurrentView('portal');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderDashboardTab = () => {
    switch (dashboardTab) {
      case 'fixtures':
        return <DashboardFixtures />;
      case 'squad':
        return <DashboardSquad />;
      case 'members':
        return <DashboardMembers />;
      case 'idcard':
        return <DashboardIdCard />;
      case 'finance':
        return <DashboardFinances />;
      case 'notices':
        return <DashboardNotices />;
      case 'profile':
        return <DashboardProfile />;
      case 'overview':
      default:
        return <DashboardOverview onNavigateTab={(tab) => setDashboardTab(tab)} />;
    }
  };

  // Render Public Civic Route based on activePath
  const renderPublicRoute = () => {
    const cleanPath = activePath.split('?')[0].split('#')[0];

    // 1. Chapter Detail Route: /chapters/:slug
    if (cleanPath.startsWith('/chapters/') && cleanPath.length > '/chapters/'.length) {
      const slug = cleanPath.replace('/chapters/', '');
      return (
        <ChapterDetailPage
          slugOrId={slug}
          onNavigate={handleNavigate}
          onOpenJoin={() => setApplyModalOpen(true)}
          onOpenReport={() => setReportModalOpen(true)}
        />
      );
    }

    // 2. Chapters Directory Route: /chapters
    if (cleanPath === '/chapters') {
      return (
        <ChaptersDirectoryPage
          onNavigate={handleNavigate}
          onOpenJoin={() => setApplyModalOpen(true)}
        />
      );
    }

    // 3. Issue Detail Route: /issues/:id
    if (cleanPath.startsWith('/issues/') && cleanPath.length > '/issues/'.length) {
      const id = cleanPath.replace('/issues/', '');
      return (
        <IssueDetailPage
          id={id}
          onNavigate={handleNavigate}
          onOpenReport={() => setReportModalOpen(true)}
          onOpenJoin={() => setApplyModalOpen(true)}
        />
      );
    }

    // 4. Issues Registry Route: /issues
    if (cleanPath === '/issues') {
      return (
        <IssuesRegistryPage
          onNavigate={handleNavigate}
          onOpenReport={() => setReportModalOpen(true)}
        />
      );
    }

    // 5. Impact Route: /impact
    if (cleanPath === '/impact') {
      return (
        <ImpactPage
          onNavigate={handleNavigate}
          onOpenJoin={() => setApplyModalOpen(true)}
          onOpenReport={() => setReportModalOpen(true)}
        />
      );
    }

    // 6. How It Works Route: /how-it-works
    if (cleanPath === '/how-it-works') {
      return (
        <HowItWorksPage
          onNavigate={handleNavigate}
          onOpenJoin={() => setApplyModalOpen(true)}
          onOpenReport={() => setReportModalOpen(true)}
        />
      );
    }

    // 7. Phase 11: Leader Routes
    if (cleanPath.startsWith('/leader')) {
      return (
        <LeaderLayout
          activePath={cleanPath}
          onNavigate={handleNavigate}
        >
          {(ctx) => {
            if (cleanPath === '/leader/members') {
              return <LeaderMembersPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/leader/issues') {
              return <LeaderIssuesPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/leader/projects/new') {
              return <LeaderNewProjectPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/leader/attendance') {
              return <LeaderAttendancePage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/leader/promotions') {
              return <LeaderPromotionsPage context={ctx} onNavigate={handleNavigate} />;
            }
            // Default: /leader/dashboard
            return <LeaderDashboardPage context={ctx} onNavigate={handleNavigate} />;
          }}
        </LeaderLayout>
      );
    }

    // 8. Phase 12: Platform Administration Routes
    if (cleanPath.startsWith('/admin')) {
      return (
        <AdminLayout
          activePath={cleanPath}
          onNavigate={handleNavigate}
        >
          {(ctx) => {
            if (cleanPath === '/admin/chapters') {
              return <AdminChaptersPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/admin/promotions') {
              return <AdminPromotionsPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/admin/moderation') {
              return <AdminModerationPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/admin/config') {
              return <AdminConfigPage context={ctx} onNavigate={handleNavigate} />;
            }
            if (cleanPath === '/admin/audit') {
              return <AdminAuditPage context={ctx} onNavigate={handleNavigate} />;
            }
            // Default: /admin/dashboard
            return <AdminDashboardPage context={ctx} onNavigate={handleNavigate} />;
          }}
        </AdminLayout>
      );
    }

    // 9. Phase 5: Authentication & Onboarding Routes
    if (cleanPath === '/sign-in') {
      return <SignInPage onNavigate={handleNavigate} />;
    }

    if (cleanPath === '/onboarding') {
      return <OnboardingPage onNavigate={handleNavigate} />;
    }

    if (cleanPath === '/dashboard') {
      if (!user) {
        return <SignInPage onNavigate={handleNavigate} redirectUrl="/dashboard" />;
      }
      if (!user.onboardingCompleted) {
        return <OnboardingPage onNavigate={handleNavigate} />;
      }
      return (
        <DashboardLayout
          currentTab={dashboardTab}
          setCurrentTab={setDashboardTab}
          onBackToHome={() => handleNavigate('/')}
        >
          {renderDashboardTab()}
        </DashboardLayout>
      );
    }

    // Default: Home Page
    return (
      <HomePage
        onOpenJoin={() => setApplyModalOpen(true)}
        onOpenReport={() => setReportModalOpen(true)}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Phase Navigation & Testing Inspector */}
      <aside aria-label="Phase navigation" className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-2 text-xs flex items-center justify-between z-50 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0 mr-3">
          <span className="font-bold text-[#FA5A00]">Nawa Yuwa Foundation:</span>
          <span className="text-[var(--color-muted)] hidden md:inline">
            Auth & Role Permissions
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <button
            onClick={() => handleNavigate('/')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && (activePath === '/' || activePath === '/home')
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('/sign-in')}
            className={`touch-target px-2.5 py-1 rounded-md font-bold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/sign-in'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            /sign-in
          </button>
          <button
            onClick={() => handleNavigate('/onboarding')}
            className={`touch-target px-2.5 py-1 rounded-md font-bold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/onboarding'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-amber-600/15 text-amber-700 dark:text-amber-400 border border-amber-600/30 hover:bg-amber-600 hover:text-white'
            }`}
          >
            /onboarding
          </button>
          <button
            onClick={() => handleNavigate('/chapters')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath.startsWith('/chapters')
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /chapters
          </button>
          <button
            onClick={() => handleNavigate('/issues')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath.startsWith('/issues')
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /issues
          </button>
          <span className="text-[var(--color-border)] px-1">|</span>
          <button
            onClick={() => handleNavigate('/leader/dashboard')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath.startsWith('/leader')
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Leader Portal
          </button>
          <span className="text-[var(--color-border)] px-1">|</span>
          <button
            onClick={() => handleNavigate('/admin/dashboard')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/dashboard'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 font-bold hover:bg-indigo-600 hover:text-white'
            }`}
          >
            /admin/dashboard
          </button>
          <button
            onClick={() => handleNavigate('/admin/chapters')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/chapters'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /admin/chapters
          </button>
          <button
            onClick={() => handleNavigate('/admin/promotions')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/promotions'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /admin/promotions
          </button>
          <button
            onClick={() => handleNavigate('/admin/moderation')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/moderation'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /admin/moderation
          </button>
          <button
            onClick={() => handleNavigate('/admin/config')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/config'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /admin/config
          </button>
          <button
            onClick={() => handleNavigate('/admin/audit')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'home' && activePath === '/admin/audit'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            /admin/audit
          </button>
          <span className="text-[var(--color-border)] px-1">|</span>
          <button
            onClick={() => setCurrentView('phase2-layout')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'phase2-layout'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Layout
          </button>
          <button
            onClick={() => setCurrentView('phase1-tokens')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'phase1-tokens'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Tokens
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`touch-target px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Dashboard
          </button>
        </div>
      </aside>

      {/* Main Views */}
      {currentView === 'home' ? (
        <GlobalLayout
          activePath={activePath}
          onNavigate={handleNavigate}
          onOpenReport={() => setReportModalOpen(true)}
          onOpenJoin={() => setApplyModalOpen(true)}
          showMemberBottomNav={true}
          activeBottomItem={activeBottomNav}
          onSelectBottomItem={(item) => {
            setActiveBottomNav(item);
            if (item === 'home') handleNavigate('/');
            if (item === 'my-chapter') handleNavigate('/chapters');
            if (item === 'report') setReportModalOpen(true);
            if (item === 'projects') handleNavigate('/#projects');
            if (item === 'me') {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setAuthModalOpen(true);
              }
            }
          }}
        >
          {renderPublicRoute()}
        </GlobalLayout>
      ) : currentView === 'phase2-layout' ? (
        <Phase2Showcase />
      ) : currentView === 'phase1-tokens' ? (
        <DesignSystemShowcase />
      ) : currentView === 'portal' ? (
        <>
          <Navbar
            currentView="home"
            setCurrentView={(v) => setCurrentView(v as any)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenApply={() => setApplyModalOpen(true)}
          />

          <main className="flex-1">
            <Hero
              onOpenApply={() => setApplyModalOpen(true)}
              onOpenAuth={() => setAuthModalOpen(true)}
              onOpenDashboard={() => setCurrentView('dashboard')}
              onScrollToFixtures={() => scrollToPortalSection('fixtures')}
            />

            <MatchesSection />

            <SquadSection />

            <EventsSection />

            <TransparencySection />

            <NoticesSection />
          </main>

          <Footer
            onOpenApply={() => setApplyModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onScrollTo={scrollToPortalSection}
          />
        </>
      ) : (
        <DashboardLayout
          currentTab={dashboardTab}
          setCurrentTab={setDashboardTab}
          onBackToHome={() => setCurrentView('home')}
        >
          {renderDashboardTab()}
        </DashboardLayout>
      )}

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentView('dashboard');
        }}
      />

      <MembershipFormModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={() => {
          // Re-trigger scroll or feedback
          handleNavigate('/issues');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
