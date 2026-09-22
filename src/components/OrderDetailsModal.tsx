import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt, Clock, MapPin, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';
import { PokeballIcon } from './PokeballIcon';

interface OrderDetailsModalProps {
  order: LaundryOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl poke-box overflow-hidden shadow-2xl print:border-none print:shadow-none print:rounded-none max-h-[90vh] flex flex-col"
          id="order-details-modal"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b-2 border-slate-900 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <PokeballIcon size={18} variant="gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-base text-white">Itemized Receipt 🧾</h3>
                  <span className="font-pixel text-[8px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    20TH
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-xs font-mono font-bold cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Receipt Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-900">
            {/* Store branding top */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
              <div className="flex items-center justify-center gap-2 mb-1">
                <PokeballIcon size={22} variant="gold" />
                <h2 className="font-display text-2xl font-black tracking-tight text-slate-950">CLEANTRACK LAUNDRY</h2>
                <PokeballIcon size={22} variant="gold" />
              </div>
              <p className="text-xs font-bold text-slate-700">{order.branchName}</p>
              <p className="text-[11px] font-mono text-slate-500">{order.branchAddress}</p>
            </div>

            {/* Order meta summary */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#F4F4F9] p-3 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Trainer</span>
                <span className="font-black text-slate-950 text-sm font-sans">{order.customerName}</span>
                <span className="text-slate-600 block text-[11px] mt-0.5">{order.customerPhone}</span>
              </div>
              <div className="bg-[#F4F4F9] p-3 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Order Details</span>
                <span className="font-black text-slate-950 text-sm">{order.orderNumber}</span>
                <span className="text-slate-600 block text-[11px] mt-0.5">Passcode: {order.pickupCode}</span>
              </div>
            </div>

            {/* Items Table matching PRD Section 7.6 */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                Care Services Breakdown
              </h4>
              <div className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[2px_2px_0px_#1e293b]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F4F4F9] border-b-2 border-slate-900 text-slate-800 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Service / Garment</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {item.serviceName}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600 font-mono">
                          {item.weightOrQty} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                          {formatRupiah(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-slate-950">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-amber-300 border-t-2 border-slate-900">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 font-mono font-bold text-slate-950 text-right uppercase text-xs">
                        Total Amount Due
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-950 text-base">
                        {formatRupiah(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes if present */}
            {order.notes && (
              <div className="bg-amber-100 border-2 border-slate-900 rounded-2xl p-3 text-xs shadow-[2px_2px_0px_#1e293b]">
                <span className="font-mono font-black text-slate-950 block mb-0.5">Special Care Notes:</span>
                <span className="text-slate-900 font-medium">{order.notes}</span>
              </div>
            )}

            {/* Status Timeline History */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-950" />
                PokéCenter Care History
              </h4>
              <div className="space-y-2 border-l-2 border-slate-900 ml-2.5 pl-3.5">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="relative text-xs">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-600 border border-slate-900 ring-2 ring-white" />
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">
                        {STATUS_DETAILS[h.status]?.label || h.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{h.timestamp}</span>
                    </div>
                    {h.note && <p className="text-[11px] text-slate-600 mt-0.5">{h.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 border-t-2 border-dashed border-slate-200 text-[11px] font-mono text-slate-500">
              <p>Train On. Clean On. • 100% Full HP Garment Recovery</p>
              <p className="mt-0.5">WhatsApp Bot Support: +62 812-3456-7890</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
