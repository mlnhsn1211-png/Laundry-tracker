import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Search,
  PlusCircle,
  Sparkles,
  UserCheck,
  Package,
  Layers,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryOrder, OrderStatus, OrderItem } from '../types';
import { formatRupiah, STATUS_DETAILS } from '../utils/formatters';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({ isOpen, onClose }) => {
  const {
    orders,
    verifyPickup,
    confirmHandover,
    updateOrderStatus,
    markOrderAsPaid,
    createOrder,
    selectOrder,
  } = useLaundry();

  const [activeTab, setActiveTab] = useState<'VERIFY' | 'ORDERS' | 'NEW_ORDER'>('VERIFY');

  // Verify Tab State
  const [codeInput, setCodeInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    order?: LaundryOrder;
    error?: string;
  } | null>(null);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [staffName, setStaffName] = useState('Staff Counter Arya');

  // Orders Search State
  const [searchFilter, setSearchFilter] = useState('');

  // New Order State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newWeight, setNewWeight] = useState('3');
  const [newService, setNewService] = useState('Regular Wash & Fold');
  const [newPricePerKg, setNewPricePerKg] = useState('15000');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleVerify = (queryToTest?: string) => {
    const q = queryToTest !== undefined ? queryToTest : codeInput;
    const res = verifyPickup(q);
    setVerifyResult(res);
    setHandoverSuccess(false);
  };

  const handleConfirmHandover = (orderId: string) => {
    const res = confirmHandover(orderId, staffName);
    if (res.success) {
      setHandoverSuccess(true);
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        // refresh verification status
        const updated = orders.find((o) => o.id === orderId);
        if (updated) {
          selectOrder(updated);
        }
      }, 500);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight) || 1;
    const price = parseInt(newPricePerKg) || 15000;
    const items: OrderItem[] = [
      {
        id: `item-${Date.now()}`,
        serviceName: newService,
        weightOrQty: w,
        unit: 'kg',
        unitPrice: price,
        subtotal: w * price,
      },
    ];

    const created = createOrder({
      customerName: newCustName || 'Counter Customer',
      customerPhone: newCustPhone || '081234567890',
      items,
      notes: newNotes,
    });

    selectOrder(created);
    setActiveTab('ORDERS');
    setSearchFilter(created.orderNumber);
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchFilter.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      o.pickupCode.includes(term)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col"
          id="staff-portal-modal"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">Laundry Staff Counter Station</h3>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono font-bold">
                    INTERNAL PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-400">Scan pickup QR, verify 4-digit code & complete handovers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 pt-3 pb-1 bg-slate-100 border-b border-slate-200 shrink-0 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('VERIFY')}
              className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'VERIFY'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Verify & Handover</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ORDERS')}
              className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'ORDERS'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('NEW_ORDER')}
              className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'NEW_ORDER'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Drop-Off</span>
            </button>
          </div>

          {/* Modal Tab Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* TAB 1: VERIFY & HANDOVER (PRD Section 7.4 & 12) */}
            {activeTab === 'VERIFY' && (
              <div className="space-y-6">
                {/* Search / Scan Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Scan Customer Pickup QR or Enter 4-Digit Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 4821 or #LDR-10293 or paste QR token"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerify()}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow flex items-center gap-1.5"
                    >
                      <ScanLine className="w-4 h-4" />
                      <span>Verify</span>
                    </button>
                  </div>

                  {/* Quick test buttons for staff */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-400 font-medium">Quick Test:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeInput('4821');
                        handleVerify('4821');
                      }}
                      className="px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-mono font-bold transition-colors"
                    >
                      Code 4821 (Maulan - Ready & Paid)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeInput('7194');
                        handleVerify('7194');
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono font-bold transition-colors"
                    >
                      Code 7194 (Budi - Ready & Unpaid)
                    </button>
                  </div>
                </div>

                {/* Verification Result Card (PRD Section 7.4) */}
                {verifyResult && (
                  <div className="space-y-4">
                    {verifyResult.valid && verifyResult.order ? (
                      /* Exact display matching PRD Section 7.4:
                         ✓ ORDER VERIFIED
                         Order #LDR-10293
                         Customer: Maulan
                         Status: Ready for Pickup
                         Payment: Paid
                         [ CONFIRM HANDOVER ]
                      */
                      <div className="bg-emerald-50/90 border-2 border-emerald-500 rounded-3xl p-6 text-slate-900 space-y-5 shadow-lg shadow-emerald-500/10">
                        <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-base font-black uppercase tracking-wider text-emerald-900">
                              ✓ ORDER VERIFIED
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs bg-emerald-200/80 text-emerald-950 px-2.5 py-1 rounded-lg">
                            Pickup Code: {verifyResult.order.pickupCode}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                          <div>
                            <span className="text-slate-500 text-xs block">Order Reference:</span>
                            <span className="font-mono font-bold text-slate-900 text-base">
                              {verifyResult.order.orderNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Customer:</span>
                            <span className="font-bold text-slate-900 text-base">
                              {verifyResult.order.customerName}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Status:</span>
                            <span className="font-bold text-emerald-700">
                              {STATUS_DETAILS[verifyResult.order.status]?.label || verifyResult.order.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs block">Payment:</span>
                            <span className={`font-black ${verifyResult.order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {verifyResult.order.paymentStatus} ({formatRupiah(verifyResult.order.totalPrice)})
                            </span>
                          </div>
                        </div>

                        {/* Unpaid Warning if required by Rule 2 */}
                        {verifyResult.order.paymentStatus !== 'PAID' && (
                          <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>Collect <strong>{formatRupiah(verifyResult.order.totalPrice)}</strong> cash/QRIS before handover.</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                markOrderAsPaid(verifyResult.order!.id, 'CASH');
                                handleVerify();
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px]"
                            >
                              Mark as Paid
                            </button>
                          </div>
                        )}

                        {handoverSuccess ? (
                          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center space-y-1">
                            <p className="font-black text-sm uppercase tracking-wider">Handover Complete!</p>
                            <p className="text-xs text-emerald-100">
                              Order is now marked as PICKED UP. Garments released to customer.
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConfirmHandover(verifyResult.order!.id)}
                            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            id="btn-confirm-handover"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>[ CONFIRM HANDOVER ]</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Error display */
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <p className="font-bold">{verifyResult.error}</p>
                          {verifyResult.order && (
                            <p className="mt-0.5 text-rose-700">
                              Order {verifyResult.order.orderNumber} ({verifyResult.order.customerName}) is currently {verifyResult.order.status}.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ALL ORDERS & STATUS UPDATES (PRD Section 17) */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by order #, phone, customer name, pickup code..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  {filteredOrders.map((ord) => {
                    const isReady = ord.status === 'READY';
                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              • {ord.customerName}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({ord.customerPhone})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Code: {ord.pickupCode}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {formatRupiah(ord.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Status Changer */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-400 font-bold uppercase text-[10px]">
                            Update Status:
                          </span>
                          {(['RECEIVED', 'WASHING', 'DRYING', 'IRONING', 'READY', 'PICKED_UP'] as OrderStatus[]).map(
                            (st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(ord.id, st);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                  ord.status === st
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: NEW ORDER INTAKE */}
            {activeTab === 'NEW_ORDER' && (
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Raditya Dika"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Customer Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 081299887766"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Service</label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Regular Wash & Fold">Regular Wash & Fold (Rp15.000/kg)</option>
                      <option value="Express 6-Hour Wash & Iron">Express 6-Hour Wash & Iron (Rp25.000/kg)</option>
                      <option value="Bedcover / Blanket Care">Bedcover / Blanket Care (Rp35.000/set)</option>
                      <option value="Suits & Formal Wear Dry Clean">Suits & Formal Wear (Rp50.000/pcs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Weight (Kg) / Qty</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Special Laundry Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Separate color clothes, delicate silk buttons"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow"
                >
                  Create & Print Drop-Off Ticket
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
