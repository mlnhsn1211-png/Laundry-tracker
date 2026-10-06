import React from 'react';
import { motion } from 'motion/react';
import {
  PackageCheck,
  Waves,
  Wind,
  Sparkles,
  CheckCircle2,
  Package,
  AlertCircle,
  Clock,
  MessageSquare,
  Send,
  ExternalLink,
} from 'lucide-react';
import { OrderStatus, StatusHistoryItem } from '../types';
import {
  STATUS_DETAILS,
  STATUS_PROGRESS_ORDER,
  buildWhatsAppLink,
  buildCustomerInquiryMessage,
} from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
  estimatedReadyAt: string;
  statusHistory: StatusHistoryItem[];
  orderNumber?: string;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentStatus,
  estimatedReadyAt,
  statusHistory,
  orderNumber,
}) => {
  const { currentOrder, simulateBotReply } = useLaundry();
  const isDelayed = currentStatus === 'DELAYED';
  const currentMeta = STATUS_DETAILS[currentStatus] || STATUS_DETAILS.RECEIVED;
  const activeIndex = currentMeta.stepIndex;

  const targetOrderNum = orderNumber || currentOrder?.orderNumber || '#LDR-10293';
  const targetCustomerName = currentOrder?.customerName;

  const inquiryLink = buildWhatsAppLink(
    '081234567890',
    buildCustomerInquiryMessage(targetOrderNum, targetCustomerName)
  );

  const stepMeta = [
    { label: 'Received', sub: 'Counter intake logged', icon: PackageCheck },
    { label: 'Washing', sub: 'Eco cycle wash', icon: Waves },
    { label: 'Drying', sub: 'Controlled tumble dry', icon: Wind },
    { label: 'Ironing', sub: 'Steam pressing & fold', icon: Sparkles },
    { label: 'Ready', sub: 'Packed & pickup pass sent', icon: CheckCircle2 },
    { label: 'Picked Up', sub: 'Customer handover complete', icon: Package },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" id="status-tracker-section">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Live Order Status
            </span>
            {isDelayed && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Delayed
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
            {currentMeta.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
            {currentMeta.subtext}
          </p>
        </div>

        {/* Target Ready Badge */}
        <div className="sm:text-right bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl">
          <span className="text-[10px] uppercase font-mono font-medium text-slate-500 block flex items-center sm:justify-end gap-1">
            <Clock className="w-3 h-3 text-slate-600" />
            Estimated Ready
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {estimatedReadyAt}
          </span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="relative pt-2">
        {/* Desktop / Tablet Stepper (horizontal) */}
        <div className="hidden md:grid md:grid-cols-6 gap-2 relative">
          {/* Continuous Connecting Line */}
          <div className="absolute top-6 left-6 right-6 h-1.5 bg-slate-100 rounded-full -z-0">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, Math.max(0, (activeIndex / 5) * 100))}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const stepInfo = stepMeta[index];
            const StepIcon = stepInfo.icon;
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="flex flex-col items-center text-center relative z-10">
                {/* Node icon bubble */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </motion.div>

                {/* Step labels */}
                <span
                  className={`text-xs mt-3 font-semibold leading-tight ${
                    isCurrent
                      ? 'text-blue-600 font-bold'
                      : isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {meta.label}
                </span>

                <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 max-w-[120px]">
                  {stepInfo.sub}
                </span>

                {/* Timestamp if recorded */}
                {historyItem && (
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {historyItem.timestamp.slice(11)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper (Vertical Timeline) */}
        <div className="md:hidden space-y-4 relative border-l-2 border-slate-200 ml-4 pl-5">
          {STATUS_PROGRESS_ORDER.map((statusKey, index) => {
            const meta = STATUS_DETAILS[statusKey];
            const stepInfo = stepMeta[index];
            const StepIcon = stepInfo.icon;
            const isCompleted = activeIndex > index;
            const isCurrent = activeIndex === index;
            const historyItem = statusHistory.find((h) => h.status === statusKey);

            return (
              <div key={statusKey} className="relative flex items-start gap-3">
                {/* Bullet node */}
                <span
                  className={`absolute -left-[29px] top-1 w-5 h-5 rounded-full border-2 border-white transition-colors flex items-center justify-center text-[10px] ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <StepIcon className="w-3 h-3" />
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-blue-600 font-bold'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {meta.label}
                    </span>
                    {historyItem && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {historyItem.timestamp}
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-slate-600 mt-1 font-normal bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {meta.subtext}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Live Update Banner */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span>WhatsApp Live Updates Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">
              Automatic WhatsApp notifications sent at each stage change for order {targetOrderNum}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentOrder && (
            <button
              type="button"
              onClick={() => simulateBotReply(currentOrder)}
              className="flex-1 sm:flex-initial py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium text-xs transition-colors cursor-pointer"
            >
              Simulate WA Alert
            </button>
          )}

          <a
            href={inquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs text-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat WA Bot</span>
          </a>
        </div>
      </div>
    </div>
  );
};
