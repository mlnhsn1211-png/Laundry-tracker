import React, { useState, useRef } from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesPricingSection } from './components/ServicesPricingSection';
import { BookingSection } from './components/BookingSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { Interactive3DLaundry } from './components/Interactive3DLaundry';
import { ServiceEstimator } from './components/ServiceEstimator';
import { CareGallerySection } from './components/CareGallerySection';
import { PickupCard } from './components/PickupCard';
import { StatusTracker } from './components/StatusTracker';
import { CustomerHistory } from './components/CustomerHistory';
import { WhatsAppUpdateCenter } from './components/WhatsAppUpdateCenter';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationCoverageSection } from './components/LocationCoverageSection';
import { FAQSection } from './components/FAQSection';
import { StaffPortalModal } from './components/StaffPortalModal';
import { WhatsAppToast } from './components/WhatsAppToast';
import { WhatsAppAlertModal } from './components/WhatsAppAlertModal';
import { Footer } from './components/Footer';
import {
  QrCode,
  ArrowDown,
  Package,
  Search,
  Calculator,
  MessageSquare,
  Sparkles,
  Zap,
  Store,
  Clock,
  ShieldCheck,
  Calendar,
  Truck,
  Bot,
  Rotate3d,
  Image as ImageIcon,
  Tag,
  MapPin,
  HeartHandshake,
  HelpCircle,
  Phone,
} from 'lucide-react';

