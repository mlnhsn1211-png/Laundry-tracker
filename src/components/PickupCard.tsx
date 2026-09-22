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
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, PAYMENT_DETAILS, buildWhatsAppMessage, buildWhatsAppLink } from '../utils/formatters';
import { QRCodeModal } from './QRCodeModal';
import { PaymentModal } from './PaymentModal';
import { OrderDetailsModal } from './OrderDetailsModal';

interface PickupCardProps {
  order: LaundryOrder;
}

export const PickupCard: React.FC<PickupCardProps> = ({ order }) => {
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <div className="w-full" id="fast-track-pickup-card">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl border-2 transition-all shadow-xl overflow-hidden ${
          isReady
            ? isPaid
              ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/80 text-white shadow-emerald-900/20'
              : 'bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-amber-500/80 text-white shadow-amber-900/20'
            : isPickedUp
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Status Callout Banner */}
        <div
          className={`py-3 px-6 text-center text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 ${
            isReady
              ? isPaid
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-400 text-slate-950'
              : isPickedUp
              ? 'bg-slate-800 text-slate-300'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {isReady ? (
            <>
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span>YOUR LAUNDRY IS READY FOR PICKUP</span>
            </>
          ) : isPickedUp ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>LAUNDRY PICKED UP & COMPLETED</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>LAUNDRY IN PROGRESS • ESTIMATED READY: {order.estimatedReadyAt}</span>
            </>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Order & Customer Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Order Reference</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono font-bold tracking-tight">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {order.customerName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{order.customerPhone}</p>
            </div>

            {/* Payment status badge */}
            <div className="text-right">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Payment Status
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${paymentMeta.badgeBg} flex items-center gap-1.5`}
                >
                  {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {paymentMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Total: <span className="font-bold text-white text-sm">{formatRupiah(order.totalPrice)}</span>
              </p>
            </div>
          </div>

          {/* Differentiating Fast-Track Centerpiece */}
          {isReady ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Pickup Code Display */}
              <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-2 right-3 text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
                  Counter Passcode
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Pickup Code
                </p>
                <div className="py-2">
                  <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-emerald-400 drop-shadow-sm">
                    {order.pickupCode}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Say this 4-digit code at the counter for instant order release.
                </p>
              </div>

              {/* QR Code Action Box */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group"
                  id="btn-show-pickup-qr"
                >
                  <QrCodeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>[ SHOW PICKUP QR ]</span>
                </button>

                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
                    id="btn-pay-now-pickup"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Now via QRIS ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10"
                >
                  <Receipt className="w-4 h-4" />
                  <span>[ VIEW ORDER DETAILS ]</span>
                </button>
              </div>
            </div>
          ) : isPickedUp ? (
            /* Already Picked Up Screen */
            <div className="bg-slate-800/60 rounded-2xl p-6 text-center border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">This order has been picked up</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Completed on {order.pickedUpAt || order.updatedAt}. We hope your clothes are fresh and ready to wear!
              </p>
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 font-semibold pt-1"
              >
                <Receipt className="w-4 h-4" />
                <span>View Full Itemized Receipt</span>
              </button>
            </div>
          ) : (
            /* In Progress Screen */
            <div className="bg-slate-50 text-slate-900 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
                  <span className="font-bold text-sm text-slate-900">Laundry Processing</span>
                </div>
                <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Target: {order.estimatedReadyAt}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Your garments are currently undergoing our multi-stage care cycle. As soon as ironing and packaging are completed, you will receive an instant WhatsApp alert with your 4-digit pickup code!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Services ({order.items.length} items)</span>
                </button>
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pre-pay Bill ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pickup Instructions & Location Footer */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Pick up at <strong className="text-slate-200">{order.branchName}</strong> (Open 07:00 - 21:00)
              </span>
            </div>

            {isReady && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Pickup Pass via WhatsApp</span>
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
