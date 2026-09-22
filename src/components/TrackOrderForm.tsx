import React, { useState } from 'react';
import { Search, Phone, Hash, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
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
        setErrorMessage(res.error || "We couldn't find your order. Please check your Order ID and phone number.");
      }
    }, 350);
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
    <div className={`w-full ${compact ? '' : 'bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50'}`}>
      {!compact && (
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
            No Account or Password Needed
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Track Your Laundry Order
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your Order ID and Phone Number to check real-time status and access fast pickup code.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id="track-order-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Order ID Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Order ID / Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. #LDR-10293 or 10293"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                id="input-order-id"
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. 081234567890"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                id="input-customer-phone"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Tip: Try one of the demo order shortcuts below to test instant order tracking.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          id="btn-track-order-submit"
        >
          {isLoading ? (
            <span>Locating Laundry Record...</span>
          ) : (
            <>
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Track Order</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </>
          )}
        </button>
      </form>

      {/* Demo sample orders quick picker */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">Quick Demo Orders (1-Click Test):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10293', '081234567890')}
            className="text-xs py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold transition-colors flex items-center gap-1"
          >
            <span>#LDR-10293</span>
            <span className="text-[10px] bg-emerald-200/80 px-1 rounded text-emerald-950">Ready & Paid</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10402', '085712341234')}
            className="text-xs py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition-colors flex items-center gap-1"
          >
            <span>#LDR-10402</span>
            <span className="text-[10px] bg-amber-200/80 px-1 rounded text-amber-950">Ready & Unpaid</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10314', '082198765432')}
            className="text-xs py-1.5 px-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-semibold transition-colors flex items-center gap-1"
          >
            <span>#LDR-10314</span>
            <span className="text-[10px] bg-cyan-200/80 px-1 rounded text-cyan-950">In Washing</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10520', '087812345678')}
            className="text-xs py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-semibold transition-colors flex items-center gap-1"
          >
            <span>#LDR-10520</span>
            <span className="text-[10px] bg-rose-200/80 px-1 rounded text-rose-950">Delayed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
