import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api.ts';
import type { Notice } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardNotices: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tournament' as Notice['category'],
    priority: 'Normal' as Notice['priority'],
    summary: '',
    content: '',
  });

  const loadNotices = async () => {
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

  useEffect(() => {
    loadNotices();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createNotice(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        category: 'Tournament',
        priority: 'Normal',
        summary: '',
        content: '',
      });
      loadNotices();
    } catch (err: any) {
      alert(err.message || 'Failed to publish notice');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-400" />
            <span>Club Notices & Circular Publisher</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish official executive circulars, match announcements, and assembly notifications.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Official Notice</span>
          </button>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading notices...</div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {n.category}
                  </span>
                  <span className="text-xs text-slate-400">Published on {n.publishDate}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    n.priority === 'Urgent'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : n.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {n.priority}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{n.title}</h3>
              <p className="text-xs text-slate-300 font-medium">{n.summary}</p>
              <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {n.content}
              </p>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>By: {n.publishedBy}</span>
                <span>Document Status: Official & Validated</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Publish Official Notice</h3>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Nawa Gold Cup Final Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Tournament">Tournament</option>
                    <option value="Executive">Executive</option>
                    <option value="General">General</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brief Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="1-2 sentences overview"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Circular Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full text of the announcement..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition mt-2"
              >
                Broadcast to Club Members
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
