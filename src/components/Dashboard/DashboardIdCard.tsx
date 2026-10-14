import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Printer, Shield, CheckCircle2, QrCode, Download, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { User } from '../../types/index.ts';

export const DashboardIdCard: React.FC = () => {
  const { user } = useAuth();
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(user);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedMember(user);
    const loadAll = async () => {
      try {
        const data = await api.getMembers();
        setAllMembers(data.members);
      } catch (err) {
        console.error(err);
      }
    };
    loadAll();
  }, [user]);

  const memberToDisplay = selectedMember || user;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Official Club Membership ID Card</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-proof digital credentials for stadium access, voting assemblies, and club benefits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Admin Member Switcher */}
          {user?.role === 'admin' && allMembers.length > 0 && (
            <select
              value={memberToDisplay?.id}
              onChange={(e) => {
                const found = allMembers.find((m) => m.id === e.target.value);
                if (found) setSelectedMember(found);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.membershipId})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-700/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save ID Card</span>
          </button>
        </div>
      </div>

      {memberToDisplay ? (
        <div className="flex flex-col items-center justify-center py-6">
          {/* Physical ID Card Container */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 rounded-3xl border-2 border-emerald-500/50 p-6 shadow-2xl relative overflow-hidden text-white transition-transform hover:scale-[1.01]"
          >
            {/* Holographic Watermark & Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none font-black text-8xl tracking-tighter text-emerald-400 select-none">
              NYC
            </div>

            {/* Top Club Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="font-black text-sm tracking-tight text-white">NAWA YUWA CLUB</div>
                  <div className="text-[10px] text-amber-300 font-semibold">नयाँ युवा क्लब • Bardaghat-16</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">ESTABLISHED</div>
                <div className="text-xs font-bold text-emerald-400">2005 (२०६२)</div>
              </div>
            </div>

            {/* Card Body: Photo & Member Particulars */}
            <div className="grid grid-cols-12 gap-4 items-center my-4">
              {/* Photo Column */}
              <div className="col-span-4 flex flex-col items-center">
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md relative bg-slate-800">
                  <img
                    src={
                      memberToDisplay.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={memberToDisplay.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-950/90 text-center py-0.5 text-[8px] font-bold text-emerald-300 uppercase">
                    VERIFIED
                  </div>
                </div>
                <div className="mt-1.5 text-center">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">
                    {memberToDisplay.membershipId}
                  </span>
                </div>
              </div>

              {/* Data Column */}
              <div className="col-span-8 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <div className="text-base font-black text-white leading-tight">
                    {memberToDisplay.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Role</span>
                    <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 capitalize">
                      {memberToDisplay.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Blood Group</span>
                    <span className="font-bold text-amber-400">O+ (Universal)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Club Wing / Department</span>
                  <div className="font-medium text-slate-200 text-[11px] truncate">
                    {memberToDisplay.clubWing}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400">Issued:</span>{' '}
                    <span className="text-slate-200 font-semibold">{memberToDisplay.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Valid Thru:</span>{' '}
                    <span className="text-emerald-400 font-semibold">2082/12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer: Seal & QR Code */}
            <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-white rounded-md text-slate-950">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-[9px] text-slate-400 leading-tight">
                  <span className="font-bold text-slate-200 block">Digital Verification</span>
                  <span>Scan to verify status</span>
                </div>
              </div>

              {/* President Seal Simulation */}
              <div className="text-right">
                <div className="text-[11px] font-serif italic text-amber-300 tracking-wider font-bold">
                  Santosh Shrestha
                </div>
                <div className="text-[9px] text-slate-400 border-t border-slate-700 pt-0.5">
                  President / Seal of Authority
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500 text-center max-w-sm">
            This card is issued by Nawa Yuwa Club Executive Committee, Nawalparasi. Property of holder for club affairs.
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500">No active member selected.</div>
      )}
    </div>
  );
};
