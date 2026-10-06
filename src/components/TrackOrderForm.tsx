import React, { useState } from 'react';
import { Search, Phone, Hash, ArrowRight, AlertCircle, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

interface TrackOrderFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const TrackOrderForm: React.FC<TrackOrderFormProps> = ({ onSuccess, compact = false }) => {
  const { trackOrder, orders, selectOrder } = useLaundry();

  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = trackOrder(orderQuery, phoneQuery);
      setIsLoading(false);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || "Order not found. Please verify your Order ID and registered phone number.");
      }
    }, 250);
  };

  const handleQuickFill = (orderNum: string, phone: string) => {
    setOrderQuery(orderNum);
    setPhoneQuery(phone);
    setErrorMessage(null);
    const target = orders.find((o) => o.orderNumber === orderNum);
    if (target) {
      selectOrder(target);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div
      className={`w-full ${
        compact
          ? ''
          : 'bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden'
      }`}
    >
      {!compact && (
        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Instant Order Lookup</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Track Laundry Order
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Enter your order number and phone number to view live wash stage and your zero-wait pickup pass.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10" id="track-order-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Order ID Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-600" />
              Order ID / Ticket #
            </label>
            <input
              type="text"
              placeholder="e.g. #LDR-10293"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl text-sm font-mono font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              id="input-order-id"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 081234567890"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl text-sm font-mono font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              id="input-customer-phone"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-[11px] text-red-700 mt-0.5">
                Tip: Tap one of the sample test orders below to preview instantly.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
          id="btn-track-order-submit"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching Order...
            </span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track My Order Now</span>
              <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Demo orders quick picker */}
      <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Click to preview sample order states:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10293', '081234567890')}
            className="text-xs py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>#LDR-10293</span>
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
              Ready
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10402', '085712341234')}
            className="text-xs py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>#LDR-10402</span>
            <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
              Unpaid
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10314', '082198765432')}
            className="text-xs py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>#LDR-10314</span>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
              Washing
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10520', '087812345678')}
            className="text-xs py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>#LDR-10520</span>
            <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
              Delayed
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
