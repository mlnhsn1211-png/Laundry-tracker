import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, Smartphone, QrCode as QrCodeIcon, ShieldCheck } from 'lucide-react';
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

    // QR payload contains standardized digital handover token
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          id="pickup-qr-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-base tracking-tight">Express Pickup Pass</h3>
                <p className="text-xs text-slate-400">Scan at laundry counter</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center space-y-4">
            {/* Order info badge */}
            <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
              <span className="font-mono font-semibold text-slate-700">{order.orderNumber}</span>
              <span className="font-medium text-slate-600">{order.customerName}</span>
              <span className="font-bold text-emerald-700">{formatRupiah(order.totalPrice)}</span>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-inner flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Pickup QR code for ${order.orderNumber}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="animate-pulse text-xs text-slate-400">Generating digital pass...</div>
              )}
            </div>

            {/* Big 4-Digit Pickup Code */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Backup Pickup Code
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-3xl font-extrabold tracking-widest text-emerald-950">
                  {order.pickupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors text-xs flex items-center gap-1"
                  title="Copy pickup code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                You can also verbally read this 4-digit code to the staff!
              </p>
            </div>

            {/* Staff scanning guidance */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Tip: Set phone screen brightness to high for quick counter scan</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
