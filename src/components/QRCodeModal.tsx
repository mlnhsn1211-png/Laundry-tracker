import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Smartphone, QrCode as QrCodeIcon } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah } from '../utils/formatters';

interface QRCodeModalProps {
  order: LaundryOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ order, isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order) return;

    const payload = JSON.stringify({
      orderId: order.id,
      orderNumber: order.orderNumber,
      pickupCode: order.pickupCode,
      qrToken: order.qrToken,
      customerName: order.customerName,
      status: order.status,
      timestamp: Date.now(),
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [order]);

  if (!isOpen || !order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
          id="pickup-qr-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <QrCodeIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Digital Pickup Pass</h3>
                <p className="text-xs text-slate-400">CleanTrack Fast-Track Scanner</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center space-y-4">
            {/* Order info badge */}
            <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="font-bold text-slate-900">{order.orderNumber}</span>
              <span className="text-slate-600 font-sans">{order.customerName}</span>
              <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-60 h-60 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Pickup QR code for ${order.orderNumber}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="animate-pulse text-xs text-slate-400">Generating Pickup Pass...</div>
              )}
            </div>

            {/* 4-Digit Pickup Code */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-0.5">
                Verbal Passcode
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-4xl font-extrabold tracking-widest text-slate-900">
                  {order.pickupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy pickup code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Say this 4-digit code to staff if unable to scan the QR code.
              </p>
            </div>

            {/* Brightness Tip */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Turn up screen brightness for instant scanning</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
