import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt, Clock, MapPin, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none max-h-[90vh] flex flex-col"
          id="order-details-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-base">Digital Laundry Receipt</h3>
                <p className="text-xs text-slate-400">Order {order.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Receipt Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
            {/* Store branding top */}
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <h2 className="text-xl font-black tracking-tight text-slate-900">CLEANTRACK LAUNDRY</h2>
              <p className="text-xs text-slate-500 mt-0.5">{order.branchName}</p>
              <p className="text-[11px] text-slate-400">{order.branchAddress}</p>
            </div>

            {/* Order meta summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Name</span>
                <span className="font-semibold text-slate-900 text-sm">{order.customerName}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">{order.customerPhone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">Date: {order.createdAt}</span>
              </div>
            </div>

            {/* Items Table matching PRD Section 7.6 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Service Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Service Item</th>
                      <th className="py-2.5 px-2 text-center">Qty/Weight</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {item.serviceName}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600">
                          {item.weightOrQty} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {formatRupiah(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/70 border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 font-bold text-slate-700 text-right uppercase text-[11px]">
                        Total Amount
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-950 text-sm">
                        {formatRupiah(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes if present */}
            {order.notes && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">Special Care Notes:</span>
                <span className="text-amber-800">{order.notes}</span>
              </div>
            )}

            {/* Status Timeline History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Status History
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-3">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="relative text-xs">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-slate-900">
                        {STATUS_DETAILS[h.status]?.label || h.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{h.timestamp}</span>
                    </div>
                    {h.note && <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with pickup instructions */}
            <div className="text-center pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              <p>Thank you for trusting CleanTrack Laundry with your garments.</p>
              <p className="mt-0.5">Customer Support: +62 812-3456-7890 (WhatsApp)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
