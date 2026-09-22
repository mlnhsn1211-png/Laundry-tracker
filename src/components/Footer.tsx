import React from 'react';
import { MessageCircle, MapPin, RefreshCw, ShieldCheck, Heart } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { PokeballIcon } from './PokeballIcon';

export const Footer: React.FC = () => {
  const { resetToMockData } = useLaundry();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 text-xs border-t-2 border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                <PokeballIcon size={22} variant="gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xl tracking-tight">CleanTrack</span>
                  <span className="font-pixel text-[8px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    20th
                  </span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-medium">
              Know when it&apos;s ready. Pay faster. Pick up without the wait. Trained and cared for like Pokémon at the Pokémon Center.
            </p>
            <div className="flex items-center gap-2 text-amber-400 text-[11px] font-mono font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Train On. Clean On. • 1996–2016</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Trainer Shortcuts
            </h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <a href="#track-section" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <PokeballIcon size={12} variant="standard" />
                  <span>Track Laundry Order</span>
                </a>
              </li>
              <li>
                <a href="#fast-track-pickup-card" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <PokeballIcon size={12} variant="gold" />
                  <span>Trainer Pickup Pass</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works-section" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <PokeballIcon size={12} variant="great" />
                  <span>How PokéCare Works</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500 font-mono">From Rp15.000 / 150 PokéCoins per kg</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Counter Location & Hours */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              PokéCenter Counter Hub
            </h4>
            <div className="space-y-1.5 text-xs leading-relaxed font-medium">
              <p className="flex items-start gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Surya Kencana No. 42, Kebayoran, Jakarta Selatan (PokéCenter Wing)</span>
              </p>
              <p className="text-slate-500 font-mono pl-5 text-[11px]">
                Counter Open: 07:00 – 21:00 WIB Daily
              </p>
            </div>
          </div>

          {/* Col 4: Direct WhatsApp Support */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Trainer WhatsApp Support
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all text-xs font-mono font-bold poke-box-sm poke-box-hover"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp Bot Support</span>
              </a>
              <p className="text-[11px] text-slate-500 font-medium">
                Live staff available for urgent rush orders & special fabric care.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 CleanTrack Platform • Pokémon 20th Anniversary Edition.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetToMockData}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors font-bold cursor-pointer"
              title="Reset sample orders back to initial mock state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Trainers</span>
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
