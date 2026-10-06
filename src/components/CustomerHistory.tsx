import React from 'react';
import { History, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';

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
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4" id="customer-order-history">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900">Order History</h3>
            <span className="text-xs text-slate-500 font-normal block">
              Previous orders linked to this phone number
            </span>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          {historyOrders.length} {historyOrders.length === 1 ? 'Order' : 'Orders'}
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
              className="py-3.5 px-3 flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {ord.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      isDone
                        ? 'bg-slate-100 border-slate-200 text-slate-600'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    } flex items-center gap-1`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3 text-slate-400" /> : <Clock className="w-3 h-3 text-emerald-600" />}
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
                  <span>{ord.createdAt.slice(0, 10)}</span>
                  <span>•</span>
                  <span>{ord.items.length} items</span>
                  <span>•</span>
                  <span>Pickup Code: <strong className="text-slate-800 font-semibold">{ord.pickupCode}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-slate-900 text-sm">
                  {formatRupiah(ord.totalPrice)}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
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
