import React, { useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, QrCode as QrCodeIcon, Banknote, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { LaundryOrder, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';

interface PaymentModalProps {
  order: LaundryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { markOrderAsPaid } = useLaundry();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS');
  const [qrisQrUrl, setQrisQrUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  React.useEffect(() => {
    if (!order) return;
    // Generate simulated QRIS payload
    const qrisPayload = `00020101021226610014ID.GO.QRIS.WWW01189360091100293847250215000000000000520458125303360540${order.totalPrice}5802ID5918CLEANTRACK LAUNDRY6007JAKARTA62070703A01630489AB`;
    QRCode.toDataURL(qrisPayload, {
      width: 240,
      margin: 1,
      color: { dark: '#020617', light: '#ffffff' },
    }).then(setQrisQrUrl).catch(console.error);
  }, [order]);

  if (!isOpen || !order) return null;

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      markOrderAsPaid(order.id, selectedMethod);
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          id="payment-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Settle Laundry Payment</h3>
              <p className="text-xs text-slate-400">Order {order.orderNumber} • {order.customerName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">Total Bill</p>
                <p className="text-2xl font-black text-indigo-950 tracking-tight">{formatRupiah(order.totalPrice)}</p>
              </div>
              <div className="px-2.5 py-1 bg-indigo-200/70 text-indigo-900 rounded-full text-xs font-bold">
                {order.items.length} services included
              </div>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Payment Confirmed!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your payment of {formatRupiah(order.totalPrice)} has been recorded. Your pickup code is ready for zero-wait handover.
                </p>
              </div>
            ) : (
              <>
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('QRIS')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedMethod === 'QRIS'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <QrCodeIcon className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('CASH')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedMethod === 'CASH'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs">Cash at Counter</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('BANK_TRANSFER')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedMethod === 'BANK_TRANSFER'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="text-xs">Bank Virtual</span>
                    </button>
                  </div>
                </div>

                {/* Method Specific Display */}
                {selectedMethod === 'QRIS' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="inline-block bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                      {qrisQrUrl ? (
                        <img src={qrisQrUrl} alt="QRIS QR" className="w-36 h-36 mx-auto object-contain" />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">Loading QRIS...</div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Scan with GoPay, OVO, Dana, BCA, or any banking app
                    </p>
                  </div>
                )}

                {selectedMethod === 'CASH' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Pay directly when picking up</p>
                    <p>
                      Present cash to staff at the counter during handover. Exact change is appreciated.
                    </p>
                  </div>
                )}

                {selectedMethod === 'BANK_TRANSFER' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Bank Central Asia (BCA)</span>
                      <span className="font-mono font-bold text-slate-900">8273 0192 4810</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Account Name</span>
                      <span className="font-semibold text-slate-900">CleanTrack Laundry Utama</span>
                    </div>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Verifying Transaction...</span>
                  ) : (
                    <>
                      <span>{selectedMethod === 'CASH' ? 'Confirm Pay at Counter' : `Simulate Pay ${formatRupiah(order.totalPrice)}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant payment verification • Zero wait pickup</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
