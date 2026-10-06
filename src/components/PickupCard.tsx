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
  Package,
  MessageSquare,
  Printer,
  BellRing,
} from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, PAYMENT_DETAILS, buildWhatsAppMessage, buildWhatsAppLink } from '../utils/formatters';
import { QRCodeModal } from './QRCodeModal';
import { PaymentModal } from './PaymentModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { WhatsAppAlertModal } from './WhatsAppAlertModal';
import { useLaundry } from '../context/LaundryContext';

interface PickupCardProps {
  order: LaundryOrder;
}

export const PickupCard: React.FC<PickupCardProps> = ({ order }) => {
  const { triggerMockWhatsAppAlert } = useLaundry();
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const isReady = order.status === 'READY';
  const isPickedUp = order.status === 'PICKED_UP';
  const isPaid = order.paymentStatus === 'PAID';
  const paymentMeta = PAYMENT_DETAILS[order.paymentStatus];

  const shareText = buildWhatsAppMessage(
    {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      pickupCode: order.pickupCode,
      paymentStatus: order.paymentStatus,
      status: order.status,
      branchName: order.branchName,
      branchAddress: order.branchAddress,
      estimatedReadyAt: order.estimatedReadyAt,
    },
    isReady ? 'READY' : isPickedUp ? 'PICKED_UP' : 'STATUS_UPDATE'
  );

  const waLink = buildWhatsAppLink(order.customerPhone, shareText);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSendInstantAlert = () => {
    triggerMockWhatsAppAlert(order, isReady ? 'READY' : 'STATUS_UPDATE');
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 2500);
  };

  const handlePrintPass = () => {
    setShowDetails(true);
  };

  return (
    <div className="w-full relative" id="fast-track-pickup-card">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl overflow-hidden relative transition-all border ${
          isReady
            ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
            : isPickedUp
            ? 'bg-slate-800 text-white border-slate-700 shadow-md'
            : 'bg-white text-slate-900 border-slate-200 shadow-sm'
        }`}
      >
        {/* Top Header Ribbon */}
        <div
          className={`py-2.5 px-6 text-center font-medium text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
            isReady
              ? 'bg-emerald-600 text-white'
              : isPickedUp
              ? 'bg-slate-700 text-slate-200'
              : 'bg-blue-600 text-white'
          }`}
        >
          {isReady ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Your Laundry is Ready for Pickup! Zero-Wait Handover Active</span>
            </>
          ) : isPickedUp ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Order Handover Complete</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-blue-200" />
              <span>Estimated Ready Time: {order.estimatedReadyAt}</span>
            </>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Customer & Order Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Digital Pickup Pass
                </span>
                <span className="font-mono text-xs font-semibold text-slate-400">
                  {order.orderNumber}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {order.customerName}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{order.customerPhone}</p>
            </div>

            {/* Payment status badge */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-medium tracking-wider text-slate-400 block mb-1">
                Payment Status
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    isPaid
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {paymentMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Total:{' '}
                <span
                  className={`font-bold text-sm ${
                    isReady || isPickedUp ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatRupiah(order.totalPrice)}
                </span>
              </p>
            </div>
          </div>

          {/* Centerpiece: Pickup Passcode & QR */}
          {isReady ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Pickup Code Display */}
              <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    4-Digit Fast Pickup Passcode
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verbal or QR</span>
                </div>

                <div className="py-2 flex items-center justify-center gap-3">
                  <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-widest text-emerald-400 select-all">
                    {order.pickupCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 transition-colors border border-white/10 cursor-pointer"
                    title="Copy 4-digit code"
                  >
                    {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-normal mt-1">
                  Say this 4-digit passcode or show your QR code to counter staff for instant release.
                </p>
              </div>

              {/* QR Code Action Box */}
              <div className="md:col-span-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 group cursor-pointer"
                  id="btn-show-pickup-qr"
                >
                  <QrCodeIcon className="w-4 h-4" />
                  <span>Show Pickup QR Code</span>
                </button>

                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    id="btn-pay-now-pickup"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Settle Bill via QRIS ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSendInstantAlert}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                    title="Send instant WhatsApp alert notification"
                  >
                    <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{alertSent ? 'Alert Sent!' : 'Send WA Alert'}</span>
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    title="Open chat in WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open in WA</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt Breakdown</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowWhatsAppModal(true)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                    title="Customize and test WhatsApp alert"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Alert Options</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isPickedUp ? (
            /* Picked Up Screen */
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Order Successfully Picked Up</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-normal">
                Released on {order.pickedUpAt || order.updatedAt}. Thank you for using CleanTrack!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 font-semibold underline cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Full Itemized Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Receipt to WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* In Progress Screen */
            <div className="bg-slate-50 text-slate-900 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-display font-bold text-base text-slate-900">
                    Order In Processing
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Target: {order.estimatedReadyAt}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Your garments are undergoing professional wash, dry, and quality folding. As soon as inspection is complete, CleanTrack will alert your WhatsApp with your 4-digit pickup code!
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Services ({order.items.length} items)</span>
                </button>
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pre-pay via QRIS ({formatRupiah(order.totalPrice)})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSendInstantAlert}
                  className="py-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Test WhatsApp progress alert"
                >
                  <BellRing className="w-4 h-4 text-emerald-600" />
                  <span>{alertSent ? 'Alert Sent!' : 'Test WA Alert'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Location & WhatsApp Share */}
          <div className="pt-3 border-t border-slate-200/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Pick up at <strong className={isReady || isPickedUp ? 'text-slate-200' : 'text-slate-700'}>{order.branchName}</strong> (Open 07:00 - 21:00 WITA)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(true)}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium text-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Dispatch Center</span>
              </button>
            </div>
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
      <WhatsAppAlertModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        initialOrder={order}
      />
    </div>
  );
};
