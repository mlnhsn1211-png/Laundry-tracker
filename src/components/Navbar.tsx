import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  BellRing,
  Menu,
  X,
  ChevronDown,
  Layers,
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

interface NavbarProps {
  onOpenStaffPortal: () => void;
  onOpenWhatsAppModal: () => void;
  onScrollToTrack: () => void;
  onScrollToPickup: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToBooking?: () => void;
  onScrollToWAUpdate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStaffPortal,
  onOpenWhatsAppModal,
  onScrollToTrack,
  onScrollToPickup,
  onScrollToHowItWorks,
  onScrollToBooking,
  onScrollToWAUpdate,
}) => {
  const { currentOrder, orders, selectOrder, triggerMockWhatsAppAlert } = useLaundry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isCurrentOrderReady = currentOrder?.status === 'READY';

  return (
    <>
      {/* Top Value Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              CleanTrack Live: Real-time laundry tracking & instant WhatsApp pickup pass
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
            <span>Central Hub • Open 07:00 – 21:00</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Fast-Track Counter Active</span>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={onScrollToTrack}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                  CleanTrack
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                  Live
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block">
                Laundry Tracking & Fast Pickup
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-1.5 font-medium text-sm">
            <button
              type="button"
              onClick={onScrollToTrack}
              className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Track Order
            </button>

            {onScrollToBooking && (
              <button
                type="button"
                onClick={onScrollToBooking}
                className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Book Laundry</span>
              </button>
            )}

            {onScrollToWAUpdate && (
              <button
                type="button"
                onClick={onScrollToWAUpdate}
                className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WA Updates</span>
              </button>
            )}

            <button
              type="button"
              onClick={onScrollToPickup}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                isCurrentOrderReady
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Pickup Pass</span>
              {isCurrentOrderReady && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  READY
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onScrollToHowItWorks}
              className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              How It Works
            </button>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 flex items-center gap-1.5 text-xs font-mono font-medium shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo: {currentOrder ? currentOrder.orderNumber : 'Select'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl p-2 z-50 space-y-1 shadow-lg animate-in fade-in"
                  onClick={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Sample Orders for Testing
                  </div>
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => selectOrder(o)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentOrder?.id === o.id
                          ? 'bg-blue-50 text-blue-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-semibold block text-slate-900">
                          {o.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">{o.customerName}</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded-full ${
                          o.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'PICKED_UP'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Open WhatsApp Alert Test & Dispatch Center"
              id="btn-nav-whatsapp-modal"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Alerts</span>
            </button>

            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shadow-sm shadow-slate-900/10 cursor-pointer"
              id="btn-staff-portal-nav"
            >
              <Store className="w-4 h-4 text-blue-400" />
              <span>Counter Staff Terminal</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center"
              title="WhatsApp Alerts"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Staff</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  onScrollToTrack();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-slate-800 font-semibold"
              >
                Track Order
              </button>
              <button
                type="button"
                onClick={() => {
                  onScrollToPickup();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-emerald-50 text-emerald-800 rounded-lg text-left font-semibold border border-emerald-200"
              >
                Pickup Pass 🎟️
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onScrollToBooking) onScrollToBooking();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-blue-50 text-blue-900 rounded-lg text-left font-semibold border border-blue-200 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Book Laundry 🛵</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onScrollToWAUpdate) onScrollToWAUpdate();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-emerald-50 text-emerald-900 rounded-lg text-left font-semibold border border-emerald-200 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WA Status Bot 🤖</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onScrollToHowItWorks();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left text-slate-800 font-semibold"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenWhatsAppModal();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-left font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Alerts 📲</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Sample Test Orders
              </p>
              <div className="flex flex-wrap gap-1.5">
                {orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      selectOrder(o);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-mono ${
                      currentOrder?.id === o.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {o.orderNumber} ({o.status})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
