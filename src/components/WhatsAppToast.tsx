import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  ExternalLink,
  X,
  Check,
  Copy,
  QrCode,
  Volume2,
  Edit2,
  Send,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { buildWhatsAppLink, playNotificationChime } from '../utils/formatters';

interface WhatsAppToastProps {
  onOpenPickup?: () => void;
}

export const WhatsAppToast: React.FC<WhatsAppToastProps> = ({ onOpenPickup }) => {
  const { activeNotification, dismissNotification } = useLaundry();
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState<string>('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  if (!activeNotification) return null;

  const targetPhone = customPhone.trim() || activeNotification.customerPhone;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNotification.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplayChime = () => {
    playNotificationChime();
  };

  const waLink = buildWhatsAppLink(targetPhone, activeNotification.message);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed top-20 right-3 sm:right-6 z-50 max-w-md w-[calc(100vw-1.5rem)] sm:w-[420px] rounded-2xl overflow-hidden bg-white text-slate-900 shadow-2xl border border-emerald-500/20 shadow-emerald-950/15"
        id="whatsapp-ready-notification-toast"
      >
        {/* WhatsApp Branded Header */}
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold shadow-inner">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight">WhatsApp Notification Alert</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-extrabold uppercase animate-pulse">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-normal">
                CleanTrack Bot • {activeNotification.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReplayChime}
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-colors cursor-pointer"
              title="Replay Alert Chime"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={dismissNotification}
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Bubble Body */}
        <div className="p-4 space-y-3.5 bg-slate-50/50">
          {/* Target Recipient Bar */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-500 font-medium">To:</span>
              {isEditingPhone ? (
                <input
                  type="tel"
                  placeholder="e.g. 081234567890"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="px-2 py-1 text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg w-32 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  autoFocus
                />
              ) : (
                <span className="font-mono font-bold text-slate-800 truncate">
                  {targetPhone}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold px-2 py-0.5 rounded-md hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
                title="Change recipient number to test with your own phone"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingPhone ? 'Done' : 'Test My Phone'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp formatted chat bubble */}
          <div className="bg-[#e7fedb] rounded-2xl rounded-tl-sm p-3.5 border border-emerald-200/70 text-xs sm:text-[13px] leading-relaxed text-slate-800 whitespace-pre-line relative shadow-xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-300/40 text-[11px]">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                CleanTrack Verified Bot
              </span>
              <span className="text-emerald-800 font-mono font-semibold">
                {activeNotification.orderNumber}
              </span>
            </div>
            {activeNotification.message}
          </div>

          {/* Action Toolbar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              {/* Primary: Open Directly in WhatsApp */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs cursor-pointer group"
                id="btn-open-in-whatsapp"
              >
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Open in WhatsApp Web / App</span>
              </a>

              {/* Copy Message Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-3 rounded-xl transition-colors border border-slate-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Copy WhatsApp alert text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Open Digital Pass */}
            {onOpenPickup && (
              <button
                type="button"
                onClick={() => {
                  onOpenPickup();
                  dismissNotification();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Digital Pickup Passcode ({activeNotification.pickupCode})</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
