import React from 'react';
import { History, ChevronRight, CheckCircle2, Clock, Award } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';
import { PokeballIcon } from './PokeballIcon';

interface CustomerHistoryProps {
  historyOrders: LaundryOrder[];
  currentOrderId?: string;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({
  historyOrders,
}) => {
  const { selectOrder } = useLaundry();

  if (!historyOrders || historyOrders.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 poke-box space-y-4" id="customer-order-history">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center poke-box-sm">
            <PokeballIcon size={18} variant="gold" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-slate-950">Trainer Care History 📦</h3>
            <span className="font-mono text-xs text-slate-500 font-bold block">
              Previous visits linked to your Trainer ID
            </span>
          </div>
        </div>
        <span className="font-pixel text-[8px] bg-amber-400 text-slate-950 px-2 py-1 rounded border border-slate-900 font-bold">
          20TH LOG
        </span>
      </div>

      <div className="divide-y-2 divide-slate-100">
        {historyOrders.map((ord) => {
          const isDone = ord.status === 'PICKED_UP';
          const meta = STATUS_DETAILS[ord.status] || STATUS_DETAILS.RECEIVED;

          return (
            <div
              key={ord.id}
              onClick={() => selectOrder(ord)}
              className="py-3.5 px-3 flex items-center justify-between rounded-2xl hover:bg-[#F4F4F9] transition-all cursor-pointer group border border-transparent hover:border-slate-900"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-950 text-sm group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                    <PokeballIcon size={14} variant={isDone ? 'gold' : 'great'} />
                    {ord.orderNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isDone
                        ? 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'bg-amber-200 border-amber-500 text-slate-950'
                    } flex items-center gap-1`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3 text-slate-500" /> : <Clock className="w-3 h-3" />}
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{ord.createdAt.slice(0, 10)}</span>
                  <span>•</span>
                  <span>{ord.items.length} items</span>
                  <span>•</span>
                  <span>Passcode: <strong className="text-slate-950 font-bold">{ord.pickupCode}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-slate-950 text-sm">
                  {formatRupiah(ord.totalPrice)}
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
