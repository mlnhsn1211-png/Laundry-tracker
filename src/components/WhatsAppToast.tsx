import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ExternalLink, X, Check, Copy, BellRing, Zap } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { buildWhatsAppLink } from '../utils/formatters';
import { PokeballIcon } from './PokeballIcon';

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
        className="fixed top-24 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96 rounded-3xl poke-box overflow-hidden bg-slate-950 text-white shadow-2xl"
        id="whatsapp-ready-notification-toast"
      >
        {/* Header styled like WhatsApp alert with Pokemon 20th theme */}
        <div className="bg-amber-400 text-slate-950 px-4 py-3 flex items-center justify-between border-b-2 border-slate-900 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <PokeballIcon size={16} variant="gold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider">CLEANTRACK ALERT 📲</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </div>
              <p className="text-[10px] text-slate-800 font-bold">CleanTrack Bot • {activeNotification.timestamp}</p>
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-full text-slate-950 hover:bg-slate-950/20 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Message bubble body */}
        <div className="p-4 bg-slate-950 space-y-3">
          <div className="bg-slate-900 rounded-2xl p-3.5 border-2 border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line relative font-mono">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <PokeballIcon size={12} variant="standard" />
                LAUNDRY HEALED TO FULL HP 💖
              </span>
              <span className="text-[11px] text-slate-400 font-bold">{activeNotification.orderNumber}</span>
            </div>
            {activeNotification.message}
          </div>

          {/* Quick interactive buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 font-mono text-xs">
            {onOpenPickup && (
              <button
                onClick={() => {
                  onOpenPickup();
                  dismissNotification();
                }}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 poke-box-sm poke-box-hover cursor-pointer"
              >
                <span>OPEN PASS ({activeNotification.pickupCode})</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold py-2 px-3 rounded-xl transition-colors border border-slate-700 text-xs"
                title="Send test WhatsApp to customer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test WA</span>
              </a>

              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2 px-2.5 rounded-xl transition-colors border border-slate-700 text-xs cursor-pointer"
                title="Copy notification text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
