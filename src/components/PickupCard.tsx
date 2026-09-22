import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  QrCode as QrCodeIcon,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Share2,
  Clock,
  Sparkles,
  CreditCard,
  Building,
  Copy,
  Check,
  Zap,
  Award,
} from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, PAYMENT_DETAILS, buildWhatsAppMessage, buildWhatsAppLink } from '../utils/formatters';
import { QRCodeModal } from './QRCodeModal';
import { PaymentModal } from './PaymentModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { PokeballIcon } from './PokeballIcon';

interface PickupCardProps {
  order: LaundryOrder;
}

export const PickupCard: React.FC<PickupCardProps> = ({ order }) => {
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const isReady = order.status === 'READY';
  const isPickedUp = order.status === 'PICKED_UP';
  const isPaid = order.paymentStatus === 'PAID';
  const paymentMeta = PAYMENT_DETAILS[order.paymentStatus];

  const shareText = buildWhatsAppMessage({
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    totalPrice: order.totalPrice,
    pickupCode: order.pickupCode,
  });

  const waLink = buildWhatsAppLink(order.customerPhone, shareText);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="w-full relative" id="fast-track-pickup-card">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl poke-box overflow-hidden relative transition-all ${
          isReady
            ? 'bg-slate-950 text-white'
            : isPickedUp
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-950'
        }`}
      >
        {/* Top Header Ribbon: Pokemon 20th Anniversary Style */}
        <div
          className={`py-3 px-6 text-center font-display font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 border-slate-900 ${
            isReady
              ? 'bg-red-600 text-white'
              : isPickedUp
              ? 'bg-slate-800 text-slate-200'
              : 'bg-blue-600 text-white'
          }`}
        >
          {isReady ? (
            <>
              <PokeballIcon size={16} variant="gold" className="animate-spin" />
              <span>FULL HP! YOUR LAUNDRY IS READY FOR PICKUP ⭐</span>
            </>
          ) : isPickedUp ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CHAMPION HANDOVER COMPLETE 🏆</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>CLEANTRACK CARE CYCLE • TARGET: {order.estimatedReadyAt}</span>
            </>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Trainer & Order Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b-2 border-dashed border-slate-800/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-pixel text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold border border-slate-900">
                  TRAINER PASS
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>{order.customerName}</span>
                <span className="text-base text-amber-400">⚡</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{order.customerPhone}</p>
            </div>

            {/* Payment status badge */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
                POKÉCOINS / BILL STATUS
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border-2 border-slate-900 ${
                    isPaid ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                  } flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]`}
                >
                  {isPaid ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />}
                  {paymentMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Total: <span className="font-black text-white text-sm">{formatRupiah(order.totalPrice)}</span>
              </p>
            </div>
          </div>

          {/* Centerpiece: Pokemon 20th Trainer Passcode & QR */}
          {isReady ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Pickup Code Display */}
              <div className="md:col-span-7 bg-white/5 border-2 border-amber-400/60 rounded-3xl p-5 text-center relative overflow-hidden backdrop-blur-sm shadow-[4px_4px_0px_#f59e0b40]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                    <PokeballIcon size={14} variant="gold" />
                    TRAINER PASSCODE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">POKÉCENTER COUNTER</span>
                </div>

                <div className="py-2 flex items-center justify-center gap-3">
                  <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-amber-400 select-all">
                    {order.pickupCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 transition-colors border border-amber-400/40 cursor-pointer"
                    title="Copy 4-digit code"
                  >
                    {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Say this 4-digit passcode or show the QR code to counter staff for instant release.
                </p>
              </div>

              {/* QR Code Action Box */}
              <div className="md:col-span-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition-all poke-box poke-box-hover flex items-center justify-center gap-2 group cursor-pointer shadow-lg"
                  id="btn-show-pickup-qr"
                >
                  <PokeballIcon size={18} variant="ultra" />
                  <span>[ SHOW TRAINER QR 🔴⚪ ]</span>
                </button>

                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all poke-box-sm poke-box-hover flex items-center justify-center gap-1.5 cursor-pointer"
                    id="btn-pay-now-pickup"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Settle Bill via QRIS ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>[ VIEW ORDER DETAILS ]</span>
                </button>
              </div>
            </div>
          ) : isPickedUp ? (
            /* Picked Up Screen */
            <div className="bg-slate-800/60 rounded-3xl p-6 text-center border-2 border-slate-700 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto text-2xl">
                <PokeballIcon size={32} variant="gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Battle-Ready & Picked Up!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-medium">
                Released to Trainer on {order.pickedUpAt || order.updatedAt}. Laundry healed to 100% HP!
              </p>
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold pt-1 underline"
              >
                <Receipt className="w-4 h-4" />
                <span>View Full Itemized Receipt</span>
              </button>
            </div>
          ) : (
            /* In Progress Screen */
            <div className="bg-[#F4F4F9] text-slate-950 rounded-3xl p-6 border-2 border-slate-900 space-y-4 shadow-[4px_4px_0px_#1e293b]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PokeballIcon size={20} className="animate-spin" />
                  <span className="font-display font-black text-base text-slate-950">
                    PokéCenter Healing Cycle 💖
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-950 bg-blue-200 px-3 py-1 rounded-full border border-blue-400">
                  Target: {order.estimatedReadyAt}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Your garments are undergoing our multi-stage care cycle. As soon as folding is complete, the PokéWash bot will notify your WhatsApp with your 4-digit pickup passcode!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="py-2 px-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Services ({order.items.length} items)</span>
                </button>
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="py-2 px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold poke-box-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pre-pay via QRIS ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Location & WhatsApp Share */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Pick up at <strong className="text-slate-200">{order.branchName}</strong> (Open 07:00 - 21:00 WIB)
              </span>
            </div>

            {isReady && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-mono font-bold text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Trainer Pass to WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <QRCodeModal order={order} isOpen={showQR} onClose={() => setShowQR(false)} />
      <PaymentModal
        order={order}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
      />
      <OrderDetailsModal
        order={order}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
};
