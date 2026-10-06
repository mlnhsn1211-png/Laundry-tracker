import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Clock,
  QrCode,
  CreditCard,
  Rotate3d,
  Image as ImageIcon,
  Truck,
  MapPin,
  Search,
  Droplets,
  Calendar,
} from 'lucide-react';
import { TrackOrderForm } from './TrackOrderForm';
import { useLaundry } from '../context/LaundryContext';

interface HeroSectionProps {
  onTrackSuccess: () => void;
  onHowItWorksClick: () => void;
  on3DClick?: () => void;
  onGalleryClick?: () => void;
  onBookPickupClick?: () => void;
  onServicesClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTrackSuccess,
  onHowItWorksClick,
  on3DClick,
  onGalleryClick,
  onBookPickupClick,
  onServicesClick,
}) => {
  const { createBooking } = useLaundry();
  const [heroTab, setHeroTab] = useState<'BOOK' | 'TRACK'>('BOOK');

  // Fast booking state for Hero Quick Book Card
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickAddress, setQuickAddress] = useState('');
  const [quickService, setQuickService] = useState('Eco Wash & Fold (Rp 15k/kg)');
  const [quickBookSuccess, setQuickBookSuccess] = useState<string | null>(null);

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBk = createBooking({
      customerName: quickName.trim() || 'Tamu Bali',
      customerPhone: quickPhone.trim() || '081234567890',
      bookingType: 'HOME_PICKUP',
      scheduledDate: 'Today (Hari Ini)',
      timeSlot: '13:00 - 15:00 WITA',
      pickupAddress: quickAddress.trim() || 'Jl. Raya Munggu, Badung, Bali',
      branchName: 'CleanTrack Laundry - Munggu Bali Hub',
      serviceCategory: quickService,
      estimatedWeightOrQty: '4 kg',
      estimatedCost: 60000,
      notes: 'Quick pickup request from hero banner.',
    });

    setQuickBookSuccess(newBk.bookingNumber);
  };

  return (
    <header className="relative w-full overflow-hidden bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Laundry Brand Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-6 space-y-6"
        >
          {/* Tagline Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Eco Laundry in Munggu, Bali</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Free Pickup in Munggu & Seseh</span>
            </span>

            {on3DClick && (
              <button
                type="button"
                onClick={on3DClick}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-colors cursor-pointer"
              >
                <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>3D Care Drum</span>
              </button>
            )}
          </div>

          {/* Main Laundry Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Bali’s Freshest Eco Laundry &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300">
              Garment Care.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
            CleanTrack provides luxury textile care at honest Bali rates. Organic plant-based detergents, individual sanitized stainless steel drums, and artisan hand steam pressing delivered right to your villa or homestay doorstep.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Plant-based botanical detergents</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>1 Customer = 1 Dedicated drum (never mixed)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Express 4-Hour rush available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Courier pickup in Munggu, Pererenan & Canggu</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBookPickupClick}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Book Laundry Pickup</span>
            </button>

            {onServicesClick && (
              <button
                type="button"
                onClick={onServicesClick}
                className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Services & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setHeroTab('TRACK');
                const el = document.getElementById('hero-action-hub');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Track Order</span>
            </button>
          </div>

          {/* Studio Photography Preview Strip */}
          <div
            onClick={onGalleryClick}
            className="group flex items-center gap-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-2.5 pr-4 transition-all cursor-pointer max-w-md shadow-lg"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-600/50">
              <img
                src="/src/assets/images/laundry_hero_service_1791269640387.jpg"
                alt="CleanTrack Flagship Studio in Munggu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-mono font-semibold text-blue-400 tracking-wider flex items-center gap-1.5">
                <span>Munggu Studio Facility</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">View 5 Studio Photos</span>
              </div>
              <div className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                Jl. Raya Munggu, Mengwi, Badung, Bali
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Tour our equipment, steam press, & botanical softeners
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dual-Action Laundry Hub (Book Pickup OR Track Order) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-6"
          id="hero-action-hub"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-emerald-500/30 rounded-3xl blur-md pointer-events-none" />

            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
              {/* Hub Tabs Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeroTab('BOOK')}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroTab === 'BOOK'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Quick Book Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroTab('TRACK')}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroTab === 'TRACK'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Live Tracker</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Munggu Open</span>
                </div>
              </div>

              {/* Tab 1: Quick Pickup Request Form */}
              {heroTab === 'BOOK' && (
                <div className="space-y-4">
                  {quickBookSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-bold text-lg text-white">
                        Pickup Requested!
                      </h4>
                      <p className="text-xs text-slate-300">
                        Ref: <strong className="font-mono text-emerald-300">{quickBookSuccess}</strong>. Our courier will contact your WhatsApp shortly before pickup at your villa.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickBookSuccess(null);
                          if (onBookPickupClick) onBookPickupClick();
                        }}
                        className="py-2 px-4 rounded-xl bg-white text-slate-900 font-semibold text-xs transition-colors hover:bg-slate-100"
                      >
                        View Full Booking Details
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickBookSubmit} className="space-y-3.5">
                      <div>
                        <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
                          <span>Select Laundry Care</span>
                          <span className="text-[10px] text-blue-400 font-mono">100% Separate Drum</span>
                        </div>
                        <select
                          value={quickService}
                          onChange={(e) => setQuickService(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Eco Wash & Fold (Rp 15k/kg)">Eco Wash & Fold — Rp 15.000 / kg (24h)</option>
                          <option value="Wash & Steam Iron (Rp 22k/kg)">Wash & Steam Iron — Rp 22.000 / kg (24h)</option>
                          <option value="Express 4-Hour Rush (Rp 28k/kg)">Express 4-Hour Rush — Rp 28.000 / kg (Priority)</option>
                          <option value="Bedcover & Duvet Deep Clean (Rp 45k/set)">Bedcover & Duvet — Rp 45.000 / set</option>
                          <option value="Deluxe Silk & Dry Clean (Rp 40k/pcs)">Deluxe Silk & Dry Clean — Rp 40.000 / pcs</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Your Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Liam Vance"
                            value={quickName}
                            onChange={(e) => setQuickName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 block mb-1">WhatsApp Number</label>
                          <input
                            type="tel"
                            placeholder="e.g. 081234567890"
                            value={quickPhone}
                            onChange={(e) => setQuickPhone(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1">
                          Villa / Hotel / Home Address (Munggu & Badung)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Villa Lotus No. 3, Jl. Pantai Seseh, Munggu"
                          value={quickAddress}
                          onChange={(e) => setQuickAddress(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                        <button
                          type="submit"
                          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dispatch Courier Pickup</span>
                        </button>

                        <button
                          type="button"
                          onClick={onBookPickupClick}
                          className="w-full sm:w-auto py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors text-center cursor-pointer"
                        >
                          Advanced Booking Options
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>✓ Digital weigh on arrival</span>
                        <span>✓ QRIS & Cash accepted</span>
                        <span>✓ Real-time WA ETA</span>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 2: Track Order Form */}
              {heroTab === 'TRACK' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 mb-2">
                    Enter your Order ID (e.g. <span className="font-mono text-blue-400">#LDR-10293</span>) or registered phone number to view live wash stage and your 4-digit pickup pass.
                  </div>
                  <TrackOrderForm onSuccess={onTrackSuccess} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};
