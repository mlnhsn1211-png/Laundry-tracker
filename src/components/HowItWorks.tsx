import React from 'react';
import { PackageCheck, Smartphone, BellRing, QrCode, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Drop Off Laundry',
      desc: 'Leave your clothes at CleanTrack counter. Receive your digital Order ID instantly via SMS or paper slip.',
      icon: PackageCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      number: '02',
      title: 'Track Live Progress',
      desc: 'Check live status anytime from your phone: Washing, Drying, or Ironing. No login or password required.',
      icon: Smartphone,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      number: '03',
      title: 'Instant Ready Alert',
      desc: 'Receive an automatic WhatsApp notification the moment packaging is completed, complete with your 4-digit Pickup Code.',
      icon: BellRing,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      number: '04',
      title: 'Fast-Track Pickup',
      desc: 'Show your QR code or read your 4-digit code. Staff hands over your fresh clothes in under 2 minutes.',
      icon: QrCode,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto" id="how-it-works-section">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          The Zero-Wait Experience
        </span>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          How CleanTrack Works
        </h2>
        <p className="text-sm text-slate-600">
          We built this platform so you never have to ask &quot;Laundry saya sudah selesai belum?&quot; or wait in line while staff search for bags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.number}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${st.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-200">{st.number}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Speed Guarantee Banner */}
      <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Under 2-Minute Counter Handover</h4>
            <p className="text-xs text-slate-400">
              Unique digital pickup codes eliminate manual order search delays completely.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Security Guaranteed</span>
        </div>
      </div>
    </section>
  );
};
