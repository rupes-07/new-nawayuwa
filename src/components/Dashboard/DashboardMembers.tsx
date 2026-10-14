import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Search, Filter, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { User, MembershipApplication } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardMembers: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'members' | 'applications'>('members');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getMembers();
      setMembers(data.members);
      setApplications(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateApplicationStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.membershipId.toLowerCase().includes(search.toLowerCase()) ||
    m.clubWing.toLowerCase().includes(search.toLowerCase())
  );

  const pendingApplications = applications.filter((a) => a.status === 'pending');

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Club Members & Applications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Directory of registered club personnel and public membership approval queue.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex space-x-1">
          <button
            onClick={() => setTab('members')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === 'members'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Directory ({members.length})
          </button>
          <button
            onClick={() => setTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              tab === 'applications'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Applications</span>
            {pendingApplications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {pendingApplications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === 'members' ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by member name, membership ID (e.g. NYC-2005-001), or wing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Members Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Membership ID</th>
                    <th className="py-3 px-4">Role & Wing</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Volunteer Hours</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Loading directory...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                              alt={m.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">{m.name}</div>
                              <div className="text-[10px] text-slate-400">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {m.membershipId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200 capitalize">{m.role}</div>
                          <div className="text-[10px] text-slate-400">{m.clubWing}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{m.joinedDate}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {m.volunteerHours ?? 0} hrs
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px] font-semibold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Applications Queue */
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="py-12 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-500">
              No applications submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((appItem) => (
                <div
                  key={appItem.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm">{appItem.fullName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        appItem.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : appItem.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {appItem.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{appItem.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{appItem.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1">
                      <span>Wing: <strong className="text-emerald-400">{appItem.interestWing}</strong></span>
                      <span>Blood: <strong className="text-amber-400">{appItem.bloodGroup}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Address: {appItem.address}
                    </div>
                  </div>

                  {isAdmin && appItem.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleApplicationStatus(appItem.id, 'rejected')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/40 text-red-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleApplicationStatus(appItem.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Issue ID</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
