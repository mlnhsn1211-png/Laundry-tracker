import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Maximize2,
  X,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  Wind,
  Flame,
  Truck,
  ArrowRight,
  Layers,
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  description: string;
  highlights: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'studio-boutique',
    title: 'Modern Care Studio & Commercial Washers',
    subtitle: 'Hospital-grade sanitization drum architecture with zero chemical residue',
    category: 'Facility & Equipment',
    imageUrl: '/src/assets/images/laundry_hero_service_1791269640387.jpg',
    description:
      'Our boutique facility features state-of-the-art front-loading stainless steel wash units calibrated for delicate cotton, athletic wear, and sensitive fabrics.',
    highlights: ['Multi-stage filtration', 'Micro-bubble bubble-soak', 'Stainless steel antimicrobial drums'],
  },
  {
    id: 'folded-linens',
    title: 'Crisp Steam Press & Lavender Fold',
    subtitle: 'Hotel-crisp precision fold with natural herbal lavender calming scent',
    category: 'Finishing & Packaging',
    imageUrl: '/src/assets/images/folded_linen_clothes_1791269653955.jpg',
    description:
      'Every shirt, towel, and linen is hand-inspected, steam-treated to eliminate wrinkles, and neatly stacked ready for your wardrobe.',
    highlights: ['Wrinkle-free guarantee', 'Zero fiber compression', 'Breathable eco-friendly bags'],
  },
  {
    id: 'steam-press',
    title: 'High-Velocity Steam Craftsmanship',
    subtitle: 'Deep thermal smoothing at 65°C restoring textile softness',
    category: 'Artisan Pressing',
    imageUrl: '/src/assets/images/steam_ironing_press_1791269666554.jpg',
    description:
      'Gentle steam penetrates thick seams without scorching or flattening fibers, ensuring suits, silks, and formal wear keep their tailored silhouette.',
    highlights: ['Fabric-specific temperature controls', 'Collar & cuff structural shaping', 'Gentle on silk & wool'],
  },
  {
    id: 'eco-detergents',
    title: 'Plant-Based Botanical Care Formulations',
    subtitle: 'Biodegradable detergents and natural essential oil fabric conditioning',
    category: 'Eco Ingredients',
    imageUrl: '/src/assets/images/eco_detergent_care_1791269679733.jpg',
    description:
      'We formulate with zero parabens, zero harsh dyes, and zero chlorine bleach. Safe for newborn skin, sensitive dermatological profiles, and the environment.',
    highlights: ['Hypoallergenic certified', '100% biodegradable active agents', 'Natural essential oil scents'],
  },
  {
    id: 'delivery-fleet',
    title: 'Doorstep Courier & Scheduled Pickup Van',
    subtitle: 'Electric courier delivery right to your apartment lobby or home',
    category: 'Logistics & Convenience',
    imageUrl: '/src/assets/images/courier_delivery_van_1791269693956.jpg',
    description:
      'Our prompt couriers arrive on time with temperature-controlled hampers and hanging garment protection, updating you on WhatsApp at every step.',
    highlights: ['Live GPS WhatsApp alerts', 'Contactless handover option', 'On-demand 2-hour pickup windows'],
  },
];

interface CareGallerySectionProps {
  onBookPickupClick?: () => void;
  onEstimateCostClick?: () => void;
}

export const CareGallerySection: React.FC<CareGallerySectionProps> = ({
  onBookPickupClick,
  onEstimateCostClick,
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = ['ALL', 'Facility & Equipment', 'Finishing & Packaging', 'Artisan Pressing', 'Eco Ingredients', 'Logistics & Convenience'];

  const filteredItems = activeFilter === 'ALL'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="gallery-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-wider font-mono">Our Craftsmanship & Standards</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">Visual Facility Tour</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Behind the CleanTrack Studio
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Explore our state-of-the-art wash lab, artisan garment steam pressing, eco botanical detergents, and express courier logistics.
          </p>
        </div>

        {/* Filter segment */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-end">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Visuals' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of gallery visuals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Featured Big Card (First item) */}
        {filteredItems[0] && (
          <div
            onClick={() => setSelectedItem(filteredItems[0])}
            className="md:col-span-12 lg:col-span-7 group relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-slate-900"
          >
            <div className="aspect-16/9 sm:aspect-16/10 w-full overflow-hidden relative">
              <img
                src={filteredItems[0].imageUrl}
                alt={filteredItems[0].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-300 font-mono">
                <span>{filteredItems[0].category}</span>
                <span aria-hidden="true">·</span>
                <span>Tap to enlarge</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-white group-hover:text-blue-300 transition-colors">
                {filteredItems[0].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                {filteredItems[0].subtitle}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {filteredItems[0].highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-slate-200 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Supporting Cards */}
        <div className="md:col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {filteredItems.slice(1, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer bg-slate-900 flex flex-col justify-end"
            >
              <div className="aspect-16/9 sm:aspect-16/10 w-full overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                <div className="text-[11px] font-mono text-cyan-300">{item.category}</div>
                <h4 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1">{item.subtitle}</p>
              </div>

              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Lower Row: Remaining items */}
        {filteredItems.slice(3).map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="md:col-span-6 group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer bg-slate-900"
          >
            <div className="aspect-16/9 w-full overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1.5">
              <div className="text-[11px] font-mono text-emerald-300">{item.category}</div>
              <h4 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">{item.subtitle}</p>
            </div>

            <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-200 text-slate-900"
            >
              {/* Photo Display */}
              <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Info Content */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase tracking-wider">
                  <span>{selectedItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>CleanTrack Quality Standard</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900">
                  {selectedItem.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {selectedItem.description}
                </p>

                {/* Highlights */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Quality Guarantees:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedItem.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    Real facility equipment photographed in our flagship studio.
                  </div>

                  <div className="flex items-center gap-2">
                    {onEstimateCostClick && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(null);
                          onEstimateCostClick();
                        }}
                        className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                      >
                        Calculate Pricing
                      </button>
                    )}

                    {onBookPickupClick && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(null);
                          onBookPickupClick();
                        }}
                        className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Book Laundry Pickup</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
