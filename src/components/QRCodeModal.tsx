import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Smartphone, Zap } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah } from '../utils/formatters';
import { PokeballIcon } from './PokeballIcon';

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
      theme: 'pokemon-20th-anniversary',
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-3xl poke-box overflow-hidden shadow-2xl"
          id="pickup-qr-modal"
        >
          {/* Header */}
          <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <PokeballIcon size={18} variant="gold" />
              </div>
              <div>
                <h3 className="font-display font-black text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Trainer Pickup Pass</span>
                  <span className="font-pixel text-[8px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded">20TH</span>
                </h3>
                <p className="text-[11px] font-mono text-red-100">CleanTrack Counter Scanner</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-red-100 hover:text-white hover:bg-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center space-y-4">
            {/* Order info badge */}
            <div className="flex items-center justify-between bg-[#F4F4F9] px-3.5 py-2 rounded-2xl border-2 border-slate-900 text-xs font-mono font-bold shadow-[2px_2px_0px_#1e293b]">
              <span className="text-slate-900">{order.orderNumber}</span>
              <span className="text-slate-600">{order.customerName}</span>
              <span className="text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b] flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Pickup QR code for ${order.orderNumber}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="animate-pulse text-xs font-mono text-slate-400">Generating Trainer Pass...</div>
              )}
            </div>

            {/* 4-Digit Pickup Code */}
            <div className="bg-amber-300 border-2 border-slate-900 rounded-2xl p-3.5 shadow-[2px_2px_0px_#1e293b]">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-950 mb-0.5 flex items-center justify-center gap-1.5">
                <PokeballIcon size={12} variant="gold" />
                COUNTER VERBAL PASSCODE
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-4xl font-black tracking-widest text-slate-950">
                  {order.pickupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-slate-950 text-amber-300 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy pickup code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-800 font-medium mt-1">
                Say this 4-digit code to staff at the counter!
              </p>
            </div>

            {/* Brightness Tip */}
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 py-2 px-3 rounded-xl border border-slate-200">
              <Smartphone className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Turn up screen brightness for instant scan ⚡</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-amber-300 font-display font-black rounded-2xl text-sm uppercase tracking-wider transition-colors poke-box-hover cursor-pointer"
            >
              Done Scanning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
