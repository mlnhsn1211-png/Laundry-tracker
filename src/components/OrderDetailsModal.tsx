import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt, Clock, Printer, FileText, Sparkles, MessageSquare, Send } from 'lucide-react';
import { LaundryOrder } from '../types';
import { formatRupiah, STATUS_DETAILS, buildWhatsAppMessage, buildWhatsAppLink } from '../utils/formatters';

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

  const receiptMsg = buildWhatsAppMessage(
    {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      pickupCode: order.pickupCode,
      paymentStatus: order.paymentStatus,
      status: order.status,
      branchName: order.branchName,
      branchAddress: order.branchAddress,
      estimatedReadyAt: order.estimatedReadyAt,
    },
    'PICKED_UP'
  );

  const receiptWaLink = buildWhatsAppLink(order.customerPhone, receiptMsg);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl print:border-none print:shadow-none print:rounded-none max-h-[90vh] flex flex-col"
          id="order-details-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Itemized Receipt</h3>
                <p className="text-xs font-mono text-slate-400">{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={receiptWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Send receipt to WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <button
                onClick={handlePrint}
                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Receipt Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-900">
            {/* Store branding top */}
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">CLEANTRACK LAUNDRY</h2>
              </div>
              <p className="text-xs font-medium text-slate-700">{order.branchName}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{order.branchAddress}</p>
            </div>

            {/* Order meta summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Customer</span>
                <span className="font-bold text-slate-900 text-sm">{order.customerName}</span>
                <span className="text-slate-500 block text-xs mt-0.5 font-mono">{order.customerPhone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Order Details</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{order.orderNumber}</span>
                <span className="text-slate-500 block text-xs mt-0.5 font-mono">Pickup Code: {order.pickupCode}</span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Service & Weight Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Service / Item</th>
                      <th className="py-2.5 px-2 text-center">Qty/Weight</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {item.serviceName}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-500 font-mono">
                          {item.weightOrQty} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500 font-mono">
                          {formatRupiah(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 font-semibold text-slate-900 text-right uppercase text-xs">
                        Total Amount Due
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatRupiah(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes if present */}
            {order.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                <span className="font-semibold text-amber-900 block mb-0.5">Special Care Notes:</span>
                <span className="text-amber-800">{order.notes}</span>
              </div>
            )}

            {/* Status Timeline History */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Status History Log
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 ml-2.5 pl-3.5">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="relative text-xs">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-slate-200" />
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

            {/* Footer */}
            <div className="text-center pt-3 border-t border-dashed border-slate-200 text-xs text-slate-400">
              <p>Thank you for using CleanTrack Laundry Services.</p>
              <p className="mt-0.5 text-[11px]">Customer Support: +62 812-3456-7890</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
