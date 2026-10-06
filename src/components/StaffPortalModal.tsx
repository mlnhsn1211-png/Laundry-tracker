import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  ScanLine,
  Search,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  CreditCard,
  Building,
  UserCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Send,
  BellRing,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryOrder, OrderStatus } from '../types';
import {
  formatRupiah,
  STATUS_DETAILS,
  PAYMENT_DETAILS,
  buildWhatsAppMessage,
  buildWhatsAppLink,
} from '../utils/formatters';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({ isOpen, onClose }) => {
  const { orders, verifyPickup, updateOrderStatus, markOrderAsPaid, triggerMockWhatsAppAlert } = useLaundry();

  const [inputCode, setInputCode] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<LaundryOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [staffWaSent, setStaffWaSent] = useState(false);

  if (!isOpen) return null;

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setHandoverSuccess(false);

    if (!inputCode.trim()) {
      setErrorMessage('Please enter a 4-digit pickup code or Order ID.');
      return;
    }

    const res = verifyPickup(inputCode.trim());
    if (res.valid && res.order) {
      setMatchedOrder(res.order);
    } else {
      setMatchedOrder(null);
      setErrorMessage(res.error || `No matching order found for "${inputCode}". Please verify digits.`);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#f59e0b', '#0f172a'],
    });
  };

  const handleCompleteHandover = () => {
    if (!matchedOrder) return;

    if (matchedOrder.paymentStatus === 'UNPAID') {
      markOrderAsPaid(matchedOrder.id, 'CASH');
    }

    updateOrderStatus(matchedOrder.id, 'PICKED_UP', 'Garments handed over to customer at CleanTrack Counter');
    setHandoverSuccess(true);
    triggerCelebration();

    setTimeout(() => {
      const refreshed = orders.find((o) => o.id === matchedOrder.id);
      if (refreshed) setMatchedOrder(refreshed);
    }, 300);
  };

  const handleStatusShift = (newStatus: OrderStatus) => {
    if (!matchedOrder) return;
    updateOrderStatus(matchedOrder.id, newStatus, `Counter status update to ${newStatus}`);
    setTimeout(() => {
      const refreshed = orders.find((o) => o.id === matchedOrder.id);
      if (refreshed) setMatchedOrder(refreshed);
    }, 200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          id="staff-counter-portal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Staff Counter Terminal</h3>
                <p className="text-xs text-slate-400">Order Verification & Fast-Track Handover</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
            {/* Quick Scanner & Code Input */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ScanLine className="w-4 h-4 text-blue-600" />
                  Enter 4-Digit Passcode or Order ID
                </label>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                  {orders.length} Active Orders
                </span>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="e.g. 4821 or #LDR-10293"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    id="input-staff-lookup"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  id="btn-staff-verify"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Verify Pass</span>
                </button>
              </form>

              {/* Quick sample code pills for easy staff testing */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-500 font-medium mr-1">
                  Sample Codes:
                </span>
                {orders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setInputCode(o.pickupCode);
                      setMatchedOrder(o);
                      setErrorMessage(null);
                      setHandoverSuccess(false);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                      matchedOrder?.id === o.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {o.pickupCode} ({o.customerName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Matched Order Card */}
            {matchedOrder && (
              <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-white shadow-sm">
                {/* Order Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {matchedOrder.orderNumber}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Code: {matchedOrder.pickupCode}
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-bold text-slate-900 mt-1">
                      {matchedOrder.customerName}
                    </h4>
                    <p className="text-xs font-mono text-slate-500">{matchedOrder.customerPhone}</p>
                  </div>

                  {/* Payment status badge */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Payment Status</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        matchedOrder.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {PAYMENT_DETAILS[matchedOrder.paymentStatus].label}
                    </span>
                    <p className="font-mono text-base font-bold text-slate-900 mt-1">
                      {formatRupiah(matchedOrder.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Current Stage</span>
                    <span className="font-bold text-sm text-slate-900">
                      {STATUS_DETAILS[matchedOrder.status]?.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Target Ready: {matchedOrder.estimatedReadyAt}
                  </span>
                </div>

                {/* Item list summary */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
                    Packaged Items ({matchedOrder.items.length})
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-100">
                    {matchedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between">
                        <span className="font-medium text-slate-800">
                          {item.weightOrQty} {item.unit} • {item.serviceName}
                        </span>
                        <span className="font-mono text-slate-600 font-semibold">{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Handover Action or Already Completed */}
                {handoverSuccess || matchedOrder.status === 'PICKED_UP' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center gap-2 font-bold text-emerald-900 text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Order Handover Complete</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Release successfully recorded. Zero wait time logged.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {matchedOrder.paymentStatus === 'UNPAID' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-amber-900 font-semibold">Collect Outstanding Balance at Counter:</span>
                        <span className="font-bold text-amber-950 font-mono text-sm">{formatRupiah(matchedOrder.totalPrice)}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCompleteHandover}
                      className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      id="btn-staff-complete-handover"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {matchedOrder.paymentStatus === 'UNPAID'
                          ? `Collect ${formatRupiah(matchedOrder.totalPrice)} & Complete Handover`
                          : 'Verify Code & Complete Handover'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Staff WhatsApp Alert Dispatcher */}
                <div className="pt-3 border-t border-dashed border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Customer WhatsApp Alert
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {matchedOrder.customerPhone}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        triggerMockWhatsAppAlert(
                          matchedOrder,
                          matchedOrder.status === 'READY'
                            ? 'READY'
                            : matchedOrder.status === 'PICKED_UP'
                            ? 'PICKED_UP'
                            : 'STATUS_UPDATE'
                        );
                        setStaffWaSent(true);
                        setTimeout(() => setStaffWaSent(false), 2500);
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{staffWaSent ? 'Alert Dispatched!' : 'Dispatch Live WA Alert'}</span>
                    </button>

                    <a
                      href={buildWhatsAppLink(
                        matchedOrder.customerPhone,
                        buildWhatsAppMessage(
                          {
                            customerName: matchedOrder.customerName,
                            orderNumber: matchedOrder.orderNumber,
                            totalPrice: matchedOrder.totalPrice,
                            pickupCode: matchedOrder.pickupCode,
                            paymentStatus: matchedOrder.paymentStatus,
                            status: matchedOrder.status,
                            branchName: matchedOrder.branchName,
                            branchAddress: matchedOrder.branchAddress,
                            estimatedReadyAt: matchedOrder.estimatedReadyAt,
                          },
                          matchedOrder.status === 'READY'
                            ? 'READY'
                            : matchedOrder.status === 'PICKED_UP'
                            ? 'PICKED_UP'
                            : 'STATUS_UPDATE'
                        )
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Fast Care State Shift Buttons */}
                <div className="pt-3 border-t border-dashed border-slate-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Manual Stage Override:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleStatusShift('WASHING')}
                      className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-medium"
                    >
                      Washing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusShift('DRYING')}
                      className="py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium"
                    >
                      Drying
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusShift('IRONING')}
                      className="py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-medium"
                    >
                      Ironing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusShift('READY')}
                      className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold"
                    >
                      Ready
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
