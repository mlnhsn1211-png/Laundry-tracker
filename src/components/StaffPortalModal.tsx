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
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryOrder, OrderStatus } from '../types';
import { formatRupiah, STATUS_DETAILS, PAYMENT_DETAILS } from '../utils/formatters';
import { PokeballIcon } from './PokeballIcon';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({ isOpen, onClose }) => {
  const { orders, verifyPickup, updateOrderStatus, markOrderAsPaid } = useLaundry();

  const [inputCode, setInputCode] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<LaundryOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [isCameraScanning, setIsCameraScanning] = useState(false);

  if (!isOpen) return null;

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setHandoverSuccess(false);

    if (!inputCode.trim()) {
      setErrorMessage('Please input a 4-digit passcode or Order ID.');
      return;
    }

    const res = verifyPickup(inputCode.trim());
    if (res.valid && res.order) {
      setMatchedOrder(res.order);
    } else {
      setMatchedOrder(null);
      setErrorMessage(res.error || `No matching Trainer order found for "${inputCode}". Verify digits.`);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#0f172a'],
    });
  };

  const handleCompleteHandover = () => {
    if (!matchedOrder) return;

    if (matchedOrder.paymentStatus === 'UNPAID') {
      markOrderAsPaid(matchedOrder.id, 'CASH');
    }

    updateOrderStatus(matchedOrder.id, 'PICKED_UP', 'Clothes handed over to Trainer at PokéCenter Counter');
    setHandoverSuccess(true);
    triggerCelebration();

    setTimeout(() => {
      const refreshed = orders.find((o) => o.id === matchedOrder.id);
      if (refreshed) setMatchedOrder(refreshed);
    }, 300);
  };

  const handleStatusShift = (newStatus: OrderStatus) => {
    if (!matchedOrder) return;
    updateOrderStatus(matchedOrder.id, newStatus, `Staff status transition to ${newStatus}`);
    setTimeout(() => {
      const refreshed = orders.find((o) => o.id === matchedOrder.id);
      if (refreshed) setMatchedOrder(refreshed);
    }, 200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl poke-box overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          id="staff-counter-portal"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <PokeballIcon size={20} variant="gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-lg">CleanTrack Counter Terminal</h3>
                  <span className="font-pixel text-[8px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    20TH
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">Pokémon Center Station • Instant Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Quick Scanner & Code Input */}
            <div className="bg-[#F4F4F9] border-2 border-slate-900 rounded-2xl p-4 space-y-3 shadow-[2px_2px_0px_#1e293b]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ScanLine className="w-4 h-4 text-red-600" />
                  Scan QR Pass or Enter 4-Digit Code
                </label>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-300 font-bold">
                  {orders.length} Active Orders
                </span>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter 4-digit passcode or Order ID (e.g. 4821 or LDR-10293)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-900 rounded-xl text-sm font-mono font-black text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#1e293b]"
                    id="input-staff-lookup"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all poke-box-sm poke-box-hover flex items-center gap-1.5 cursor-pointer"
                  id="btn-staff-verify"
                >
                  <PokeballIcon size={14} variant="standard" />
                  <span>Verify</span>
                </button>
              </form>

              {/* Quick sample code pills for easy staff testing */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-600 font-bold self-center mr-1">
                  Test Passcodes:
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
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                      matchedOrder?.id === o.id
                        ? 'bg-amber-300 text-slate-950 poke-box-sm'
                        : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {o.pickupCode} ({o.customerName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-100 border-2 border-slate-900 text-slate-950 text-xs flex items-center gap-2 shadow-[2px_2px_0px_#1e293b]">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            {/* Matched Order Card */}
            {matchedOrder && (
              <div className="border-2 border-slate-900 rounded-3xl p-5 space-y-5 bg-white shadow-[4px_4px_0px_#1e293b]">
                {/* Order Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {matchedOrder.orderNumber}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Code: {matchedOrder.pickupCode}
                      </span>
                    </div>
                    <h4 className="font-display text-2xl font-black text-slate-950 mt-1">
                      {matchedOrder.customerName}
                    </h4>
                    <p className="text-xs font-mono text-slate-500">{matchedOrder.customerPhone}</p>
                  </div>

                  {/* Payment status badge */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Payment</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-black border-2 border-slate-900 ${
                        matchedOrder.paymentStatus === 'PAID'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {PAYMENT_DETAILS[matchedOrder.paymentStatus].label}
                    </span>
                    <p className="font-mono text-base font-black text-slate-950 mt-1">
                      {formatRupiah(matchedOrder.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between bg-[#F4F4F9] p-3 rounded-2xl border-2 border-slate-900">
                  <div className="flex items-center gap-2">
                    <PokeballIcon size={18} variant="gold" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Current Care State</span>
                      <span className="font-display font-black text-sm text-slate-950">
                        {STATUS_DETAILS[matchedOrder.status]?.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    Target: {matchedOrder.estimatedReadyAt}
                  </span>
                </div>

                {/* Item list summary */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Packaged Garments ({matchedOrder.items.length})
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-200">
                    {matchedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex justify-between">
                        <span className="font-medium text-slate-800">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono text-slate-600 font-bold">{formatRupiah(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Handover Action or Already Completed */}
                {handoverSuccess || matchedOrder.status === 'PICKED_UP' ? (
                  <div className="p-4 bg-emerald-100 border-2 border-slate-900 rounded-2xl text-center space-y-1 shadow-[2px_2px_0px_#1e293b]">
                    <div className="flex items-center justify-center gap-2 font-display font-black text-emerald-950 text-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      <span>CLOTHES HANDED OVER TO TRAINER!</span>
                    </div>
                    <p className="text-xs text-emerald-900 font-medium">
                      Release logged. Trainer Pass marked as completed with zero wait time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {matchedOrder.paymentStatus === 'UNPAID' && (
                      <div className="p-3 bg-amber-100 border-2 border-slate-900 rounded-2xl flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-950 font-bold">Collect Payment at Counter:</span>
                        <span className="font-black text-slate-950 text-sm">{formatRupiah(matchedOrder.totalPrice)}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCompleteHandover}
                      className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-display font-black rounded-2xl text-sm uppercase tracking-wider transition-all poke-box poke-box-hover flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      id="btn-staff-complete-handover"
                    >
                      <PokeballIcon size={18} variant="gold" />
                      <span>
                        {matchedOrder.paymentStatus === 'UNPAID'
                          ? `COLLECT ${formatRupiah(matchedOrder.totalPrice)} & HAND OVER ⚡`
                          : 'VERIFY CODE & COMPLETE HANDOVER ⚡'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Fast Care State Shift Buttons (Nurse Joy station override) */}
                <div className="pt-3 border-t-2 border-dashed border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Override Order Stage:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleStatusShift('WASHING')}
                      className="py-1.5 px-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 font-bold"
                    >
                      🌊 Wash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusShift('DRYING')}
                      className="py-1.5 px-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 font-bold"
                    >
                      🔥 Dry
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusShift('READY')}
                      className="py-1.5 px-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-slate-950 border border-amber-400 font-black"
                    >
                      ⭐ Full HP Ready
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
