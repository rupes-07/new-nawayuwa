import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Clock, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import type { MatchFixture } from '../types/index.ts';
import { api } from '../services/api.ts';

export const MatchesSection: React.FC = () => {
  const [matches, setMatches] = useState<MatchFixture[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [selectedMatch, setSelectedMatch] = useState<MatchFixture | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
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
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const getStatusBadge = (status: MatchFixture['status'], minute?: number) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>LIVE {minute ? `${minute}'` : ''}</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Upcoming Fixture
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Full Time Result
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="fixtures" className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1.5">
              <Trophy className="w-4 h-4" />
              <span>Fixtures & Scores</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Match Center & Tournament Results
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track Nawa Yuwa Club Senior Team across provincial leagues, district championships, and the annual Nawa Gold Cup.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex space-x-1">
              {(['all', 'live', 'upcoming', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    filter === tab
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'all' ? 'All Fixtures' : tab}
                </button>
              ))}
            </div>

            <button
              onClick={fetchMatches}
              title="Refresh scores"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading match fixtures...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-12 bg-slate-800/30 rounded-2xl border border-slate-800 text-center text-slate-400 p-8">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <p className="font-semibold text-slate-300">No matches found in this category.</p>
            <p className="text-xs text-slate-500 mt-1">Check other categories or view all fixtures.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl border border-slate-700/70 p-5 transition-all duration-200 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-xl shadow-slate-950/40"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                        {match.tournament}
                      </span>
                      <span className="text-xs text-slate-400">• {match.round}</span>
                    </div>
                    {getStatusBadge(match.status, match.currentMinute)}
                  </div>

                  {/* Teams and Scoreline */}
                  <div className="grid grid-cols-7 items-center gap-2 my-2">
                    {/* Home Team */}
                    <div className="col-span-3 text-right">
                      <div className="font-bold text-base text-white truncate group-hover:text-emerald-300 transition">
                        {match.homeTeam}
                      </div>
                      <div className="text-[11px] text-slate-400">Home</div>
                    </div>

                    {/* Scores / VS */}
                    <div className="col-span-1 text-center">
                      {match.status === 'upcoming' ? (
                        <div className="inline-block px-2.5 py-1 rounded bg-slate-700/60 text-slate-300 font-bold text-xs">
                          VS
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-1.5 font-extrabold text-2xl text-white">
                          <span className={match.homeScore! > (match.awayScore ?? 0) ? 'text-emerald-400' : 'text-slate-200'}>
                            {match.homeScore ?? 0}
                          </span>
                          <span className="text-slate-500 text-lg">-</span>
                          <span className={(match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'text-emerald-400' : 'text-slate-200'}>
                            {match.awayScore ?? 0}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="col-span-3 text-left">
                      <div className="font-bold text-base text-white truncate">
                        {match.awayTeam}
                      </div>
                      <div className="text-[11px] text-slate-400">Away</div>
                    </div>
                  </div>

                  {/* Scorers preview if completed */}
                  {match.scorers && match.scorers.length > 0 && (
                    <div className="my-3 py-2 px-3 bg-slate-900/60 rounded-lg text-xs text-slate-300 border border-slate-800/80">
                      <span className="text-slate-500 font-medium">Goalscorers: </span>
                      <span className="text-emerald-300">{match.scorers.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(match.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1 text-slate-400 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{match.venue}</span>
                    </span>
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="p-1 hover:text-emerald-400 text-slate-400 transition"
                      title="View Match Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Match Details */}
        {selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  {selectedMatch.tournament}
                </span>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="text-center py-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 mb-2">{selectedMatch.round}</div>
                <div className="flex items-center justify-around px-4">
                  <div className="text-center font-bold text-lg text-white">
                    {selectedMatch.homeTeam}
                  </div>
                  <div className="text-2xl font-black text-emerald-400 px-4">
                    {selectedMatch.status === 'upcoming' ? 'VS' : `${selectedMatch.homeScore ?? 0} - ${selectedMatch.awayScore ?? 0}`}
                  </div>
                  <div className="text-center font-bold text-lg text-white">
                    {selectedMatch.awayTeam}
                  </div>
                </div>
                {selectedMatch.status === 'live' && (
                  <div className="mt-2 text-xs text-red-400 font-semibold animate-pulse">
                    Live match in progress • Minute {selectedMatch.currentMinute}'
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-medium text-white">{selectedMatch.venue}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-white">
                    {new Date(selectedMatch.matchDate).toLocaleString()}
                  </span>
                </div>
                {selectedMatch.referee && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Referee:</span>
                    <span className="font-medium text-white">{selectedMatch.referee}</span>
                  </div>
                )}
                {selectedMatch.highlights && (
                  <div className="pt-2">
                    <span className="text-slate-500 text-xs block mb-1">Match Report / Summary:</span>
                    <p className="text-xs bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 text-slate-300 leading-relaxed">
                      {selectedMatch.highlights}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Close Match View
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
