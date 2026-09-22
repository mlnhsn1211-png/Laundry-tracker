import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  ScanLine,
  BellRing,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';

interface NavbarProps {
  onOpenStaffPortal: () => void;
  onScrollToTrack: () => void;
  onScrollToPickup: () => void;
  onScrollToHowItWorks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStaffPortal,
  onScrollToTrack,
  onScrollToPickup,
  onScrollToHowItWorks,
}) => {
  const { currentOrder, orders, selectOrder, triggerMockWhatsAppAlert } = useLaundry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isCurrentOrderReady = currentOrder?.status === 'READY';

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">
              CleanTrack
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mt-0.5">
              Laundry Platform
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={onScrollToTrack}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Track Order
          </button>

          <button
            type="button"
            onClick={onScrollToPickup}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              isCurrentOrderReady
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold shadow-sm'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Fast Pickup Pass</span>
            {isCurrentOrderReady && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={onScrollToHowItWorks}
            className="px-3.5 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            How It Works
          </button>

          {/* Quick Demo Order Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Sample: {currentOrder ? currentOrder.orderNumber : 'Select'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {demoDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-in fade-in"
                onClick={() => setDemoDropdownOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Customer
                </div>
                {orders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => selectOrder(o)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentOrder?.id === o.id
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold block">{o.orderNumber}</span>
                      <span className="text-[11px] text-slate-500">{o.customerName}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {o.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Notification Trigger Button */}
          {currentOrder && (
            <button
              type="button"
              onClick={() => triggerMockWhatsAppAlert(currentOrder)}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1.5"
              title="Test WhatsApp ready notification simulation"
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate WhatsApp Alert</span>
            </button>
          )}

          {/* Staff Counter Station Toggle */}
          <button
            type="button"
            onClick={onOpenStaffPortal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow flex items-center gap-1.5"
            id="btn-staff-portal-nav"
          >
            <ScanLine className="w-3.5 h-3.5 text-indigo-400" />
            <span>Staff Portal</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onOpenStaffPortal}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
          >
            <ScanLine className="w-3.5 h-3.5 text-indigo-400" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                onScrollToTrack();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 bg-slate-50 rounded-xl text-left"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={() => {
                onScrollToPickup();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 bg-emerald-50 text-emerald-900 rounded-xl text-left font-bold"
            >
              Pickup Pass
            </button>
            <button
              type="button"
              onClick={() => {
                onScrollToHowItWorks();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 bg-slate-50 rounded-xl text-left"
            >
              How It Works
            </button>
            {currentOrder && (
              <button
                type="button"
                onClick={() => {
                  triggerMockWhatsAppAlert(currentOrder);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-left font-bold"
              >
                Test WhatsApp
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Switch Sample Order
            </p>
            <div className="flex flex-wrap gap-1.5">
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    selectOrder(o);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    currentOrder?.id === o.id
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700'
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
  );
};
