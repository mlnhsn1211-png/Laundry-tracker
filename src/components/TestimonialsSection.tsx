import React from 'react';
import { Star, MessageSquare, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Wayan Krisna',
      role: 'Villa Operations Manager',
      location: 'Seseh Beach Villas',
      rating: 5,
      comment:
        'We manage 4 luxury villas in Seseh and CleanTrack has been our lifesaver. Bedsheets and pool towels are delivered super crisp and naturally scented. Their courier is always on time, and invoicing is transparent.',
      highlight: 'Villa Partner',
    },
    {
      name: 'Chloe Martens',
      role: 'Remote UX Designer & Nomad',
      location: 'Pererenan, Badung',
      rating: 5,
      comment:
        'As someone sensitive to synthetic laundry perfumes, their botanical hypoallergenic detergent is amazing. My linen shirts and silk slips came back soft and wrinkle-free. The WhatsApp pickup pass makes collection effortless.',
      highlight: 'Sensitive Skin Safe',
    },
    {
      name: 'Liam & Sarah Vance',
      role: 'Expats & Surfers',
      location: 'Jl. Raya Munggu',
      rating: 5,
      comment:
        'The separate drum guarantee is huge for us—we hate when other places mix clothes. Plus, their 4-hour express rush saved us right before our flight to Singapore. Best laundry in southwest Bali!',
      highlight: 'Express 4-Hour Rush',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="reviews-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="uppercase tracking-wider font-mono">Community Verified</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">Munggu & Badung Guests</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            What Customers Say About CleanTrack
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Trusted daily by local residents, villa hosts, surfers, and traveling digital nomads across southwest Bali.
          </p>
        </div>

        {/* Aggregate score */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs self-start md:self-end">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">4.9 / 5.0 Rating</div>
            <span className="text-[10px] text-slate-400">Based on 340+ happy reviews in Bali</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                  {rev.highlight}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal italic mb-4">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">{rev.name}</h4>
                <div className="text-[11px] text-slate-400">
                  {rev.role} · <strong className="text-slate-600">{rev.location}</strong>
                </div>
              </div>
              <span title="Verified Customer">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
