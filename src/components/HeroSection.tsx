import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Clock, QrCode, CreditCard } from 'lucide-react';
import { TrackOrderForm } from './TrackOrderForm';

interface HeroSectionProps {
  onTrackSuccess: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTrackSuccess,
  onHowItWorksClick,
}) => {
  return (
    <header className="relative w-full overflow-hidden bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-6 space-y-6"
        >
          {/* Tagline Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Laundry Counter Experience</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Under 2-Min Pickup Handover</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Track Your Laundry.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Pick It Up Faster.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
            Never wait or guess again. Check your laundry progress in real time, receive an instant WhatsApp alert when clothes are fresh and packed, and pick up without delay using your digital 4-digit pass.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Accurate ready-time countdowns</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>4-Digit passcode & verified QR</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pay in seconds via QRIS or Cash</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fabric safety & weigh assurance</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#track-section"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Track Laundry Order</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onHowItWorksClick}
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/20"
            >
              How It Works
            </button>
          </div>
        </motion.div>

        {/* Right Column: Track Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-6"
          id="track-section"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl blur-md pointer-events-none" />
            <TrackOrderForm onSuccess={onTrackSuccess} />
          </div>
        </motion.div>
      </div>
    </header>
  );
};
