import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Shirt,
  Flame,
  Zap,
  Bed,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Truck,
  Droplets,
  Tag,
  Footprints,
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export interface LaundryServiceItem {
  id: string;
  name: string;
  category: 'KILOAN' | 'SATUAN' | 'SPECIAL';
  unit: 'kg' | 'pcs' | 'set' | 'pair';
  price: number;
  turnaround: string;
  popular?: boolean;
  highlight?: string;
  description: string;
  features: string[];
  recommendedFor: string;
  icon: typeof Shirt;
}

export const ALL_LAUNDRY_SERVICES: LaundryServiceItem[] = [
  {
    id: 'wash-fold',
    name: 'Eco Wash & Fold (Cuci Lipat)',
    category: 'KILOAN',
    unit: 'kg',
    price: 15000,
    turnaround: '24 Hours',
    popular: true,
    highlight: 'Most Popular for Daily Wear',
    description:
      'Daily laundry washed in dedicated stainless steel drums, dried with soft tumble, and neatly folded with botanical French lavender scent.',
    features: [
      'Separate drum per customer (never mixed)',
      '100% plant-based hypoallergenic detergent',
      'Gentle tumble dry & precision fold',
      'Compostable breathable packaging',
    ],
    recommendedFor: 'T-shirts, shorts, casual linens, gym clothes, daily wear',
    icon: Shirt,
  },
  {
    id: 'wash-iron',
    name: 'Wash & Hand Steam Iron (Cuci Setrika)',
    category: 'KILOAN',
    unit: 'kg',
    price: 22000,
    turnaround: '24 Hours',
    highlight: 'Wrinkle-Free Crisp Finish',
    description:
      'Full wash cycle plus artisan handheld steam pressing at 65°C to restore fabric structure without scorching or flattening buttons.',
    features: [
      'Professional steam smoothing on pressing board',
      'Collar, cuff, and pleat preservation',
      'Choice of lavender or fresh ocean fragrance',
      'Hanger or crisp hotel fold options',
    ],
    recommendedFor: 'Button-down shirts, workwear, cotton trousers, dresses',
    icon: Flame,
  },
  {
    id: 'express-rush',
    name: 'Express 4-Hour Rush Service',
    category: 'KILOAN',
    unit: 'kg',
    price: 28000,
    turnaround: '4 – 6 Hours',
    highlight: 'Same-Day Fast Turnaround',
    description:
      'Priority fast-lane processing. Jump the queue with instant dedicated machine loading and rapid steam drying.',
    features: [
      'Instant intake with priority fast-track drum',
      'High-speed moisture extraction',
      'Real-time WhatsApp milestone tracking',
      'Available for pickup or express delivery',
    ],
    recommendedFor: 'Travelers checking out soon, urgent meetings, surf trips',
    icon: Zap,
  },
  {
    id: 'bedding-care',
    name: 'Bedcover & Duvet Deep Clean',
    category: 'SPECIAL',
    unit: 'set',
    price: 45000,
    turnaround: '48 Hours',
    highlight: 'Anti-Mite Thermal Sanitization',
    description:
      'Intensive deep-wash for thick quilts, duvets, and pillows. Thermal heat eliminates dust mites, humidity odors, and stubborn allergens.',
    features: [
      'Extra-large capacity sanitizing drum',
      'Anti-dust mite thermal treatment',
      'Down feather and microfiber safe drying',
      'Sealed moisture-proof storage bag',
    ],
    recommendedFor: 'King/Queen bedcovers, duvets, wool blankets, mattress toppers',
    icon: Bed,
  },
  {
    id: 'deluxe-dry-clean',
    name: 'Deluxe Delicate & Dry Clean',
    category: 'SATUAN',
    unit: 'pcs',
    price: 40000,
    turnaround: '3 Days',
    highlight: 'Specialized Fiber Care',
    description:
      'Gentle solvent and spot-treatment for high-value garments, silks, tailored blazers, traditional Balinese kebaya, and hand-woven batiks.',
    features: [
      'Zero-shrink solvent wash formulation',
      'Pre-spotting for oil, wine, and food stains',
      'Custom temperature pressing per textile type',
      'Free protective dust hanger cover',
    ],
    recommendedFor: 'Suits, formal blazers, silk dresses, batiks, kebaya, linen jackets',
    icon: Layers,
  },
  {
    id: 'sneaker-shoe-spa',
    name: 'Sneaker & Footwear Deep Spa',
    category: 'SPECIAL',
    unit: 'pair',
    price: 55000,
    turnaround: '2 Days',
    highlight: 'Hand-Detailed Restoration',
    description:
      'Complete exterior, sole, and lace decontamination using specialized foam brushes and UV antibacterial deodorization.',
    features: [
      'Gentle sole de-yellowing & mud extraction',
      'Upper canvas / leather conditioning',
      'UV-C bacterial sanitization & deodorizing',
      'Repellent hydrophobic spray finish',
    ],
    recommendedFor: 'Canvas sneakers, running shoes, leather loafers, sandals',
    icon: Footprints,
  },
];

interface ServicesPricingSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
  onOpenEstimator: () => void;
}

export const ServicesPricingSection: React.FC<ServicesPricingSectionProps> = ({
  onSelectServiceForBooking,
  onOpenEstimator,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'KILOAN' | 'SATUAN' | 'SPECIAL'>('ALL');

  const filteredServices = selectedFilter === 'ALL'
    ? ALL_LAUNDRY_SERVICES
    : ALL_LAUNDRY_SERVICES.filter((s) => s.category === selectedFilter);

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="services-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Tag className="w-4 h-4" />
            <span className="uppercase tracking-wider font-mono">Transparent Bali Pricing</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">No Hidden Fees</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Our Laundry Services & Rates
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            From daily kiloan wash to express rush and villa linens, all processed with dedicated drums and natural eco-friendly detergents at our Munggu studio.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-end">
          {[
            { id: 'ALL', label: 'All Services' },
            { id: 'KILOAN', label: 'By Weight (Kiloan)' },
            { id: 'SATUAN', label: 'By Piece (Satuan)' },
            { id: 'SPECIAL', label: 'Bedding & Footwear' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-shadow relative ${
                service.popular
                  ? 'border-blue-600/40 ring-1 ring-blue-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Header Icon + Price */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold text-slate-900">
                      {formatRupiah(service.price)}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">per {service.unit}</span>
                  </div>
                </div>

                {/* Title & Badge */}
                <div className="mb-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>Ready in {service.turnaround}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="space-y-2 pt-3 border-t border-slate-100 mb-4">
                  <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Service Includes:
                  </div>
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 mb-4 border border-slate-100">
                  <span className="font-semibold text-slate-700">Best for: </span>
                  {service.recommendedFor}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectServiceForBooking(service.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Book Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenEstimator}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                  title="Estimate price in drop-off calculator"
                >
                  Estimate
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Villa & Hospitality Partner Banner */}
      <div className="mt-10 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-semibold mb-1">
              <span>B2B Villa & Homestay Program</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Badung, Bali</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Villa Linen & Hospitality Laundry Partnership
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Are you managing a private villa, guesthouse, or Airbnb in Munggu, Seseh, or Pererenan? We offer scheduled daily linen pickups, hotel-grade folding, invoiced billing, and volume rates.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/6281234567890?text=Halo%20CleanTrack%2C%20saya%20ingin%20tanya%20paket%20laundry%20kerjasama%20villa%20di%20Munggu%20Bali"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20"
        >
          <span>Chat Villa Partner WA</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
