import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  DollarSign,
  Activity,
  PlusCircle,
  CreditCard,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { MatchFixture, FinancialRecord, Notice, Player } from '../../types/index.ts';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchFixture[]>([]);
  const [finances, setFinances] = useState<{ totalIncome: number; totalExpense: number; balance: number }>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setLoading(true);
        const [mList, fData, nList, pList] = await Promise.all([
          api.getMatches(),
          api.getFinances(),
          api.getNotices(),
          api.getPlayers(),
        ]);
        setMatches(mList);
        setFinances(fData.summary);
        setNotices(nList);
        setPlayers(pList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const upcomingMatches = matches.filter((m) => m.status === 'upcoming' || m.status === 'live');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/60 via-slate-900 to-amber-950/40 rounded-2xl border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Nawa Yuwa Club Executive System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Namaste, {user?.name || 'Member'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Welcome to the internal club portal for Bardaghat-16, Nawalparasi. Manage squad rosters, live fixtures, membership verification, and public treasury transparency.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('members')}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Members</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">1,248</div>
          <div className="text-[11px] text-emerald-400 mt-1">2 Pending verification</div>
        </div>

        <div
          onClick={() => onNavigateTab('finance')}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Treasury Balance</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            Rs. {finances.balance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Public verified funds</div>
        </div>

        <div
          onClick={() => onNavigateTab('fixtures')}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming Fixtures</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{upcomingMatches.length} Matches</div>
          <div className="text-[11px] text-blue-400 mt-1">Nawa Gold Cup Final Sat</div>
        </div>

        <div
          onClick={() => onNavigateTab('squad')}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Squad</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{players.length} Athletes</div>
          <div className="text-[11px] text-purple-400 mt-1">1 Injured in rehab</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions & Operations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('fixtures')}
            className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition flex items-center space-x-2.5 group"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold text-white">Schedule Fixture</div>
              <div className="text-[10px] text-slate-500">Add or edit match</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('finance')}
            className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition flex items-center space-x-2.5 group"
          >
            <DollarSign className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold text-white">Record Transaction</div>
              <div className="text-[10px] text-slate-500">Log income / expense</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('notices')}
            className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition flex items-center space-x-2.5 group"
          >
            <Bell className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold text-white">Publish Notice</div>
              <div className="text-[10px] text-slate-500">Issue club circular</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('idcard')}
            className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition flex items-center space-x-2.5 group"
          >
            <CreditCard className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
            <div>
              <div className="text-xs font-bold text-white">Club ID Card</div>
              <div className="text-[10px] text-slate-500">Generate & Print</div>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Next Fixture + Latest Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Match Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Next Upcoming Fixture
              </span>
              <button
                onClick={() => onNavigateTab('fixtures')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>Manage all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingMatches[0] ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-center text-xs text-slate-400 font-semibold">
                  {upcomingMatches[0].tournament} • {upcomingMatches[0].round}
                </div>
                <div className="flex items-center justify-around text-center py-2">
                  <div className="font-bold text-sm text-white">
                    {upcomingMatches[0].homeTeam}
                  </div>
                  <div className="text-xs font-bold px-2 py-1 bg-slate-800 text-amber-400 rounded">
                    VS
                  </div>
                  <div className="font-bold text-sm text-white">
                    {upcomingMatches[0].awayTeam}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center">
                  Venue: {upcomingMatches[0].venue}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No scheduled matches.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Stadium capacity: 5,000</span>
            <span className="text-emerald-400 font-semibold">Security Clearance: Approved</span>
          </div>
        </div>

        {/* Latest Notices */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Recent Club Circulars
              </span>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => onNavigateTab('notices')}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="overflow-hidden pr-3">
                    <div className="font-semibold text-xs text-white truncate">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{n.publishDate} • {n.category}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                      n.priority === 'Urgent'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Issued by Club Executive Committee, Bardaghat-16
          </div>
        </div>
      </div>
    </div>
  );
};
