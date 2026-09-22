import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ExternalLink, X, Check, Copy, BellRing } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { buildWhatsAppLink } from '../utils/formatters';

interface WhatsAppToastProps {
  onOpenPickup?: () => void;
}

export const WhatsAppToast: React.FC<WhatsAppToastProps> = ({ onOpenPickup }) => {
  const { activeNotification, dismissNotification } = useLaundry();
  const [copied, setCopied] = useState(false);

  if (!activeNotification) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNotification.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waLink = buildWhatsAppLink(
    activeNotification.customerPhone,
    activeNotification.message
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed top-20 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96 shadow-2xl rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900 text-white"
        id="whatsapp-ready-notification-toast"
      >
        {/* Header styled like WhatsApp notification */}
        <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">WhatsApp Notification</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              </div>
              <p className="text-xs text-emerald-100 font-medium">CleanTrack Laundry Bot • {activeNotification.timestamp}</p>
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message bubble body */}
        <div className="p-4 bg-slate-900 space-y-3">
          <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700/60 font-sans text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line relative">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5" />
                LAUNDRY READY FOR PICKUP
              </span>
              <span className="text-[11px] font-mono text-slate-400">{activeNotification.orderNumber}</span>
            </div>
            {activeNotification.message}
          </div>

          {/* Quick interactive buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            {onOpenPickup && (
              <button
                onClick={() => {
                  onOpenPickup();
                  dismissNotification();
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Pickup Code ({activeNotification.pickupCode})</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold py-2 px-3 rounded-lg text-xs transition-colors border border-emerald-500/30"
                title="Send test WhatsApp to customer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test WhatsApp</span>
              </a>

              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-2.5 rounded-lg text-xs transition-colors border border-slate-700"
                title="Copy notification text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
