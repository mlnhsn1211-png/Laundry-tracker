import React from 'react';
import { Sparkles, MessageCircle, Phone, MapPin, RefreshCw, ShieldCheck, Heart } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export const Footer: React.FC = () => {
  const { resetToMockData } = useLaundry();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Value Prop */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight">CleanTrack Laundry</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Know when it&apos;s ready. Pay faster. Pick up without the wait. The customer-first laundry tracking platform.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-line fast counter handover</span>
            </div>
          </div>

          {/* Col 2: Customer Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Customer Service
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#track-section" className="hover:text-emerald-400 transition-colors">
                  Track Laundry Order
                </a>
              </li>
              <li>
                <a href="#pickup-section" className="hover:text-emerald-400 transition-colors">
                  Digital Pickup Pass
                </a>
              </li>
              <li>
                <a href="#how-it-works-section" className="hover:text-emerald-400 transition-colors">
                  How Pickup Works
                </a>
              </li>
              <li>
                <span className="text-slate-500">Service & Price Catalog (from Rp15.000/kg)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Counter Location & Hours */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Branch Counter
            </h4>
            <div className="space-y-1.5 text-xs leading-relaxed">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jl. Surya Kencana No. 42, Kebayoran, Jakarta Selatan</span>
              </p>
              <p className="text-slate-500 pl-5">
                Hours: Monday – Sunday, 07:00 – 21:00 WIB
              </p>
            </div>
          </div>

          {/* Col 4: Contact / WhatsApp Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Direct Support
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-3 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl text-emerald-300 transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Help Desk</span>
              </a>
              <p className="text-[11px] text-slate-500">
                Staff available for rush requests & garment care questions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 CleanTrack Laundry Customer Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetToMockData}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              title="Reset sample orders back to initial mock state"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo Orders</span>
            </button>
            <span>•</span>
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
