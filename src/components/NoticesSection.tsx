import React, { useState, useEffect } from 'react';
import { Bell, FileText, ArrowRight, Calendar, UserCheck } from 'lucide-react';
import type { Notice } from '../types/index.ts';
import { api } from '../services/api.ts';

export const NoticesSection: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await api.getNotices();
        setNotices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const getPriorityBadge = (priority: Notice['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <section id="notices" className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1.5">
              <Bell className="w-4 h-4" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Club Notices & Press Releases
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Stay informed on official announcements, tournament fixtures, and general assembly communications.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading club circulars...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl border border-slate-700/70 p-5 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition group"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {notice.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(
                        notice.priority
                      )}`}
                    >
                      {notice.priority}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-2">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{notice.publishDate}</span>
                  </div>

                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>Read Full Notice</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Full Notice View */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-700 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                    {selectedNotice.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getPriorityBadge(selectedNotice.priority)}`}>
                    {selectedNotice.priority}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Published: {selectedNotice.publishDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>By: {selectedNotice.publishedBy}</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed max-h-72 overflow-y-auto space-y-3">
                <p className="font-semibold text-emerald-300">{selectedNotice.summary}</p>
                <div className="border-t border-slate-800 pt-2 text-xs sm:text-sm text-slate-300 whitespace-pre-line">
                  {selectedNotice.content}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500">
                  Official Document • Nawa Yuwa Club Secretariat, Bardaghat-16
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
