import React from 'react';
import { PackageCheck, Smartphone, BellRing, QrCode, ShieldCheck, Zap, Clock } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Counter Drop-Off',
      desc: 'Drop off garments at CleanTrack. We weigh items and issue a digital order ticket directly to your phone number.',
      icon: PackageCheck,
      badge: 'QUICK INTAKE',
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      number: '02',
      title: 'Real-Time Tracking',
      desc: 'Track each processing stage online: washing, temperature-controlled drying, steam pressing, and final inspection.',
      icon: Smartphone,
      badge: 'LIVE MONITOR',
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    },
    {
      number: '03',
      title: 'Instant WhatsApp Alert',
      desc: 'Get an automatic message when your laundry is packaged, containing your secure 4-digit pickup code and bill status.',
      icon: BellRing,
      badge: 'AUTO NOTIFY',
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      number: '04',
      title: 'Zero-Wait Collection',
      desc: 'Show your digital QR pass or say your 4-digit code. Staff hands over your fresh clothes in under 2 minutes.',
      icon: QrCode,
      badge: 'FAST PICKUP',
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto" id="how-it-works-section">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1 border border-blue-200">
          <Clock className="w-3.5 h-3.5" />
          <span>The CleanTrack Experience</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          How CleanTrack Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Designed to eliminate lost tickets, uncertain ready times, and long counter delays.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.number}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${st.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xl font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                    {st.number}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {st.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Photography Highlights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group">
          <div className="aspect-16/9 w-full overflow-hidden relative">
            <img
              src="/src/assets/images/steam_ironing_press_1791269666554.jpg"
              alt="High-temp steam press craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <span className="text-[10px] font-mono uppercase bg-blue-600 px-2 py-0.5 rounded text-white font-semibold">
                Thermal Steam Smoothing
              </span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 mb-1">
                Precision Hand Steam Pressing
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                High-temp pressurized vapor removes micro-creases while protecting delicate buttons, silk seams, and tailored collars without scorching or flattening.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-blue-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero scorch guarantee · Allergen neutralizing</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group">
          <div className="aspect-16/9 w-full overflow-hidden relative">
            <img
              src="/src/assets/images/folded_linen_clothes_1791269653955.jpg"
              alt="Neatly folded linens and shirts with lavender"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <span className="text-[10px] font-mono uppercase bg-emerald-600 px-2 py-0.5 rounded text-white font-semibold">
                Hotel-Crisp Fold
              </span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-bold text-base text-slate-900 mb-1">
                Boutique Packaging & Botanical Infusion
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Garments are aerated, folded to retail perfection, and packaged into breathable compostable wraps with calming natural French lavender essence.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Natural essential oils · Ready to hang or stack</span>
            </div>
          </div>
        </div>
      </div>

      {/* Speed Guarantee Callout */}
      <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-base sm:text-lg text-white">
              Under 2-Minute Counter Handover Guarantee
            </h4>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Unique 4-digit pickup codes eliminate manual shelf searching and customer verification delays.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Fast-Track Counter Active</span>
        </div>
      </div>
    </section>
  );
};
