import React, { useState } from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  CreditCard,
  DollarSign,
  Bell,
  User,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import type { UserRole } from '../../types/index.ts';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onBackToHome: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onBackToHome,
  children,
}) => {
  const { user, logout, quickLogin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Club Overview', icon: LayoutDashboard },
    { id: 'fixtures', label: 'Match Fixtures & Live', icon: Trophy },
    { id: 'squad', label: 'Team Squad & Players', icon: Users },
    { id: 'members', label: 'Members & Approvals', icon: CheckCircle },
    { id: 'idcard', label: 'Digital Club ID Card', icon: CreditCard },
    { id: 'finance', label: 'Treasury & Finances', icon: DollarSign },
    { id: 'notices', label: 'Notices & Circulars', icon: Bell },
    { id: 'profile', label: 'My Profile & Log', icon: User },
  ];

  const handleRoleChange = async (role: UserRole) => {
    await quickLogin(role);
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded">President (Admin)</span>;
      case 'player':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded">Team Player</span>;
      case 'treasurer':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded">Treasurer</span>;
      default:
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded">Member</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm tracking-tight text-white">Nawa Yuwa Dashboard</span>
        </div>
        <div className="flex items-center space-x-2">
          {getRoleBadge(user?.role)}
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            title="Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onBackToHome}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="font-black text-sm text-white tracking-tight">NAWA YUWA CLUB</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Member Management</div>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card */}
          {user && (
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                />
                <div className="overflow-hidden">
                  <div className="font-bold text-sm text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate font-mono">{user.membershipId}</div>
                  <div className="mt-1">{getRoleBadge(user.role)}</div>
                </div>
              </div>

              {/* Instant Role Preview Switcher */}
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] space-y-1">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Preview as another role:</span>
                </span>
                <div className="grid grid-cols-2 gap-1 pt-1">
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`px-1.5 py-1 rounded text-center truncate ${
                      user.role === 'admin' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleRoleChange('player')}
                    className={`px-1.5 py-1 rounded text-center truncate ${
                      user.role === 'player' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Captain
                  </button>
                  <button
                    onClick={() => handleRoleChange('treasurer')}
                    className={`px-1.5 py-1 rounded text-center truncate ${
                      user.role === 'treasurer' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Treasurer
                  </button>
                  <button
                    onClick={() => handleRoleChange('member')}
                    className={`px-1.5 py-1 rounded text-center truncate ${
                      user.role === 'member' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Member
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>View Public Portal</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
