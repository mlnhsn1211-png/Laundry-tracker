import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Flame, Heart } from 'lucide-react';
import { TrackOrderForm } from './TrackOrderForm';
import { PokeballIcon } from './PokeballIcon';

interface HeroSectionProps {
  onTrackSuccess: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTrackSuccess,
  onHowItWorksClick,
}) => {
  return (
    <header className="relative w-full overflow-hidden bg-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900">
      {/* Background Pokemon 20th Anniversary ambient glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f010_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: PRD Hero Copy with Pokemon 20th Anniversary Theme */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-6 space-y-6"
        >
          {/* Pokemon 20th Anniversary Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-pixel text-[9px] font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <PokeballIcon size={14} variant="gold" />
              <span>POKÉMON 20TH ANNIVERSARY</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 text-white font-mono text-xs font-bold border border-red-400">
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
              <span>FULL HP LAUNDRY RECOVERY 💖</span>
            </span>
          </div>

          {/* PRD Headline with Pokemon 20th Gold Accent */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Track Your Laundry.{' '}
            <span className="text-amber-400 underline decoration-red-500 decoration-wavy decoration-4 underline-offset-8">
              Pick It Up Faster.
            </span>
          </h1>

          {/* PRD Supporting text */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
            Heal your clothes back to 100% HP. Check your laundry status in real time, receive an instant WhatsApp alert when ready, and flash your Trainer Pickup Code for a zero-wait counter collection.
          </p>

          {/* 20th Anniversary Trainer Value Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200 pt-1 font-semibold">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <PokeballIcon size={16} variant="standard" />
              <span>Trained with care like a Poké Center</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-amber-400 text-base">⚡</span>
              <span>Under 2-min counter handover</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-base">🎟️</span>
              <span>4-Digit Trainer passcode & QR</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-base">💳</span>
              <span>Pay via QRIS, PokéCoins, or Cash</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#track-section"
              className="py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition-all poke-box poke-box-hover flex items-center gap-2"
            >
              <PokeballIcon size={16} variant="ultra" />
              <span>Track My Laundry</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>

            <button
              type="button"
              onClick={onHowItWorksClick}
              className="py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all border border-slate-700 hover:border-slate-500 poke-box-hover"
            >
              PokéCenter Guide ⭐
            </button>
          </div>
        </motion.div>

        {/* Right Column: Track Card with Pokemon 20th Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-6"
          id="track-section"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-amber-400 rounded-[2.5rem] blur-lg opacity-30 pointer-events-none" />
            <TrackOrderForm onSuccess={onTrackSuccess} />
          </div>
        </motion.div>
      </div>
    </header>
  );
};
