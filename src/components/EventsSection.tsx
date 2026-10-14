import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Check, Sparkles } from 'lucide-react';
import type { ClubEvent } from '../types/index.ts';
import { api } from '../services/api.ts';

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (id: string) => {
    try {
      await api.registerEvent(id);
      setRegisteredIds((prev) => ({ ...prev, [id]: true }));
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, registeredCount: e.registeredCount + 1 } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (category: ClubEvent['category']) => {
    switch (category) {
      case 'Sports':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Training':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Health':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Community':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <section id="events" className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Community & Sports Initiatives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Upcoming Events & Community Programs
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Beyond football, Nawa Yuwa Club is committed to grassroots education, environmental conservation, and social healthcare across Nawalparasi.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading club programs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-800/60 rounded-2xl border border-slate-700/80 overflow-hidden hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getCategoryColor(
                          evt.category
                        )}`}
                      >
                        {evt.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-xs text-slate-300 font-semibold bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{evt.date}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white hover:text-emerald-400 transition">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{evt.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Organized by: <strong className="text-slate-300 font-medium">{evt.organizer}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-white">{evt.registeredCount}</span> Participants
                    {evt.capacity && ` / ${evt.capacity} Max`}
                  </div>

                  <button
                    onClick={() => handleRegister(evt.id)}
                    disabled={registeredIds[evt.id]}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      registeredIds[evt.id]
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20'
                    }`}
                  >
                    {registeredIds[evt.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Join / Register</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
