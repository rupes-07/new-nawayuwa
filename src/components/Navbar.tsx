import React, { useState } from 'react';
import { Shield, Trophy, Users, Calendar, FileText, DollarSign, LogIn, LogOut, LayoutDashboard, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { UserRole } from '../types/index.ts';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenApply: () => void;
  currentView: 'home' | 'dashboard';
  setCurrentView: (view: 'home' | 'dashboard') => void;
  dashboardTab?: string;
  setDashboardTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenApply,
  currentView,
  setCurrentView,
}) => {
  const { user, logout, quickLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleSwitch = async (role: UserRole) => {
    await quickLogin(role);
    setRoleDropdownOpen(false);
    setCurrentView('dashboard');
  };

  const scrollTo = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/40 text-slate-100">
      {/* Top micro-bar for announcement & quick switcher */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-slate-900 to-amber-950/70 border-b border-slate-800 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NAWA GOLD CUP 2081
            </span>
            <span className="hidden sm:inline">Grand Final this Saturday at Bardaghat Municipal Stadium!</span>
            <span className="sm:hidden text-[11px]">Final this Saturday!</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-[11px] hidden md:inline">Quick Demo Roles:</span>
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px] border border-slate-700 transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Switch Role ({user ? user.role : 'Guest'})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-700 text-[10px] uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center justify-between text-emerald-300"
                  >
                    <span>President (Admin)</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-400 px-1 rounded">Executive</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('player')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center justify-between text-amber-300"
                  >
                    <span>Captain (Player #10)</span>
                    <span className="text-[10px] bg-amber-900/60 text-amber-400 px-1 rounded">Senior XI</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('treasurer')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center justify-between text-blue-300"
                  >
                    <span>Treasurer (Finances)</span>
                    <span className="text-[10px] bg-blue-900/60 text-blue-400 px-1 rounded">Audit</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('member')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center justify-between text-purple-300"
                  >
                    <span>Club Member</span>
                    <span className="text-[10px] bg-purple-900/60 text-purple-400 px-1 rounded">Youth Wing</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity with official Nawa Yuwa Foundation brand asset */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-lg border border-slate-700 group-hover:scale-105 transition flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/image_26f9ac04.png"
                alt="Nawa Yuwa Foundation"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                  <span className="text-white">NAWA</span>
                  <span className="text-[#FA5A00]">YUWA</span>
                </span>
                <span className="text-[10px] font-bold text-[#FA5A00] bg-[#FA5A00]/15 px-1.5 py-0.5 rounded border border-[#FA5A00]/30 hidden sm:inline uppercase tracking-wider">
                  FOUNDATION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">Bardaghat-16, Nawalparasi • Est. 2005</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => scrollTo('fixtures')}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition"
            >
              Fixtures & Scores
            </button>
            <button
              onClick={() => scrollTo('squad')}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition"
            >
              Team Squad
            </button>
            <button
              onClick={() => scrollTo('events')}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition"
            >
              Programs & Events
            </button>
            <button
              onClick={() => scrollTo('transparency')}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition"
            >
              Transparency
            </button>
            <button
              onClick={() => scrollTo('notices')}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition"
            >
              Notices
            </button>
            <button
              onClick={onOpenApply}
              className="px-3 py-1.5 rounded-lg text-sm text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition font-medium"
            >
              Join Club
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition shadow-sm ${
                    currentView === 'dashboard'
                      ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/20'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{currentView === 'dashboard' ? 'Public Portal' : 'Member Dashboard'}</span>
                </button>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Member Login</span>
                </button>
                <button
                  onClick={onOpenApply}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-amber-400 hover:opacity-95 shadow-lg shadow-emerald-500/20 transition"
                >
                  Apply Membership
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center space-x-2">
            {user && (
              <button
                onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                className="p-2 bg-emerald-600/90 text-white rounded-lg text-xs flex items-center space-x-1"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => scrollTo('fixtures')}
              className="text-left px-3 py-2 rounded text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Fixtures & Scores</span>
            </button>
            <button
              onClick={() => scrollTo('squad')}
              className="text-left px-3 py-2 rounded text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Team Squad</span>
            </button>
            <button
              onClick={() => scrollTo('events')}
              className="text-left px-3 py-2 rounded text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Programs & Events</span>
            </button>
            <button
              onClick={() => scrollTo('transparency')}
              className="text-left px-3 py-2 rounded text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Transparency Ledger</span>
            </button>
            <button
              onClick={() => scrollTo('notices')}
              className="text-left px-3 py-2 rounded text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Notice Board</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{currentView === 'dashboard' ? 'Back to Public Portal' : 'Open Dashboard'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-slate-800 text-red-300 rounded-lg flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 text-slate-200 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Member Login</span>
                </button>
                <button
                  onClick={() => {
                    onOpenApply();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Apply For Membership
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
