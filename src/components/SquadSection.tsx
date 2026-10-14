import React, { useState, useEffect } from 'react';
import { Users, Award, Shield, Star, MapPin } from 'lucide-react';
import type { Player } from '../types/index.ts';
import { api } from '../services/api.ts';

export const SquadSection: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSquad = async () => {
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
    fetchSquad();
  }, []);

  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  const filteredPlayers = players.filter((player) => {
    if (selectedPosition === 'All') return true;
    return player.position === selectedPosition;
  });

  return (
    <section id="squad" className="py-16 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1.5">
              <Users className="w-4 h-4" />
              <span>Senior Squad 2081/82</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Official Team Roster & Players
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Meet the squad representing Nawa Yuwa Club with pride, grit, and sportsmanship across Nepal.
            </p>
          </div>

          {/* Position Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPosition === pos
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pos === 'All' ? 'Full Squad' : pos}
              </button>
            ))}
          </div>
        </div>

        {/* Squad Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading squad roster...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="group relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Banner Container */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-800">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Jersey Number Big Watermark */}
                  <div className="absolute top-2 right-3 font-black text-4xl text-white/20 select-none group-hover:text-amber-400/30 transition">
                    #{player.jerseyNumber}
                  </div>

                  {/* Captain Badge */}
                  {player.isCaptain && (
                    <div className="absolute top-3 left-3 flex items-center space-x-1 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-md text-[11px] shadow-lg tracking-wider">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>CAPTAIN</span>
                    </div>
                  )}

                  {/* Position Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                      {player.position}
                    </span>
                  </div>
                </div>

                {/* Player Information */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                        {player.name}
                      </h3>
                      <span className="text-xs text-slate-400">{player.age} yrs</span>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-400 text-xs mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{player.hometown}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <div>
                      <div className="text-base font-bold text-white">{player.appearances}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Caps</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-emerald-400">{player.goals}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Goals</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-amber-400">{player.assists}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Assists</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500">Joined Club: {player.joinedYear}</span>
                    <span className={`font-semibold ${player.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ● {player.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
