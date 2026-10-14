import React, { useState, useEffect } from 'react';
import { Users, Plus, Star, Award, Shield, X, Edit, Activity } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Player } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardSquad: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jerseyNumber: 7,
    position: 'Forward' as Player['position'],
    age: 21,
    hometown: 'Bardaghat-16, Nawalparasi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    appearances: 0,
    goals: 0,
    assists: 0,
    isCaptain: false,
  });

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await api.getPlayers();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlayer(formData);
      setShowAddModal(false);
      loadPlayers();
    } catch (err: any) {
      alert(err.message || 'Failed to add player');
    }
  };

  const handleToggleStatus = async (player: Player) => {
    const nextStatus = player.status === 'Active' ? 'Injured' : 'Active';
    try {
      await api.updatePlayer(player.id, { status: nextStatus });
      loadPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrementStat = async (player: Player, field: 'goals' | 'assists' | 'appearances') => {
    try {
      await api.updatePlayer(player.id, { [field]: player[field] + 1 });
      loadPlayers();
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Senior Squad & Player Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage player rosters, jersey numbers, match caps, goals, and medical availability.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Athlete</span>
          </button>
        )}
      </div>

      {/* Players List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="py-12 col-span-3 text-center text-slate-500">Loading squad...</div>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-sm text-white truncate">{p.name}</span>
                      {p.isCaptain && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-mono text-amber-400">#{p.jerseyNumber} • {p.position}</div>
                    <div className="text-[11px] text-slate-400">{p.hometown}</div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-950 rounded-xl text-center border border-slate-800/80">
                  <div>
                    <div className="font-black text-sm text-white">{p.appearances}</div>
                    <div className="text-[10px] text-slate-500">Caps</div>
                  </div>
                  <div>
                    <div className="font-black text-sm text-emerald-400">{p.goals}</div>
                    <div className="text-[10px] text-slate-500">Goals</div>
                  </div>
                  <div>
                    <div className="font-black text-sm text-amber-400">{p.assists}</div>
                    <div className="text-[10px] text-slate-500">Assists</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleStatus(p)}
                  className={`px-2.5 py-1 rounded-full font-semibold border ${
                    p.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  ● {p.status}
                </button>

                {isAdmin && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleIncrementStat(p, 'goals')}
                      className="px-2 py-1 bg-slate-800 hover:bg-emerald-900/50 text-emerald-300 rounded text-[11px] font-bold"
                      title="Add Goal"
                    >
                      +Goal
                    </button>
                    <button
                      onClick={() => handleIncrementStat(p, 'assists')}
                      className="px-2 py-1 bg-slate-800 hover:bg-amber-900/50 text-amber-300 rounded text-[11px] font-bold"
                      title="Add Assist"
                    >
                      +Assist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Register Player to Squad</h3>

            <form onSubmit={handleAddPlayer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Player Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujan Rana"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jersey Number</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hometown</label>
                  <input
                    type="text"
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isCaptain"
                  checked={formData.isCaptain}
                  onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700"
                />
                <label htmlFor="isCaptain" className="text-slate-300">
                  Assign as Team Captain / Vice Captain
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition mt-2"
              >
                Save Player Roster
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
