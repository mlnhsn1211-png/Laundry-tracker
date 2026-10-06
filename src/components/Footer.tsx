import React from 'react';
import { MessageCircle, MapPin, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

export const Footer: React.FC = () => {
  const { resetToMockData } = useLaundry();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">CleanTrack</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Know when it&apos;s ready. Pay faster. Pick up without the wait. The modern paperless laundry tracking system.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Wait Pickup Guarantee</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#track-section" className="hover:text-white transition-colors">
                  Track Laundry Order
                </a>
              </li>
              <li>
                <a href="#fast-track-pickup-card" className="hover:text-white transition-colors">
                  Digital Pickup Pass
                </a>
              </li>
              <li>
                <a href="#how-it-works-section" className="hover:text-white transition-colors">
                  How CleanTrack Works
                </a>
              </li>
              <li>
                <span className="text-slate-500">From Rp 15.000 / kg standard wash</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Counter Location & Hours */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              Store Location & Hours
            </h4>
            <div className="space-y-1.5 text-xs leading-relaxed">
              <p className="flex items-start gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Jl. Raya Munggu, Munggu, Kecamatan Mengwi, Kabupaten Badung, Bali</span>
              </p>
              <p className="text-slate-400 pl-5 text-xs">
                Counter Open: 07:00 – 21:00 WITA Daily
              </p>
            </div>
          </div>

          {/* Col 4: Direct WhatsApp Support */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              Customer Support
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
              <p className="text-[11px] text-slate-400">
                Staff available for rush order requests and special garment care inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div>
            <span>© 2026 CleanTrack. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetToMockData}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset sample orders back to initial mock state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
