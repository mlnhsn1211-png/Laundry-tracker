import React from 'react';
import {
  ShieldCheck,
  Droplets,
  Zap,
  Truck,
  RotateCw,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      title: 'Dedicated Drum Policy',
      subtitle: '1 Customer = 1 Machine',
      desc: 'We never wash multiple customers’ garments together. Your clothes are treated in their own sanitized stainless steel drum from cycle start to finish.',
      icon: RotateCw,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Bali Eco-Safe Detergents',
      subtitle: 'Zero Harsh Phosphates',
      desc: 'Formulated with organic plant enzymes and natural coconut derivatives. Safe for newborn skin, sensitive dermatological profiles, and Bali’s groundwater.',
      icon: Droplets,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Artisan Steam Pressing',
      subtitle: '65°C Temperature Control',
      desc: 'High-temperature vapor relaxes fibers naturally without scorch marks, preserving delicate silk, Balinese kebaya, and tailored linen silhouettes.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Doorstep Courier Fleet',
      subtitle: 'Across Munggu, Pererenan & Canggu',
      desc: 'Prompt couriers collect and return laundry right at your villa doorstep or apartment lobby with digital scale confirmation on the spot.',
      icon: Truck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Express 4-Hour Turnaround',
      subtitle: 'Same-Day Fast Lane',
      desc: 'Heading to the airport or a sunset dinner? Our express service gets your garments washed, dried, steam-pressed, and packaged in under 4 to 6 hours.',
      icon: Zap,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      title: 'Zero Lost Ticket Hassle',
      subtitle: 'Smart WhatsApp & 4-Digit Pass',
      desc: 'No paper receipts that get lost at the beach. Everything is tracked digitally with WhatsApp notifications and a fast 4-digit counter handover pass.',
      icon: ShieldCheck,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="why-us-section">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-200 mb-1">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>The CleanTrack Standard</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Why Bali Trusts CleanTrack Laundry
        </h2>
        <p className="text-sm text-slate-500 font-normal">
          Designed for residents, villa guests, and digital nomads who value pristine hygiene, fiber safety, and effortless convenience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Pillar 0{idx + 1}
                  </span>
                </div>

                <div className="mb-1 text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wider">
                  {item.subtitle}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
