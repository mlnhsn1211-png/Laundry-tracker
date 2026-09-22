import React, { useState, useRef } from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PickupCard } from './components/PickupCard';
import { StatusTracker } from './components/StatusTracker';
import { CustomerHistory } from './components/CustomerHistory';
import { HowItWorks } from './components/HowItWorks';
import { StaffPortalModal } from './components/StaffPortalModal';
import { WhatsAppToast } from './components/WhatsAppToast';
import { Footer } from './components/Footer';
import { Sparkles, QrCode, ArrowDown, Search } from 'lucide-react';

function LaundryCustomerApp() {
  const { currentOrder, customerHistory } = useLaundry();
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);

  const trackerRef = useRef<HTMLDivElement>(null);
  const pickupRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPickup = () => {
    pickupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Real-time WhatsApp Notification Preview / Banner (PRD Section 7.2) */}
      <WhatsAppToast onOpenPickup={scrollToPickup} />

      {/* Main Navigation */}
      <Navbar
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
        onScrollToTrack={scrollToTracker}
        onScrollToPickup={scrollToPickup}
        onScrollToHowItWorks={scrollToHowItWorks}
      />

      {/* Hero Section with Embedded Fast Track Form */}
      <HeroSection
        onTrackSuccess={scrollToTracker}
        onHowItWorksClick={scrollToHowItWorks}
      />

      {/* Main Customer Order Dashboard (PRD Section 10 & 11) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" id="main-content">
        {currentOrder ? (
          <div ref={trackerRef} className="space-y-8 scroll-mt-20">
            {/* Active Order Banner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Active Order</span>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {currentOrder.orderNumber}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">
                    Welcome back, {currentOrder.customerName}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollToPickup}
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Go to Pickup Pass</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Fast-Track Pickup Card (PRD Section 7.3 & 11) */}
            <div ref={pickupRef} className="scroll-mt-20">
              <PickupCard order={currentOrder} />
            </div>

            {/* Live Progress Tracker (PRD Section 7.1) */}
            <StatusTracker
              currentStatus={currentOrder.status}
              estimatedReadyAt={currentOrder.estimatedReadyAt}
              statusHistory={currentOrder.statusHistory}
            />

            {/* Customer Order History (PRD Section 10) */}
            <CustomerHistory
              historyOrders={customerHistory}
              currentOrderId={currentOrder.id}
            />
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Order Selected Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Please enter your Order ID and phone number in the search bar above to view your real-time laundry progress and pickup pass.
            </p>
          </div>
        )}

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
