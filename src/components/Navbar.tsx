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
  Rotate3d,
  Image as ImageIcon,
  Tag,
  MapPin,
  HeartHandshake,
  Truck,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

interface NavbarProps {
  onOpenStaffPortal: () => void;
  onOpenWhatsAppModal: () => void;
  onScrollToTrack: () => void;
  onScrollToPickup: () => void;
  onScrollToHowItWorks: () => void;
  onScrollToBooking?: () => void;
  onScrollToServices?: () => void;
  onScrollToWhyUs?: () => void;
  onScrollToLocation?: () => void;
  onScrollToWAUpdate?: () => void;
  onScrollTo3D?: () => void;
  onScrollToGallery?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStaffPortal,
  onOpenWhatsAppModal,
  onScrollToTrack,
  onScrollToPickup,
  onScrollToHowItWorks,
  onScrollToBooking,
  onScrollToServices,
  onScrollToWhyUs,
  onScrollToLocation,
  onScrollToWAUpdate,
  onScrollTo3D,
  onScrollToGallery,
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
              🌿 CleanTrack Eco Laundry Bali • 100% Plant-Based Detergents • Jl. Raya Munggu
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
            <span>Munggu Bali Hub • Open 07:00 – 21:00 WITA</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Free Doorstep Pickup &gt; 5kg</span>
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
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  Bali
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block">
                Eco Laundry &amp; Garment Care · Munggu
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center gap-1 font-medium text-xs xl:text-sm">
            {onScrollToServices && (
              <button
                type="button"
                onClick={onScrollToServices}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Services &amp; Rates</span>
              </button>
            )}

            {onScrollToBooking && (
              <button
                type="button"
                onClick={onScrollToBooking}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Book Pickup</span>
              </button>
            )}

            {onScrollToWhyUs && (
              <button
                type="button"
                onClick={onScrollToWhyUs}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                <span>Why Us</span>
              </button>
            )}

            {onScrollTo3D && (
              <button
                type="button"
                onClick={onScrollTo3D}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Rotate3d className="w-3.5 h-3.5 text-cyan-600" />
                <span>3D Drum Lab</span>
              </button>
            )}

            {onScrollToGallery && (
              <button
                type="button"
                onClick={onScrollToGallery}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Studio Pics</span>
              </button>
            )}

            <button
              type="button"
              onClick={onScrollToTrack}
              className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Track Order
            </button>

            {onScrollToLocation && (
              <button
                type="button"
                onClick={onScrollToLocation}
                className="px-2.5 py-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Location</span>
              </button>
            )}

            {/* Quick Demo Switcher */}
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 flex items-center gap-1 text-xs font-mono font-medium shadow-xs cursor-pointer"
              >
                <Layers className="w-3 h-3 text-blue-600" />
                <span>Demo: {currentOrder ? currentOrder.orderNumber : 'Select'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
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
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Hub</span>
            </button>

            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Counter Desk</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="p-2 rounded-xl bg-emerald-600 text-white text-xs"
              title="Open WhatsApp Alert Hub"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {onScrollToServices && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollToServices();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-blue-50 text-blue-900 rounded-xl text-left font-semibold border border-blue-200 flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Services &amp; Rates</span>
                </button>
              )}

              {onScrollToBooking && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollToBooking();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-emerald-50 text-emerald-900 rounded-xl text-left font-semibold border border-emerald-200 flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Book Pickup</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onScrollToTrack();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-left font-semibold"
              >
                Track Order
              </button>

              <button
                type="button"
                onClick={() => {
                  onScrollToPickup();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-emerald-50 text-emerald-800 rounded-xl text-left font-semibold border border-emerald-200"
              >
                Pickup Pass 🎟️
              </button>

              {onScrollTo3D && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollTo3D();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-cyan-50 text-cyan-900 rounded-xl text-left font-semibold border border-cyan-200 flex items-center gap-1.5"
                >
                  <Rotate3d className="w-3.5 h-3.5 text-cyan-600" />
                  <span>3D Drum Lab 🌀</span>
                </button>
              )}

              {onScrollToGallery && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollToGallery();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-slate-100 text-slate-800 rounded-xl text-left font-semibold flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Studio Photos</span>
                </button>
              )}

              {onScrollToWhyUs && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollToWhyUs();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-rose-50 text-rose-900 rounded-xl text-left font-semibold border border-rose-200 flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>Why CleanTrack</span>
                </button>
              )}

              {onScrollToLocation && (
                <button
                  type="button"
                  onClick={() => {
                    onScrollToLocation();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-amber-50 text-amber-900 rounded-xl text-left font-semibold border border-amber-200 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Munggu Location</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenWhatsAppModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-center font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Alerts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenStaffPortal();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-900 text-white rounded-xl text-center font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-blue-400" />
                <span>Staff Desk</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
