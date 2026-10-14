import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Play, CheckCircle, RefreshCw, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { MatchFixture } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardFixtures: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchFixture | null>(null);
  const [formData, setFormData] = useState({
    tournament: '12th Nawa Gold Cup Championship 2081',
    round: 'League Match',
    homeTeam: 'Nawa Yuwa Club',
    awayTeam: 'Sunwal United',
    matchDate: '2026-10-25T15:00',
    venue: 'Bardaghat Municipal Stadium, Nawalparasi',
    highlights: '',
  });

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await api.getMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMatch(formData);
      setShowAddModal(false);
      loadMatches();
    } catch (err: any) {
      alert(err.message || 'Failed to create match');
    }
  };

  const handleScoreUpdate = async (id: string, homeScore: number, awayScore: number, status?: MatchFixture['status'], minute?: number) => {
    try {
      await api.updateMatch(id, {
        homeScore,
        awayScore,
        ...(status ? { status } : {}),
        ...(minute !== undefined ? { currentMinute: minute } : {}),
      });
      loadMatches();
      if (selectedMatch && selectedMatch.id === id) {
        setSelectedMatch((prev) => prev ? { ...prev, homeScore, awayScore, ...(status ? { status } : {}) } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'player';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Match Fixtures & Live Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Schedule tournaments, broadcast live scores, and record official scorers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadMatches}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 border border-slate-700 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-700/20"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Fixture</span>
            </button>
          )}
        </div>
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading fixtures...</div>
        ) : (
          matches.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                    {m.tournament}
                  </span>
                  <span className="text-xs text-slate-400">• {m.round}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      m.status === 'live'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                        : m.status === 'completed'
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {m.status.toUpperCase()} {m.currentMinute ? `${m.currentMinute}'` : ''}
                  </span>
                </div>
              </div>

              {/* Match Teams & Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-4 text-center sm:text-left">
                {/* Home */}
                <div className="sm:col-span-3 sm:text-right">
                  <div className="text-lg font-bold text-white">{m.homeTeam}</div>
                  <div className="text-xs text-slate-400">Home Club</div>
                </div>

                {/* Score Controls */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-white px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                    {m.status === 'upcoming' ? 'VS' : `${m.homeScore ?? 0} - ${m.awayScore ?? 0}`}
                  </div>
                </div>

                {/* Away */}
                <div className="sm:col-span-3 sm:text-left">
                  <div className="text-lg font-bold text-white">{m.awayTeam}</div>
                  <div className="text-xs text-slate-400">Opponent</div>
                </div>
              </div>

              {/* Action Buttons for Admins & Players */}
              {canEdit && (
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span>Venue: {m.venue}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {m.status === 'upcoming' && (
                      <button
                        onClick={() => handleScoreUpdate(m.id, 0, 0, 'live', 1)}
                        className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg font-semibold flex items-center space-x-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Match Live</span>
                      </button>
                    )}

                    {m.status === 'live' && (
                      <>
                        <button
                          onClick={() => handleScoreUpdate(m.id, (m.homeScore ?? 0) + 1, m.awayScore ?? 0)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                          title="Home Goal"
                        >
                          +1 {m.homeTeam.split(' ')[0]}
                        </button>
                        <button
                          onClick={() => handleScoreUpdate(m.id, m.homeScore ?? 0, (m.awayScore ?? 0) + 1)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                          title="Away Goal"
                        >
                          +1 Away
                        </button>
                        <button
                          onClick={() => handleScoreUpdate(m.id, m.homeScore ?? 0, m.awayScore ?? 0, 'completed')}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Final Whistle</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setSelectedMatch(m)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1 border border-slate-700"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Match Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Schedule New Match Fixture</h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  value={formData.tournament}
                  onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Home Team</label>
                  <input
                    type="text"
                    required
                    value={formData.homeTeam}
                    onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Away Team</label>
                  <input
                    type="text"
                    required
                    value={formData.awayTeam}
                    onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Round</label>
                  <input
                    type="text"
                    value={formData.round}
                    onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Venue / Stadium</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition mt-2"
              >
                Save Fixture
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Edit Match Details</h3>
            <div className="text-xs text-slate-400">
              {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Home Score</label>
                  <input
                    type="number"
                    value={selectedMatch.homeScore ?? 0}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, homeScore: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Away Score</label>
                  <input
                    type="number"
                    value={selectedMatch.awayScore ?? 0}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, awayScore: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Match Highlights / Report</label>
                <textarea
                  rows={3}
                  value={selectedMatch.highlights || ''}
                  onChange={(e) => setSelectedMatch({ ...selectedMatch, highlights: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                onClick={async () => {
                  await api.updateMatch(selectedMatch.id, selectedMatch);
                  setSelectedMatch(null);
                  loadMatches();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
