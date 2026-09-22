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
import { Sparkles, QrCode, ArrowDown, Search, Zap } from 'lucide-react';
import { PokeballIcon } from './components/PokeballIcon';

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
    <div className="min-h-screen flex flex-col bg-[#F4F4F9] text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Real-time WhatsApp Notification Preview / Banner (PRD Section 7.2) */}
      <WhatsAppToast onOpenPickup={scrollToPickup} />

      {/* Main Navigation with Marquee Ribbon */}
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
            {/* Active Order Banner Header: Pokemon 20th Anniversary Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl poke-box">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white poke-box-sm flex items-center justify-center font-black">
                  <PokeballIcon size={28} variant="gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold border border-slate-900">
                      ACTIVE TRAINER PASS
                    </span>
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {currentOrder.orderNumber}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-black text-slate-950 mt-0.5">
                    Welcome back, Trainer {currentOrder.customerName} ⚡
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollToPickup}
                  className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-mono font-black flex items-center gap-1.5 transition-all poke-box-sm poke-box-hover cursor-pointer"
                >
                  <PokeballIcon size={16} variant="ultra" />
                  <span>JUMP TO PASS</span>
                  <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
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
          <div className="text-center py-16 bg-white rounded-3xl poke-box p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 poke-box-sm text-slate-950 mx-auto flex items-center justify-center text-2xl">
              <PokeballIcon size={32} variant="gold" />
            </div>
            <h3 className="font-display text-2xl font-black text-slate-950">No Trainer Order Selected Yet</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
              Enter your Order ID & phone number in the search bar above or tap any quick-test demo pill to load your Trainer Pass!
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
