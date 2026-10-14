import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import type { UserRole } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, quickLogin, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [clubWing, setClubWing] = useState('Senior Football Team');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, phone, password, role, clubWing });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleQuickRole = async (roleType: UserRole) => {
    setError(null);
    try {
      await quickLogin(roleType);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Demo Quick Logins banner */}
        <div className="mb-5 p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Sign-in:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleQuickRole('admin')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-emerald-900/40 text-emerald-300 rounded border border-slate-700 hover:border-emerald-500/50 transition text-left"
            >
              <div className="font-bold">President / Admin</div>
              <div className="text-[10px] text-slate-400">Full club control</div>
            </button>
            <button
              onClick={() => handleQuickRole('player')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-amber-900/40 text-amber-300 rounded border border-slate-700 hover:border-amber-500/50 transition text-left"
            >
              <div className="font-bold">Captain / Player</div>
              <div className="text-[10px] text-slate-400">#10 Dinesh Bhattarai</div>
            </button>
            <button
              onClick={() => handleQuickRole('treasurer')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-blue-900/40 text-blue-300 rounded border border-slate-700 hover:border-blue-500/50 transition text-left"
            >
              <div className="font-bold">Treasurer</div>
              <div className="text-[10px] text-slate-400">Financial audits</div>
            </button>
            <button
              onClick={() => handleQuickRole('member')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-purple-900/40 text-purple-300 rounded border border-slate-700 hover:border-purple-500/50 transition text-left"
            >
              <div className="font-bold">General Member</div>
              <div className="text-[10px] text-slate-400">Digital ID & events</div>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 border-b-2 ${
              tab === 'login'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Member Login</span>
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 border-b-2 ${
              tab === 'register'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email or Phone</label>
              <input
                type="text"
                required
                placeholder="admin@nawayuwaclub.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-700/20 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In To Portal'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Subash Shrestha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="subash@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+977-98..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role / Affiliation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="member">General Member</option>
                <option value="player">Team Player</option>
                <option value="treasurer">Finance / Treasurer</option>
                <option value="admin">Club Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Club Wing</label>
              <input
                type="text"
                value={clubWing}
                onChange={(e) => setClubWing(e.target.value)}
                placeholder="Senior Football Team / Cultural Wing"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-700/20 disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
