import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Heart, Shield, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const DashboardProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    emergencyContact: user?.emergencyContact || '',
    clubWing: user?.clubWing || '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-emerald-400" />
          <span>Member Profile & Service Record</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage personal contact details, emergency notifications, and view logged community service hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-xl"
            />
            <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 text-white rounded-full">
              <Shield className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-white">{user.name}</h3>
            <span className="text-xs font-mono text-amber-400 font-semibold">{user.membershipId}</span>
            <div className="mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Member Wing:</span>
              <span className="font-semibold">{user.clubWing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Member Since:</span>
              <span className="font-semibold">{user.joinedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-400 font-bold uppercase">{user.status}</span>
            </div>
          </div>

          {/* Volunteer Hours Stat */}
          <div className="w-full p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-amber-400 text-xs font-bold mb-1">
              <Award className="w-4 h-4" />
              <span>Community Service Hours</span>
            </div>
            <div className="text-3xl font-black text-white">{user.volunteerHours ?? 0} hrs</div>
            <div className="text-[10px] text-slate-400 mt-1">Flood relief, tree planting & youth clinic</div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-base font-bold text-white mb-4">Edit Profile Particulars</h3>

          {saved && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  placeholder="+977-98..."
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Wing</label>
              <input
                type="text"
                value={formData.clubWing}
                onChange={(e) => setFormData({ ...formData, clubWing: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Personal Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-700/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Information'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
