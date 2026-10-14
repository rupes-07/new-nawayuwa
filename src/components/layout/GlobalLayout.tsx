import React from 'react';
import { PublicHeader } from './PublicHeader.tsx';
import { PublicFooter } from './PublicFooter.tsx';
import { MemberBottomNav } from './MemberBottomNav.tsx';
import { PageContainer } from './PageContainer.tsx';

export interface GlobalLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onOpenReport?: () => void;
  onOpenJoin?: () => void;
  showMemberBottomNav?: boolean;
  activeBottomItem?: 'home' | 'my-chapter' | 'report' | 'projects' | 'me';
  onSelectBottomItem?: (item: 'home' | 'my-chapter' | 'report' | 'projects' | 'me') => void;
  subtleDhaka?: boolean;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  activePath = '/',
  onNavigate,
  onOpenReport,
  onOpenJoin,
  showMemberBottomNav = false,
  activeBottomItem = 'home',
  onSelectBottomItem,
  subtleDhaka = false,
}) => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-200">
      {/* 1. Public Header */}
      <PublicHeader
        activePath={activePath}
        onNavigate={onNavigate}
        onOpenReport={onOpenReport}
        onOpenJoin={onOpenJoin}
      />

      {/* 2. Main Page Container */}
      <PageContainer as="main" subtleDhaka={subtleDhaka} className="flex-1 pb-20 lg:pb-12">
        {children}
      </PageContainer>

      {/* 3. Member Bottom Navigation (Visible on mobile when enabled) */}
      {showMemberBottomNav && (
        <MemberBottomNav
          activeItem={activeBottomItem}
          onSelect={onSelectBottomItem}
        />
      )}

      {/* 4. Public Footer */}
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};
