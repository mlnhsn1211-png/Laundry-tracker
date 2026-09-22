import React from 'react';
import { motion } from 'motion/react';
import {
  PackageCheck,
  Waves,
  Flame,
  Shield,
  Sparkles,
  Trophy,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { OrderStatus, StatusHistoryItem } from '../types';
import { STATUS_DETAILS, STATUS_PROGRESS_ORDER } from '../utils/formatters';
import { PokeballIcon } from './PokeballIcon';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
  estimatedReadyAt: string;
  statusHistory: StatusHistoryItem[];
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentStatus,
  estimatedReadyAt,
  statusHistory,
}) => {
  const isDelayed = currentStatus === 'DELAYED';
  const currentMeta = STATUS_DETAILS[currentStatus] || STATUS_DETAILS.RECEIVED;
  const activeIndex = currentMeta.stepIndex;

  const pokemonStepMeta = [
    { label: 'Order Received', sub: 'Poké Center Check-In', ball: 'standard' as const, emoji: '🔴⚪' },
    { label: 'Washing', sub: 'Hydro Pump Wash', ball: 'great' as const, emoji: '🌊' },
    { label: 'Drying', sub: 'Flame Tumble Dry', ball: 'ultra' as const, emoji: '🔥' },
    { label: 'Ironing & Folding', sub: 'Iron Defense Steam', ball: 'master' as const, emoji: '🛡️' },
    { label: 'Ready for Pickup', sub: '100% Full HP Healed', ball: 'gold' as const, emoji: '⭐' },
    { label: 'Picked Up', sub: 'Trainer Handover Done', ball: 'gold' as const, emoji: '🏆' },
  ];

  const stepIcons = [PackageCheck, Waves, Flame, Shield, Sparkles, Trophy];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 poke-box space-y-6" id="status-tracker-section">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-600 text-white font-bold">
              HEALING RADAR 📡
            </span>
            {isDelayed && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-400 text-slate-950 text-[11px] font-mono font-black border border-slate-900 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                DELAYED
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-black text-slate-950 mt-1 flex items-center gap-2">
            <span>{currentMeta.label}</span>
            <span>{pokemonStepMeta[activeIndex]?.emoji || '⚡'}</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">{currentMeta.subtext}</p>
        </div>

        {/* Target Ready Badge */}
        <div className="sm:text-right bg-amber-300 px-4 py-2.5 rounded-2xl poke-box-sm">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-800 block flex items-center sm:justify-end gap-1">
            <Clock className="w-3 h-3 text-slate-950" />
            TARGET FULL HP TIME
          </span>
          <span className="text-xs font-mono font-black text-slate-950">
            {estimatedReadyAt}
          </span>
        </div>
      </div>

      {/* Progress Stepper with Pokeball Nodes */}
      <div className="relative pt-2">
        {/* Desktop / Tablet Stepper (horizontal) */}
        <div className="hidden md:grid md:grid-cols-6 gap-2 relative">
          {/* Continuous Connecting Line */}
          <div className="absolute top-7 left-6 right-6 h-2 bg-slate-100 rounded-full -z-0 border border-slate-300">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-amber-400 border-r-2 border-slate-900 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, Math.max(0, (activeIndex / 5) * 100))}%`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const pokeMeta = pokemonStepMeta[index];
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="flex flex-col items-center text-center relative z-10">
                {/* Node icon bubble */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-slate-950 text-white poke-box-sm'
                      : isCurrent
                      ? 'bg-amber-300 text-slate-950 poke-box ring-4 ring-amber-200'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  <PokeballIcon
                    size={26}
                    variant={isCompleted || isCurrent ? pokeMeta.ball : 'standard'}
                    className={!isCompleted && !isCurrent ? 'opacity-35 grayscale' : ''}
                  />
                </motion.div>

                {/* Step labels */}
                <span
                  className={`text-xs mt-3 font-display font-black leading-tight ${
                    isCurrent
                      ? 'text-slate-950 font-black'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {meta.label}
                </span>

                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {pokeMeta.sub}
                </span>

                {/* Timestamp if recorded */}
                {historyItem && (
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {historyItem.timestamp.slice(11)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper (Vertical Pokemon Timeline) */}
        <div className="md:hidden space-y-4 relative border-l-2 border-slate-900 ml-4 pl-5">
          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const pokeMeta = pokemonStepMeta[index];
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="relative flex items-start gap-3">
                {/* Bullet node */}
                <span
                  className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 border-slate-900 transition-colors flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-slate-950 text-white'
                      : isCurrent
                      ? 'bg-amber-300 text-slate-950 ring-4 ring-amber-200'
                      : 'bg-white text-slate-400'
                  }`}
                >
                  <PokeballIcon size={12} variant={pokeMeta.ball} />
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-display font-black uppercase tracking-wide flex items-center gap-1.5 ${
                        isCurrent
                          ? 'text-slate-950 bg-amber-300 px-2 py-0.5 rounded-lg border border-slate-900'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {pokeMeta.emoji} {meta.label}
                    </span>
                    {historyItem && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {historyItem.timestamp}
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {meta.subtext}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
