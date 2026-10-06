import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageSquare,
  Send,
  Copy,
  Check,
  Phone,
  Volume2,
  Clock,
  Sparkles,
  ExternalLink,
  History,
  AlertCircle,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryOrder } from '../types';
import {
  buildWhatsAppMessage,
  buildWhatsAppLink,
  WhatsAppAlertType,
  playNotificationChime,
  formatRupiah,
} from '../utils/formatters';

interface WhatsAppAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrder?: LaundryOrder | null;
}

export const WhatsAppAlertModal: React.FC<WhatsAppAlertModalProps> = ({
  isOpen,
  onClose,
  initialOrder,
}) => {
  const { orders, currentOrder, triggerMockWhatsAppAlert, notificationHistory } = useLaundry();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrder?.id || currentOrder?.id || (orders[0] ? orders[0].id : '')
  );
  const [alertType, setAlertType] = useState<WhatsAppAlertType>('READY');
  const [customPhone, setCustomPhone] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'composer' | 'history'>('composer');

  if (!isOpen) return null;

  const targetOrder = orders.find((o) => o.id === selectedOrderId) || currentOrder || orders[0];

  const effectivePhone =
    customPhone.trim() || (targetOrder ? targetOrder.customerPhone : '081234567890');

  const previewMessage = targetOrder
    ? buildWhatsAppMessage(
        {
          customerName: targetOrder.customerName,
          orderNumber: targetOrder.orderNumber,
          totalPrice: targetOrder.totalPrice,
          pickupCode: targetOrder.pickupCode,
          paymentStatus: targetOrder.paymentStatus,
          status: targetOrder.status,
          branchName: targetOrder.branchName,
          branchAddress: targetOrder.branchAddress,
          estimatedReadyAt: targetOrder.estimatedReadyAt,
          itemsCount: targetOrder.items.length,
        },
        alertType
      )
    : '';

  const waLink = buildWhatsAppLink(effectivePhone, previewMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    if (!targetOrder) return;
    triggerMockWhatsAppAlert(targetOrder, alertType, effectivePhone);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          id="whatsapp-alert-modal"
        >
          {/* Header */}
          <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-700 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shadow-inner">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  WhatsApp Alert Dispatch Center
                </h3>
                <p className="text-xs text-emerald-100">
                  Preview, compose, and send instant customer notifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playNotificationChime()}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-colors"
                title="Test Audio Chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-2 shrink-0">
            <button
              onClick={() => setActiveTab('composer')}
              className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'composer'
                  ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Compose & Test Alert
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Recent Alerts ({notificationHistory.length})</span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
            {activeTab === 'composer' ? (
              <>
                {/* Order Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    1. Select Target Order
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {orders.slice(0, 6).map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                          selectedOrderId === ord.id
                            ? 'bg-emerald-50 border-emerald-600 font-semibold ring-2 ring-emerald-600/20 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono block font-bold text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {ord.customerName}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                          Code: {ord.pickupCode}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert Type Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    2. Select WhatsApp Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: 'READY', label: 'Ready for Pickup', desc: '4-Digit Code & Pass' },
                      { type: 'STATUS_UPDATE', label: 'Stage Progress', desc: 'Wash/Iron ETA' },
                      { type: 'DELAYED', label: 'Care Delay Notice', desc: 'Gentle Care Alert' },
                      { type: 'PICKED_UP', label: 'Handover Receipt', desc: 'Thank You & Slip' },
                    ].map((tpl) => (
                      <button
                        key={tpl.type}
                        type="button"
                        onClick={() => setAlertType(tpl.type as WhatsAppAlertType)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                          alertType === tpl.type
                            ? 'bg-emerald-50 border-emerald-600 font-semibold ring-2 ring-emerald-600/20'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold text-slate-900 block">{tpl.label}</span>
                        <span className="text-[10px] text-slate-500">{tpl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Phone Override */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      3. Recipient WhatsApp Number
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 font-mono">
                      Current: {targetOrder?.customerPhone}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder={`Leave empty to use customer phone (${targetOrder?.customerPhone || '081234567890'})`}
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs font-mono font-medium bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    {customPhone && (
                      <button
                        type="button"
                        onClick={() => setCustomPhone('')}
                        className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter your own WhatsApp number (e.g. 0812...) if you want to test receiving the actual message on your personal phone!
                  </p>
                </div>

                {/* Live Message Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp Message Preview
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <div className="bg-[#e7fedb] rounded-2xl rounded-tl-sm p-4 border border-emerald-200/80 text-xs sm:text-sm font-sans leading-relaxed text-slate-800 whitespace-pre-line shadow-xs">
                    {previewMessage}
                  </div>
                </div>

                {/* Send Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSimulateSend}
                    className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                    id="btn-simulate-whatsapp-alert"
                  >
                    <Send className="w-4 h-4" />
                    <span>Trigger Live Alert Notification</span>
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                    id="btn-open-real-whatsapp"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Send Real WhatsApp (wa.me)</span>
                  </a>
                </div>
              </>
            ) : (
              /* Recent Alert History Tab */
              <div className="space-y-4">
                {notificationHistory.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm font-medium">No alerts sent yet in this session.</p>
                    <p className="text-xs">
                      Switch to "Compose & Test Alert" or update an order to READY to trigger your first alert.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notificationHistory.map((notif) => (
                      <div
                        key={notif.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">
                              {notif.orderNumber}
                            </span>
                            <span className="text-slate-600">• {notif.customerName}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{notif.timestamp}</span>
                        </div>
                        <div className="text-slate-700 whitespace-pre-line text-[11px] max-h-24 overflow-y-auto bg-white p-2 rounded-lg border border-slate-100">
                          {notif.message}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-emerald-700">
                            Sent to: {notif.customerPhone}
                          </span>
                          <a
                            href={buildWhatsAppLink(notif.customerPhone, notif.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                          >
                            <Send className="w-3 h-3" />
                            <span>Resend via WA</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
