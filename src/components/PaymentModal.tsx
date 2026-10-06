import React, { useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, QrCode as QrCodeIcon, Banknote, Building2, ShieldCheck, ArrowRight, CreditCard } from 'lucide-react';
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
    const qrisPayload = `00020101021226610014ID.GO.QRIS.WWW01189360091100293847250215000000000000520458125303360540${order.totalPrice}5802ID5918CLEANTRACK LAUNDRY6007JAKARTA62070703A01630489AB`;
    QRCode.toDataURL(qrisPayload, {
      width: 240,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
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
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
          id="payment-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-0.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Fast Bill Settlement</span>
              </div>
              <h3 className="font-display font-bold text-lg">Pay Laundry Order</h3>
              <p className="text-xs text-slate-400 font-mono">{order.orderNumber} • {order.customerName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Amount Due</p>
                <p className="font-mono text-3xl font-extrabold text-slate-900">{formatRupiah(order.totalPrice)}</p>
              </div>
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-mono text-xs font-semibold">
                {order.items.length} items
              </div>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {formatRupiah(order.totalPrice)} confirmed. Your digital pickup pass is verified for instant counter handover.
                </p>
              </div>
            ) : (
              <>
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('QRIS')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'QRIS'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <QrCodeIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-semibold">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('CASH')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'CASH'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-slate-600" />
                      <span className="text-xs font-semibold">Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('BANK_TRANSFER')}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'BANK_TRANSFER'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-slate-600" />
                      <span className="text-xs font-semibold">Bank VA</span>
                    </button>
                  </div>
                </div>

                {/* Method Specific Display */}
                {selectedMethod === 'QRIS' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                    <div className="inline-block bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                      {qrisQrUrl ? (
                        <img src={qrisQrUrl} alt="QRIS QR" className="w-36 h-36 mx-auto object-contain" />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">Loading QRIS...</div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Scan with any banking or e-wallet app (BCA, Mandiri, GoPay, OVO, Dana)
                    </p>
                  </div>
                )}

                {selectedMethod === 'CASH' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Pay at the Counter</p>
                    <p>
                      Present cash to staff during clothes collection. Staff will confirm payment instantly on the counter terminal.
                    </p>
                  </div>
                )}

                {selectedMethod === 'BANK_TRANSFER' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-sans">Bank Central Asia (BCA)</span>
                      <span className="font-bold text-slate-900">8273 0192 4810</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-sans">Account Name</span>
                      <span className="font-bold text-slate-900">CleanTrack Laundry Indonesia</span>
                    </div>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <>
                      <span>{selectedMethod === 'CASH' ? 'Confirm Counter Cash Payment' : `Simulate Pay ${formatRupiah(order.totalPrice)}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant payment verification • Zero wait handover</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
