import React, { useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, QrCode as QrCodeIcon, Banknote, Building2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { LaundryOrder, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';
import { PokeballIcon } from './PokeballIcon';

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

  const pokeCoins = Math.round(order.totalPrice / 100);

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
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl poke-box overflow-hidden shadow-2xl"
          id="payment-modal"
        >
          {/* Header */}
          <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                <PokeballIcon size={12} variant="gold" />
                <span>POKÉWASH BILL SETTLEMENT ⚡</span>
              </div>
              <h3 className="font-display font-black text-lg">Settle Laundry Bill</h3>
              <p className="text-xs font-mono text-red-100">{order.orderNumber} • Trainer {order.customerName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-red-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-amber-300 border-2 border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-[2px_2px_0px_#1e293b]">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-wider">Total Amount Due</p>
                <p className="font-mono text-3xl font-black text-slate-950">{formatRupiah(order.totalPrice)}</p>
                <p className="text-[11px] font-mono font-bold text-amber-900">≈ {pokeCoins} PokéCoins</p>
              </div>
              <div className="px-3 py-1 bg-slate-950 text-amber-300 rounded-full font-mono text-[10px] font-bold">
                {order.items.length} items
              </div>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 poke-box mx-auto flex items-center justify-center animate-bounce text-2xl">
                  <PokeballIcon size={36} variant="gold" />
                </div>
                <h4 className="font-display font-black text-2xl text-slate-950">Payment Settled!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto font-medium">
                  {formatRupiah(order.totalPrice)} confirmed. Your Trainer Pickup Pass is 100% active for instant handover.
                </p>
              </div>
            ) : (
              <>
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('QRIS')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'QRIS'
                          ? 'border-slate-900 bg-amber-300 text-slate-950 font-black shadow-[2px_2px_0px_#1e293b]'
                          : 'border-slate-200 hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <QrCodeIcon className="w-5 h-5 text-slate-950" />
                      <span className="text-xs font-mono font-bold">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('CASH')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'CASH'
                          ? 'border-slate-900 bg-amber-300 text-slate-950 font-black shadow-[2px_2px_0px_#1e293b]'
                          : 'border-slate-200 hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-slate-950" />
                      <span className="text-xs font-mono font-bold">Cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('BANK_TRANSFER')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedMethod === 'BANK_TRANSFER'
                          ? 'border-slate-900 bg-amber-300 text-slate-950 font-black shadow-[2px_2px_0px_#1e293b]'
                          : 'border-slate-200 hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-slate-950" />
                      <span className="text-xs font-mono font-bold">Bank VA</span>
                    </button>
                  </div>
                </div>

                {/* Method Specific Display */}
                {selectedMethod === 'QRIS' && (
                  <div className="p-4 bg-[#F4F4F9] rounded-2xl border-2 border-slate-900 text-center space-y-2">
                    <div className="inline-block bg-white p-2 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                      {qrisQrUrl ? (
                        <img src={qrisQrUrl} alt="QRIS QR" className="w-36 h-36 mx-auto object-contain" />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-xs font-mono text-slate-400">Loading QRIS...</div>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-700 font-bold">
                      Scan with any banking or e-wallet app (BCA, GoPay, OVO, Dana) 📱
                    </p>
                  </div>
                )}

                {selectedMethod === 'CASH' && (
                  <div className="p-4 bg-[#F4F4F9] rounded-2xl border-2 border-slate-900 space-y-2 text-xs text-slate-800 font-medium">
                    <p className="font-bold text-slate-950">Pay at the PokéCenter Counter</p>
                    <p>
                      Present cash or PokéCoins to staff during clothes handover.
                    </p>
                  </div>
                )}

                {selectedMethod === 'BANK_TRANSFER' && (
                  <div className="p-4 bg-[#F4F4F9] rounded-2xl border-2 border-slate-900 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-300">
                      <span className="text-slate-500">Bank Central Asia (BCA)</span>
                      <span className="font-bold text-slate-900">8273 0192 4810</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Account Name</span>
                      <span className="font-bold text-slate-900">PokéWash Center Utama</span>
                    </div>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-4 px-4 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-300 text-slate-950 font-display font-black rounded-2xl text-sm uppercase tracking-wider transition-all poke-box poke-box-hover flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="font-mono flex items-center gap-2">
                      <PokeballIcon size={16} className="animate-spin" />
                      SETTLING BILL... ⚡
                    </span>
                  ) : (
                    <>
                      <span>{selectedMethod === 'CASH' ? 'Confirm Counter Payment' : `Simulate Pay ${formatRupiah(order.totalPrice)}`}</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant payment verification • Zero wait handover</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
