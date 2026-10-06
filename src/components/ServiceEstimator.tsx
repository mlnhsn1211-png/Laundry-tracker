import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  Send,
  Plus,
  Minus,
  Shirt,
  Layers,
  Zap,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';
import { useLaundry } from '../context/LaundryContext';

interface ServiceOption {
  id: string;
  name: string;
  category: 'kg' | 'set' | 'pcs';
  unitPrice: number;
  turnaroundHours: number;
  turnaroundLabel: string;
  description: string;
  popular?: boolean;
}

const SERVICES: ServiceOption[] = [
  {
    id: 'wash-fold',
    name: 'Regular Wash & Fold',
    category: 'kg',
    unitPrice: 15000,
    turnaroundHours: 24,
    turnaroundLabel: 'Tomorrow, 16:00',
    description: 'Eco-detergent wash, tumble dried, and neatly folded with seal.',
    popular: true,
  },
  {
    id: 'express-rush',
    name: 'Express 4-Hour Rush',
    category: 'kg',
    unitPrice: 25000,
    turnaroundHours: 4,
    turnaroundLabel: 'Today in 4 Hours',
    description: 'Priority queue, separate drum wash, fast steam iron & pack.',
  },
  {
    id: 'bedding-care',
    name: 'Bedcover & Duvet Deep Clean',
    category: 'set',
    unitPrice: 45000,
    turnaroundHours: 48,
    turnaroundLabel: '2 Days, 14:00',
    description: 'Anti-mite sanitization, thermal fluff drying, and sealed bag.',
  },
  {
    id: 'ironing-only',
    name: 'Steam Press & Hanger Only',
    category: 'kg',
    unitPrice: 12000,
    turnaroundHours: 18,
    turnaroundLabel: 'Tomorrow, 11:00',
    description: 'High-pressure steam ironing with anti-crease fragrance treatment.',
  },
  {
    id: 'dry-clean',
    name: 'Suit & Delicate Dry Clean',
    category: 'pcs',
    unitPrice: 40000,
    turnaroundHours: 72,
    turnaroundLabel: '3 Days, 17:00',
    description: 'Special solvent wash for blazers, silk, batik, and formal wear.',
  },
];

const FRAGRANCES = [
  { id: 'ocean', name: 'Ocean Breeze' },
  { id: 'lavender', name: 'Lavender Bliss' },
  { id: 'blossom', name: 'Baby Blossom' },
  { id: 'unscented', name: 'Hypoallergenic (No Perfume)' },
];

interface ServiceEstimatorProps {
  onOrderCreated?: () => void;
}

export const ServiceEstimator: React.FC<ServiceEstimatorProps> = ({ onOrderCreated }) => {
  const { createOrder, selectOrder, triggerMockWhatsAppAlert } = useLaundry();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('wash-fold');
  const [quantity, setQuantity] = useState<number>(4);
  const [fragrance, setFragrance] = useState<string>('ocean');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  const selectedService =
    SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const subtotal = selectedService.unitPrice * quantity;

  const handleIncrement = () => setQuantity((q) => Math.min(30, q + 1));
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleQuickWeight = (val: number) => setQuantity(val);

  const handleCreateDropOff = (e: React.FormEvent) => {
    e.preventDefault();

    const name = customerName.trim() || 'Guest Customer';
    const phone = customerPhone.trim() || '081234567890';

    const newOrder = createOrder({
      customerName: name,
      customerPhone: phone,
      estimatedReadyAt: selectedService.turnaroundLabel,
      items: [
        {
          id: `item-${Date.now()}`,
          serviceName: `${selectedService.name} (${fragrance})`,
          weightOrQty: quantity,
          unit: selectedService.category,
          unitPrice: selectedService.unitPrice,
          subtotal,
        },
      ],
      paymentStatus: 'UNPAID',
      notes: `Fragrance choice: ${fragrance}. Created via instant counter estimator.`,
    });

    selectOrder(newOrder);
    setCreatedOrderNumber(newOrder.orderNumber);

    // Trigger WhatsApp notification for new drop-off ticket
    triggerMockWhatsAppAlert(newOrder, 'STATUS_UPDATE', phone);

    if (onOrderCreated) {
      setTimeout(onOrderCreated, 250);
    }
  };

  const bookingWaText = `Hi CleanTrack! I want to drop off laundry:\n- Service: *${selectedService.name}*\n- Qty/Weight: *${quantity} ${selectedService.category}*\n- Scent: *${fragrance}*\n- Est. Cost: *${formatRupiah(subtotal)}*\nCan I drop it off today?`;
  const bookingWaLink = buildWhatsAppLink('081234567890', bookingWaText);

  return (
    <div
      className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      id="service-estimator-calculator"
    >
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Cost & Time Calculator</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Drop-Off Estimator & Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Choose your service and estimated load to view immediate pricing, expected ready time, or generate an instant drop-off ticket.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Starting from</span>
            <span className="font-mono text-xl font-bold text-emerald-400">Rp15.000/kg</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Service & Load Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Service */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-blue-600" />
              1. Select Laundry Service
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICES.map((s) => {
                const isSelected = s.id === selectedServiceId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {s.popular && (
                      <span className="absolute -top-2 right-3 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.2 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{s.name}</span>
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {formatRupiah(s.unitPrice)}/{s.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{s.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Ready: {s.turnaroundLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Weight / Quantity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                2. Load / Quantity ({selectedService.category})
              </label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {quantity} {selectedService.category}
              </span>
            </div>

            {/* Stepper + Quick Pills */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-auto justify-between">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-xl px-6 text-slate-900">
                  {quantity} <span className="text-xs font-normal text-slate-500">{selectedService.category}</span>
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick weight chips */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {[3, 5, 7, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleQuickWeight(num)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-colors border ${
                      quantity === num
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num} {selectedService.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Fragrance Choice */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              3. Complimentary Fragrance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FRAGRANCES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFragrance(f.name)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                    fragrance === f.name
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary & Quick Order Generator */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Calculation Summary
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600" />
                Live Rate
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Selected Service:</span>
                <span className="font-semibold text-slate-900">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Load / Weight:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {quantity} {selectedService.category} × {formatRupiah(selectedService.unitPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Fragrance Essence:</span>
                <span className="font-medium text-slate-800">{fragrance}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Turnaround Guarantee:</span>
                <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedService.turnaroundLabel}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block">Total Cost</span>
                  <span className="text-[10px] text-slate-400">All taxes & packaging included</span>
                </div>
                <span className="font-mono text-3xl font-extrabold text-blue-700">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Create Drop-Off Ticket Form */}
          <form onSubmit={handleCreateDropOff} className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-800 block">
              Generate Instant Drop-Off Ticket
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Name (e.g. John Doe)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
              <input
                type="tel"
                placeholder="WhatsApp Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              id="btn-create-estimator-ticket"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue Digital Drop-Off Ticket ({formatRupiah(subtotal)})</span>
            </button>

            <a
              href={bookingWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Book via CleanTrack WhatsApp</span>
            </a>

            {createdOrderNumber && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium animate-in fade-in">
                Ticket <strong className="font-mono">{createdOrderNumber}</strong> created! Check your tracking dashboard above.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
