import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are my clothes washed separately or mixed with other customers?',
      a: 'We adhere to a strict 100% individual drum policy. Your clothes are NEVER combined or washed alongside another customer’s laundry. Each order is weighed, tagged, and loaded into its own sanitized front-loading stainless steel washer.',
    },
    {
      q: 'How does doorstep pickup and delivery work in Munggu & Badung?',
      a: 'Simply select your service, enter your villa or home address, and choose your preferred morning, afternoon, or evening time slot. Our courier brings a hanging garment carrier and digital scale to weigh your load on the spot. Free pickup applies for orders 5 kg and above in Munggu & Seseh.',
    },
    {
      q: 'What is your turnaround time for Regular vs Express Rush?',
      a: 'Regular Wash & Fold is ready within 24 hours. If you are on a tight schedule or heading to the airport, our Express 4-Hour Rush jumps the queue with dedicated high-speed wash and steam drying in under 4 to 6 hours.',
    },
    {
      q: 'What kind of detergents and fragrances do you use?',
      a: 'We use plant-based, biodegradable active enzymes free of parabens, chlorine bleach, and harsh phosphates. You can choose complimentary French Lavender or Fresh Ocean Breeze botanical fabric conditioner, or request Unscented / Fragrance-Free for sensitive skin.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Indonesian QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay), Cash in Indonesian Rupiah at the counter or to the courier, and Bank Transfer for monthly villa accounts.',
    },
    {
      q: 'How do I use the digital order tracker and 4-digit pickup pass?',
      a: 'When your order is created, you receive an automated WhatsApp confirmation with a direct tracking link and a 4-digit pass (e.g., #4821). You can check live stages (Washing, Drying, Ironing, Ready). Once ready, simply state your 4-digit pass or show the QR code for a zero-wait counter handover under 2 minutes.',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20" id="faq-section">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-200 mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 font-normal">
          Everything you need to know about our laundry services, eco-detergents, and villa deliveries.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
        <p>Still have questions about special garment fabrics, bulk villa linens, or wedding wear?</p>
        <a
          href="https://wa.me/6281234567890?text=Halo%20CleanTrack%20Munggu%2C%20saya%20mau%20tanya%20tentang%20layanan%20laundry"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Our Munggu Team on WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
