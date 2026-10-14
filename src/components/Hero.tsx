import React from 'react';
import { Trophy, Users, Shield, ArrowRight, Activity, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeroProps {
  onOpenApply: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onScrollToFixtures: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenApply,
  onOpenAuth,
  onOpenDashboard,
  onScrollToFixtures,
}) => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Background Glows & Patterns */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
              <span>EST. 2005 (२०६२) • BARDAGHAT-16, NAWALPARASI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Empowering Youth.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Uniting Communities.
              </span>{' '}
              Dominating The Pitch.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Official portal of <strong className="text-white font-semibold">Nawa Yuwa Club (नयाँ युवा क्लब)</strong>. 
              Home of the prestigious Nawa Gold Cup, grassroots youth football academy, environmental conservation drives, and 100% transparent public governance.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                onClick={onOpenApply}
                className="px-6 py-3.5 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Join As A Member</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToFixtures}
                className="px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-emerald-500/40 shadow-sm transition flex items-center space-x-2"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Match Fixtures & Scores</span>
              </button>

              {user ? (
                <button
                  onClick={onOpenDashboard}
                  className="px-5 py-3.5 rounded-xl text-base font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 transition flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Dashboard ({user.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-5 py-3.5 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 transition"
                >
                  <span>Member Login</span>
                </button>
              )}
            </div>

            {/* Key Club Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">1,200+</div>
                  <div className="text-[11px] text-slate-400">Club Members</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">18 Cups</div>
                  <div className="text-[11px] text-slate-400">Trophies Won</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">250+</div>
                  <div className="text-[11px] text-slate-400">Youth Academy</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-[11px] text-slate-400">Fiscal Audit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Match & Club Crest Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-emerald-500/20 p-6 shadow-2xl backdrop-blur-xl">
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Grand Match Showcase
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Nawa Gold Cup 2081
                </span>
              </div>

              {/* Match Card Versus */}
              <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800 text-center relative overflow-hidden">
                <div className="text-[11px] text-slate-400 font-medium mb-3">
                  CHAMPIONSHIP FINAL • THIS SATURDAY 3:30 PM
                </div>

                <div className="flex items-center justify-around">
                  {/* Home Team */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-emerald-400 text-lg">
                        NYC
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-white">Nawa Yuwa</div>
                      <div className="text-[11px] text-emerald-400 font-medium">Host Finalist</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
                      VS
                    </span>
                    <span className="text-[10px] text-slate-400 mt-2">Bardaghat Stadium</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-blue-400 text-lg">
                        BFC
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-white">Bardaghat FC</div>
                      <div className="text-[11px] text-blue-400 font-medium">District Derby</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-slate-400">Chief Guest: Mayor, Bardaghat Municipality</span>
                  <span className="text-emerald-400 font-semibold">Free Entry for Members</span>
                </div>
              </div>

              {/* Club Commitments */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free youth football training clinic every morning 6:00 AM.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Active youth mobilization for flood emergency relief & welfare.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Official digital ID cards issued with verified QR validation.</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Affiliated with ANFA Nawalparasi
                </div>
                <button
                  onClick={onScrollToFixtures}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>All fixtures & results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
