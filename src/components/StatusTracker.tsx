import React from 'react';
import { motion } from 'motion/react';
import {
  PackageCheck,
  Waves,
  Wind,
  Shirt,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { OrderStatus, StatusHistoryItem } from '../types';
import { STATUS_DETAILS, STATUS_PROGRESS_ORDER } from '../utils/formatters';

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
  const isCancelled = currentStatus === 'CANCELLED';

  const currentMeta = STATUS_DETAILS[currentStatus] || STATUS_DETAILS.RECEIVED;
  const activeIndex = currentMeta.stepIndex;

  const stepIcons = [
    PackageCheck, // Received
    Waves,        // Washing
    Wind,         // Drying
    Shirt,        // Ironing & Folding
    Sparkles,     // Ready for Pickup
    CheckCircle2, // Picked Up
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" id="status-tracker-section">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Progress</span>
            {isDelayed && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Delayed
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-0.5">
            {currentMeta.label}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{currentMeta.subtext}</p>
        </div>

        {/* Target Time Badge */}
        <div className="sm:text-right bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center sm:justify-end gap-1">
            <Clock className="w-3 h-3" />
            Estimated Ready
          </span>
          <span className="text-xs font-bold text-slate-900 font-mono">
            {estimatedReadyAt}
          </span>
        </div>
      </div>

      {/* Responsive Progress Stepper */}
      <div className="relative pt-2">
        {/* Desktop / Tablet Stepper (horizontal) */}
        <div className="hidden md:grid md:grid-cols-6 gap-2 relative">
          {/* Continuous Connecting Line */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-slate-100 -z-0">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, Math.max(0, (activeIndex / 5) * 100))}%`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const Icon = stepIcons[index];
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const isPending = activeIndex < index;

            // Find matching history timestamp if completed or current
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="flex flex-col items-center text-center relative z-10">
                {/* Node icon bubble */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-100 shadow-md'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Step labels */}
                <span
                  className={`text-xs mt-3 font-bold leading-tight ${
                    isCurrent
                      ? 'text-emerald-900 font-extrabold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {meta.label}
                </span>

                {/* Timestamp if reached */}
                {historyItem && (
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {historyItem.timestamp.slice(11)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper (vertical timeline list matching PRD Section 7.1 exact example) */}
        <div className="md:hidden space-y-4 relative border-l-2 border-slate-200 ml-4 pl-4">
          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const Icon = stepIcons[index];
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const isPending = activeIndex < index;
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="relative flex items-start gap-3">
                {/* Bullet indicator */}
                <span
                  className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600'
                      : isCurrent
                      ? 'bg-emerald-500 ring-4 ring-emerald-100'
                      : 'bg-slate-300'
                  }`}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs uppercase font-extrabold tracking-wide flex items-center gap-1.5 ${
                        isCurrent
                          ? 'text-emerald-700'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓ ' : isCurrent ? '● ' : '○ '}
                      {meta.label}
                    </span>
                    {historyItem && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {historyItem.timestamp}
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-slate-600 mt-1 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
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
