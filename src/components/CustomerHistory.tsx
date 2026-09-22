import React from 'react';
import { History, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';

interface CustomerHistoryProps {
  historyOrders: LaundryOrder[];
  currentOrderId?: string;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({
  historyOrders,
  currentOrderId,
}) => {
  const { selectOrder } = useLaundry();

  if (!historyOrders || historyOrders.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4" id="customer-order-history">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Your Order History</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Linked to your phone number
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {historyOrders.map((ord) => {
          const isDone = ord.status === 'PICKED_UP';
          const meta = STATUS_DETAILS[ord.status] || STATUS_DETAILS.RECEIVED;

          return (
            <div
              key={ord.id}
              onClick={() => selectOrder(ord)}
              className="py-3.5 px-2 flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {ord.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.borderClass} flex items-center gap-1`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3 text-slate-500" /> : <Clock className="w-3 h-3" />}
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{ord.createdAt.slice(0, 10)}</span>
                  <span>•</span>
                  <span>{ord.items.length} items</span>
                  <span>•</span>
                  <span>Pickup Code: <strong className="font-mono text-slate-700">{ord.pickupCode}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-sm">
                  {formatRupiah(ord.totalPrice)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
