import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Shield,
  ShieldAlert,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Building2,
  Sliders,
  Sparkles,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useI18n } from '../../context/I18nContext.tsx';
import type { UserRole } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';

export interface AuthHeaderMenuProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export const AuthHeaderMenu: React.FC<AuthHeaderMenuProps> = ({
  onNavigate,
  className = '',
}) => {
  const { user, logout, quickLogin, isLoading } = useAuth();
  const { t } = useI18n();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleRoleSwitch = async (role: UserRole) => {
    setIsSwitching(true);
    try {
      await quickLogin(role);
      setDropdownOpen(false);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    onNavigate?.('/');
  };

  // Unauthenticated Guest View
  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate?.('/sign-in')}
          leftIcon={<LogIn className="w-3.5 h-3.5 text-[#FA5A00]" />}
          className="whitespace-nowrap font-semibold"
        >
          {t('navSignIn')}
        </Button>
      </div>
    );
  }

  // Role display badge helpers
  const roleConfig: Record<UserRole, { label: string; badgeClass: string; icon: any }> = {
    admin: {
      label: 'Admin',
      badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: Shield,
    },
    chapter_leader: {
      label: 'Leader',
      badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      icon: Building2,
    },
    member: {
      label: 'Member',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: UserIcon,
    },
    player: {
      label: 'Player',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: Sparkles,
    },
    treasurer: {
      label: 'Treasurer',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: ShieldAlert,
    },
  };

  const currentRole = roleConfig[user.role] || roleConfig.member;
  const RoleIcon = currentRole.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Header Pill Trigger */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] transition shadow-2xs cursor-pointer select-none"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label="User Account Menu"
      >
        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-[var(--color-surface-muted)] border border-[var(--color-border)] shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#FA5A00]">
              {user.name.charAt(0)}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-[var(--color-foreground)] truncate max-w-[110px]">
            {user.name}
          </span>
          <span className="text-[10px] text-[var(--color-muted)] font-medium flex items-center gap-1">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-indigo-500' : user.role === 'chapter_leader' ? 'bg-[#FA5A00]' : 'bg-emerald-500'}`} />
            {currentRole.label}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted)] transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Profile Card Summary */}
          <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/40 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-2xs border border-[var(--color-border)] shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-[#FA5A00]">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div className="font-extrabold text-sm text-[var(--color-foreground)] truncate">
                  {user.name}
                </div>
                <div className="text-xs text-[var(--color-muted)] truncate flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#FA5A00]" />
                  <span>{user.phone || user.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-[var(--color-border)]/60">
              <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${currentRole.badgeClass}`}>
                {user.role === 'admin'
                  ? 'Administrator'
                  : user.role === 'chapter_leader'
                  ? 'Chapter Leader'
                  : user.role === 'player'
                  ? 'Youth Athlete'
                  : 'Active Member'}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-muted)]">
                {user.membershipId || 'NYC-2026-001'}
              </span>
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className="p-2 space-y-1 border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onNavigate?.('/dashboard');
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-[#FA5A00]" />
                <span>My Dashboard</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted)]" />
            </button>

            {(user.role === 'chapter_leader' || user.role === 'admin') && (
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onNavigate?.('/leader/dashboard');
                }}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Chapter Leader Portal</span>
                </div>
                <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-1.5 py-0.5 rounded font-bold">
                  Authorized
                </span>
              </button>
            )}

            {user.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onNavigate?.('/admin/dashboard');
                }}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Platform Central Admin</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                  Admin
                </span>
              </button>
            )}
          </div>

          {/* Quick Demo Role Switcher for Authorization Testing */}
          <div className="p-2 border-b border-[var(--color-border)]">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center justify-between">
              <span>Test Authorization Roles</span>
              <Sparkles className="w-3 h-3 text-[#FA5A00]" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleSwitch('admin')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition flex items-center justify-between border ${
                  user.role === 'admin'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                <span>Admin</span>
                {user.role === 'admin' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
              </button>

              <button
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleSwitch('chapter_leader')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition flex items-center justify-between border ${
                  user.role === 'chapter_leader'
                    ? 'border-[#FA5A00] bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                <span>Leader</span>
                {user.role === 'chapter_leader' && <CheckCircle2 className="w-3 h-3 text-[#FA5A00]" />}
              </button>

              <button
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleSwitch('member')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition flex items-center justify-between border ${
                  user.role === 'member'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                <span>Member</span>
                {user.role === 'member' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </button>

              <button
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleSwitch('player')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition flex items-center justify-between border ${
                  user.role === 'player'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]'
                }`}
              >
                <span>Athlete</span>
                {user.role === 'player' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
