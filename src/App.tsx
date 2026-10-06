import React, { useState, useRef } from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Interactive3DLaundry } from './components/Interactive3DLaundry';
import { CareGallerySection } from './components/CareGallerySection';
import { PickupCard } from './components/PickupCard';
import { StatusTracker } from './components/StatusTracker';
import { CustomerHistory } from './components/CustomerHistory';
import { BookingSection } from './components/BookingSection';
import { WhatsAppUpdateCenter } from './components/WhatsAppUpdateCenter';
import { ServiceEstimator } from './components/ServiceEstimator';
import { HowItWorks } from './components/HowItWorks';
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
} from 'lucide-react';

function LaundryCustomerApp() {
  const { currentOrder, customerHistory, triggerMockWhatsAppAlert } = useLaundry();
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const trackerRef = useRef<HTMLDivElement>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const waUpdateRef = useRef<HTMLDivElement>(null);
  const estimatorRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const threeDRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPickup = () => {
    pickupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWAUpdate = () => {
    waUpdateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEstimator = () => {
    estimatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo3D = () => {
    threeDRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        onScrollToWAUpdate={scrollToWAUpdate}
        onScrollTo3D={scrollTo3D}
        onScrollToGallery={scrollToGallery}
      />

      {/* Hero Section with Embedded Fast Track Form */}
      <HeroSection
        onTrackSuccess={scrollToTracker}
        onHowItWorksClick={scrollToHowItWorks}
        on3DClick={scrollTo3D}
        onGalleryClick={scrollToGallery}
      />

      {/* Featured Interactive Fast-Action Ribbon */}
      <section className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Featured Tools & Visuals:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-start md:justify-end">
            <button
              type="button"
              onClick={scrollTo3D}
              className="py-1.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Rotate3d className="w-3.5 h-3.5 text-cyan-600" />
              <span>3D Care Drum</span>
            </button>

            <button
              type="button"
              onClick={scrollToGallery}
              className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Studio Pics (5)</span>
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
              onClick={scrollToWAUpdate}
              className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>WA Bot Updates</span>
            </button>

            <button
              type="button"
              onClick={scrollToEstimator}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Alert Center</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStaffPortalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Staff Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Customer Order Dashboard */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" id="main-content">
        {currentOrder ? (
          <div ref={trackerRef} className="space-y-8 scroll-mt-20">
            {/* Active Order Banner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Active Order
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {currentOrder.orderNumber}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                    Order for {currentOrder.customerName}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerMockWhatsAppAlert(currentOrder, 'READY')}
                  className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Simulate sending WhatsApp ready alert"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulate WA Alert</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToPickup}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Pickup Pass</span>
                  <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Fast-Track Pickup Card */}
            <div ref={pickupRef} className="scroll-mt-20">
              <PickupCard order={currentOrder} />
            </div>

            {/* Live Progress Tracker */}
            <StatusTracker
              currentStatus={currentOrder.status}
              estimatedReadyAt={currentOrder.estimatedReadyAt}
              statusHistory={currentOrder.statusHistory}
              orderNumber={currentOrder.orderNumber}
            />

            {/* Customer Order History */}
            <CustomerHistory
              historyOrders={customerHistory}
              currentOrderId={currentOrder.id}
            />
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900">No Order Selected</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Enter your Order ID and phone number in the search bar above or tap any sample order pill to view status and pickup pass.
            </p>
          </div>
        )}

        {/* 3D Interactive Laundry Care Drum Simulator */}
        <div ref={threeDRef} className="scroll-mt-20">
          <Interactive3DLaundry />
        </div>

        {/* Visual Studio & Care Photography Showcase */}
        <div ref={galleryRef} className="scroll-mt-20">
          <CareGallerySection
            onBookPickupClick={scrollToBooking}
            onEstimateCostClick={scrollToEstimator}
          />
        </div>

        {/* Featured 1: Book Laundry Pickup & Delivery */}
        <div ref={bookingRef} className="scroll-mt-20">
          <BookingSection onBookingCreated={scrollToTracker} />
        </div>

        {/* Featured 2: WhatsApp Laundry Updates & Bot Center */}
        <div ref={waUpdateRef} className="scroll-mt-20">
          <WhatsAppUpdateCenter />
        </div>

        {/* Featured 3: Drop-Off Cost & Time Estimator */}
        <div ref={estimatorRef} className="scroll-mt-20">
          <ServiceEstimator onOrderCreated={scrollToTracker} />
        </div>

        {/* How It Works Section */}
        <div ref={howItWorksRef} className="scroll-mt-20">
          <HowItWorks />
        </div>
      </main>

      {/* Staff Handover and Counter Portal Modal */}
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