function LaundryCustomerApp() {
  const { currentOrder, customerHistory, triggerMockWhatsAppAlert } = useLaundry();
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Section Refs for smooth navigation
  const servicesRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const threeDRef = useRef<HTMLDivElement>(null);
  const estimatorRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const waUpdateRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWhyUs = () => {
    whyUsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo3D = () => {
    threeDRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEstimator = () => {
    estimatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPickup = () => {
    pickupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWAUpdate = () => {
    waUpdateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Real-time WhatsApp Notification Toast */}
      <WhatsAppToast onOpenPickup={scrollToPickup} />

      {/* Main Navigation */}
      <Navbar
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onScrollToTrack={scrollToTracker}
        onScrollToPickup={scrollToPickup}
        onScrollToHowItWorks={scrollToHowItWorks}
        onScrollToBooking={scrollToBooking}
        onScrollToServices={scrollToServices}
        onScrollToWhyUs={scrollToWhyUs}
        onScrollToLocation={scrollToLocation}
        onScrollToWAUpdate={scrollToWAUpdate}
        onScrollTo3D={scrollTo3D}
        onScrollToGallery={scrollToGallery}
      />

      {/* Hero Section: Premier Bali Laundry Brand + Dual Booking / Tracking Hub */}
      <HeroSection
        onTrackSuccess={scrollToTracker}
        onHowItWorksClick={scrollToHowItWorks}
        on3DClick={scrollTo3D}
        onGalleryClick={scrollToGallery}
        onBookPickupClick={scrollToBooking}
        onServicesClick={scrollToServices}
      />

      {/* Featured Interactive Fast-Action Ribbon */}
      <section className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs sticky top-18 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CleanTrack Bali Quick Menu:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-start md:justify-end">
            <button
              type="button"
              onClick={scrollToServices}
              className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Services &amp; Rates</span>
            </button>

            <button
              type="button"
              onClick={scrollToBooking}
              className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Pickup</span>
            </button>

            <button
              type="button"
              onClick={scrollTo3D}
              className="py-1.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Rotate3d className="w-3.5 h-3.5 text-cyan-600" />
              <span>3D Drum Lab</span>
            </button>

            <button
              type="button"
              onClick={scrollToEstimator}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Cost Calculator</span>
            </button>

            <button
              type="button"
              onClick={scrollToGallery}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Studio Photos</span>
            </button>

            <button
              type="button"
              onClick={scrollToTracker}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={scrollToLocation}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Munggu Hub</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Website Sections */}
      <main className="flex-1 w-full space-y-16 py-10" id="main-content">
        {/* Section 1: Services & Transparent Pricing */}
        <div ref={servicesRef} className="scroll-mt-28">
          <ServicesPricingSection
            onSelectServiceForBooking={() => scrollToBooking()}
            onOpenEstimator={() => scrollToEstimator()}
          />
        </div>

        {/* Section 2: Doorstep Courier Booking & Pickup Scheduler */}
        <div ref={bookingRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <BookingSection onBookingCreated={scrollToTracker} />
        </div>

        {/* Section 3: Interactive 3D Laundry Care Drum Simulator */}
        <div ref={threeDRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <Interactive3DLaundry />
        </div>

        {/* Section 4: Why Bali Trusts CleanTrack (6 Quality Pillars) */}
        <div ref={whyUsRef} className="scroll-mt-28">
          <WhyChooseUsSection />
        </div>

        {/* Section 5: Drop-Off Cost & Ready Time Estimator */}
        <div ref={estimatorRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <ServiceEstimator onOrderCreated={scrollToTracker} />
        </div>

        {/* Section 6: Behind the CleanTrack Studio Photography Showcase */}
        <div ref={galleryRef} className="scroll-mt-28">
          <CareGallerySection
            onBookPickupClick={scrollToBooking}
            onEstimateCostClick={scrollToEstimator}
          />
        </div>

        {/* Section 7: Live Order Tracking & Pickup Pass Portal */}
        <div ref={trackerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">
                  <Search className="w-4 h-4" />
                  <span>Digital Order Portal</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-normal">Real-Time Progress &amp; Pass</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Track Your Laundry &amp; View Pickup Pass
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Check live treatment stages, access your 4-digit pickup passcode, or view historical invoices.
                </p>
              </div>

              {currentOrder && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerMockWhatsAppAlert(currentOrder, 'READY')}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test WA Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={scrollToPickup}
                    className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                </div>
              )}
            </div>

            {currentOrder ? (
              <div className="space-y-8">
                {/* Active Order Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Active Order
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {currentOrder.orderNumber}
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-slate-900 mt-0.5">
                        {currentOrder.customerName} ({currentOrder.customerPhone})
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Ready estimate: <strong className="text-slate-800">{currentOrder.estimatedReadyAt}</strong>
                  </div>
                </div>

                {/* Pickup Pass Card */}
                <div ref={pickupRef} className="scroll-mt-28">
                  <PickupCard order={currentOrder} />
                </div>

                {/* Status Progression Tracker */}
                <StatusTracker
                  currentStatus={currentOrder.status}
                  estimatedReadyAt={currentOrder.estimatedReadyAt}
                  statusHistory={currentOrder.statusHistory}
                  orderNumber={currentOrder.orderNumber}
                />

                {/* Customer History */}
                <CustomerHistory
                  historyOrders={customerHistory}
                  currentOrderId={currentOrder.id}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-3">
                <Search className="w-8 h-8 text-blue-600 mx-auto" />
                <h4 className="font-display text-xl font-bold text-slate-900">Search Your Laundry Order</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Enter your order number or phone in the top banner or select any sample order from the demo switcher above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 8: WhatsApp Automated Updates & Bot Hub */}
        <div ref={waUpdateRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <WhatsAppUpdateCenter />
        </div>

        {/* Section 9: How CleanTrack Works Process Overview */}
        <div ref={howItWorksRef} className="scroll-mt-28">
          <HowItWorks />
        </div>

        {/* Section 10: Customer Testimonials & Reviews */}
        <div ref={reviewsRef} className="scroll-mt-28">
          <TestimonialsSection />
        </div>

        {/* Section 11: Munggu Studio Location & Coverage Map */}
        <div ref={locationRef} className="scroll-mt-28">
          <LocationCoverageSection />
        </div>

        {/* Section 12: Frequently Asked Questions */}
        <div ref={faqRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <FAQSection />
        </div>
      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/6281234567890?text=Halo%20CleanTrack%20Laundry%20Munggu%2C%20saya%20ingin%20tanya%20layanan%20atau%20jadwalkan%20penjemputan"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">Chat WhatsApp Munggu</span>
        </a>
      </div>

      {/* Counter Staff Portal Modal */}
      <StaffPortalModal
        isOpen={isStaffPortalOpen}
        onClose={() => setIsStaffPortalOpen(false)}
      />

      {/* WhatsApp Alert Center Modal */}
      <WhatsAppAlertModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        initialOrder={currentOrder}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LaundryProvider>
      <LaundryCustomerApp />
    </LaundryProvider>
  );
}
