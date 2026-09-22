import React, { useState } from 'react';
import { Search, Phone, Hash, ArrowRight, AlertCircle, Sparkles, Flame, Zap } from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { PokeballIcon } from './PokeballIcon';

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
        setErrorMessage(res.error || "Trainer record not found. Please verify your Order ID and phone number.");
      }
    }, 300);
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
    <div className={`w-full ${compact ? '' : 'bg-white rounded-3xl p-6 sm:p-8 poke-box shadow-slate-900/10 relative overflow-hidden'}`}>
      {/* Decorative Pokemon 20th Anniversary Corner Pokeball */}
      <div className="absolute -top-8 -right-8 opacity-15 pointer-events-none">
        <PokeballIcon size={120} variant="gold" />
      </div>

      {!compact && (
        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold tracking-widest uppercase mb-3">
            <PokeballIcon size={12} variant="standard" />
            <span>POKÉWASH TERMINAL • NO PASSWORDS</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Track Trainer Order 🔴⚪
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Enter your Order ID & phone number to inspect your laundry care progress and digital Trainer Pass.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10" id="track-order-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Order ID Input */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-red-600" />
              Order ID / Ticket #
            </label>
            <input
              type="text"
              placeholder="e.g. #LDR-10293"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#F4F4F9] border-2 border-slate-900 rounded-2xl text-sm font-mono font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-[2px_2px_0px_#1e293b]"
              id="input-order-id"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              Trainer Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 081234567890"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#F4F4F9] border-2 border-slate-900 rounded-2xl text-sm font-mono font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-[2px_2px_0px_#1e293b]"
              id="input-customer-phone"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-slate-900 text-slate-950 text-xs flex items-start gap-2 shadow-[2px_2px_0px_#1e293b]">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700 mt-0.5" />
            <div className="flex-1 font-medium">
              <p className="font-bold">{errorMessage}</p>
              <p className="text-[11px] text-slate-700 mt-0.5">
                Tap one of the demo Trainer chips below to test instantly!
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-300 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition-all poke-box poke-box-hover flex items-center justify-center gap-2 group cursor-pointer"
          id="btn-track-order-submit"
        >
          {isLoading ? (
            <span className="font-mono flex items-center gap-2">
              <PokeballIcon size={16} className="animate-spin" />
              HEALING IN PROGRESS...
            </span>
          ) : (
            <>
              <PokeballIcon size={18} variant="standard" />
              <span>Track My Laundry Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Demo Trainer orders quick picker */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 relative z-10">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-2 font-mono font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Tap to test demo Trainer states:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10293', '081234567890')}
            className="text-xs py-1.5 px-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-950 poke-box-sm poke-box-hover font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PokeballIcon size={12} variant="gold" />
            <span>#LDR-10293</span>
            <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
              Full HP ✨
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10402', '085712341234')}
            className="text-xs py-1.5 px-3 rounded-xl bg-blue-200 hover:bg-blue-300 text-slate-950 poke-box-sm poke-box-hover font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PokeballIcon size={12} variant="great" />
            <span>#LDR-10402</span>
            <span className="text-[9px] bg-slate-950 text-blue-300 px-1.5 py-0.2 rounded font-bold uppercase">
              Unpaid 💳
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10314', '082198765432')}
            className="text-xs py-1.5 px-3 rounded-xl bg-cyan-200 hover:bg-cyan-300 text-slate-950 poke-box-sm poke-box-hover font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PokeballIcon size={12} variant="standard" />
            <span>#LDR-10314</span>
            <span className="text-[9px] bg-slate-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold uppercase">
              Washing 🌊
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('#LDR-10520', '087812345678')}
            className="text-xs py-1.5 px-3 rounded-xl bg-red-200 hover:bg-red-300 text-slate-950 poke-box-sm poke-box-hover font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PokeballIcon size={12} variant="ultra" />
            <span>#LDR-10520</span>
            <span className="text-[9px] bg-slate-950 text-red-300 px-1.5 py-0.2 rounded font-bold uppercase">
              Delayed ⏱️
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
