import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Clock, QrCode } from 'lucide-react';
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
    <header className="relative w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Subtle backdrop glowing ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: PRD Hero Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-6 space-y-6"
        >
          {/* PRD Value Proposition Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-300" />
            <span>Zero Waiting • Instant Handover</span>
          </div>

          {/* Headline matching PRD Section 8 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
            Track Your Laundry.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Pick It Up Faster.
            </span>
          </h1>

          {/* Supporting text matching PRD Section 8 */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
            Check your laundry status, receive a ready notification, and use your pickup code for a faster collection.
          </p>

          {/* Key Value Prop Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Know when it&apos;s ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pay faster via QRIS & Cash</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Digital 4-digit pickup code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No account or password needed</span>
            </div>
          </div>

          {/* Action CTAs matching PRD Section 8 */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#track-section"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span>Track My Laundry</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onHowItWorksClick}
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm transition-colors border border-white/10"
            >
              How It Works
            </button>
          </div>
        </motion.div>

        {/* Right Column: Instant Track Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-6"
          id="track-section"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.2rem] blur-xl opacity-20" />
            <TrackOrderForm onSuccess={onTrackSuccess} />
          </div>
        </motion.div>
      </div>
    </header>
  );
};
