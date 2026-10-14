import React from 'react';
import { Shield, MapPin, Phone, Mail, Trophy, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenApply: () => void;
  onOpenAuth: () => void;
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenAuth, onScrollTo }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Club Crest & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="font-black text-sm text-white tracking-tight">NAWA YUWA CLUB</div>
                <div className="text-[10px] text-amber-400 font-semibold">नयाँ युवा क्लब (स्था. २०६२)</div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Leading grassroots sports and youth development organization in Bardaghat, Nawalparasi. 
              Organizers of the annual Nawa Gold Cup Championship, promoting sportsmanship and public service.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <Trophy className="w-3.5 h-3.5" />
              <span>Affiliated with ANFA Nawalparasi</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('fixtures')}
                  className="hover:text-emerald-400 transition"
                >
                  Match Fixtures & Live Scores
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('squad')}
                  className="hover:text-emerald-400 transition"
                >
                  Senior Football Squad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('events')}
                  className="hover:text-emerald-400 transition"
                >
                  Community & Youth Programs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('transparency')}
                  className="hover:text-emerald-400 transition"
                >
                  Financial Transparency Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('notices')}
                  className="hover:text-emerald-400 transition"
                >
                  Official Club Notices
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Member Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Membership & Portal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenApply}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition"
                >
                  Apply for Club Membership
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuth}
                  className="hover:text-emerald-400 transition"
                >
                  Member & Executive Login
                </button>
              </li>
              <li>
                <span className="text-slate-500 block">Youth Academy Free Training (Ages 10-17)</span>
              </li>
              <li>
                <span className="text-slate-500 block">Volunteer Relief Brigade Registration</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Secretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Club Secretariat</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ward No. 16, Kukurmara, Bardaghat Municipality, Nawalparasi, Nepal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+977-78-580123 / +977-9857012345</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@nawayuwaclub.org.np</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Registration No: 142/062/063 (Nawalparasi DAO)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nawa Yuwa Club (नयाँ युवा क्लब). All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Constitution & Bylaws</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">ANFA Ethics Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
