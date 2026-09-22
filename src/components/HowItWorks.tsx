import React from 'react';
import { PackageCheck, Smartphone, BellRing, QrCode, ShieldCheck, Zap, Heart } from 'lucide-react';
import { PokeballIcon } from './PokeballIcon';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Check-In At Counter',
      desc: 'Drop off your garments at the PokéWash counter. Your digital Order ID is instantly logged with zero paper clutter.',
      icon: PackageCheck,
      badge: 'POKÉ CENTER',
      ball: 'standard' as const,
      color: 'bg-red-500 text-white',
    },
    {
      number: '02',
      title: 'Elemental Care Cycle',
      desc: 'Track every cycle from your Pokédex / phone in real time: hydro washing, tumble heat drying, and steam press.',
      icon: Smartphone,
      badge: 'LIVE HEALING',
      ball: 'great' as const,
      color: 'bg-blue-600 text-white',
    },
    {
      number: '03',
      title: 'WhatsApp Ready Ping',
      desc: 'Receive an automatic WhatsApp message the second your clothes reach 100% Full HP with your 4-digit Trainer passcode.',
      icon: BellRing,
      badge: 'AUTO ALERT',
      ball: 'ultra' as const,
      color: 'bg-amber-400 text-slate-950',
    },
    {
      number: '04',
      title: 'Flash Trainer Pass',
      desc: 'Show your QR pass or say your 4-digit code. Staff hands over your clothes in under 2 minutes with zero queue delay.',
      icon: QrCode,
      badge: 'FAST PASS',
      ball: 'gold' as const,
      color: 'bg-purple-600 text-white',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto" id="how-it-works-section">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white font-pixel text-[9px] font-bold uppercase tracking-widest mb-1 border border-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <PokeballIcon size={12} variant="gold" />
          <span>CLEANTRACK GUIDE • 20TH ANNIVERSARY</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
          The 4-Step Trainer Laundry Quest
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Inspired by the seamless care of the Pokémon Center. Fast check-in, real-time healing tracking, and zero queue pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.number}
              className="bg-white rounded-3xl p-6 poke-box poke-box-hover flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center poke-box-sm ${st.color}`}>
                    <PokeballIcon size={24} variant={st.ball} />
                  </div>
                  <span className="font-pixel text-lg font-black text-slate-300 group-hover:text-red-600 transition-colors">
                    {st.number}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {st.badge}
                  </span>
                </div>
                <h3 className="font-display font-black text-lg text-slate-950 mb-1.5">{st.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed Guarantee Callout */}
      <div className="mt-8 bg-slate-950 text-white rounded-3xl p-6 sm:p-7 poke-box flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 poke-box-sm flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h4 className="font-display font-black text-base sm:text-lg flex items-center gap-2">
              <span>Under 2-Minute Trainer Handover Guarantee</span>
              <span className="text-xs font-pixel text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">20TH</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Unique digital pickup codes eliminate manual sorting and order search delays entirely.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-950 bg-amber-400 px-3.5 py-2 rounded-xl poke-box-sm shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>TRAIN ON. CLEAN ON. ⚡</span>
        </div>
      </div>
    </section>
  );
};
