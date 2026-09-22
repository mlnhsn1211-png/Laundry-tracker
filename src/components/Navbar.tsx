import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  ScanLine,
  BellRing,
  Menu,
  X,
  ChevronDown,
  Layers,
  Zap,
  Award,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { PokeballIcon } from './PokeballIcon';

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
    <>
      {/* Pokemon 20th Anniversary Kinetic Marquee Ribbon */}
      <div className="bg-amber-400 border-b-2 border-slate-900 text-slate-950 overflow-hidden py-1.5 font-mono text-[11px] font-bold tracking-tight select-none">
        <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-pixel text-[10px]">
            ⭐ CLEANTRACK × POKÉMON 20TH ANNIVERSARY SPECIAL
          </span>
          <span>•</span>
          <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold">
            CLEANTRACK LAUNDRY 🔴⚪
          </span>
          <span>•</span>
          <span>TRAIN ON. CLEAN ON. ⚡</span>
          <span>•</span>
          <span>HEAL YOUR FIT TO 100% HP 💖</span>
          <span>•</span>
          <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-bold">
            ZERO QUEUE ERA ⏱️
          </span>
          <span>•</span>
          <span>WHATSAPP READY PINGS 📲</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-pixel text-[10px]">
            ⭐ CLEANTRACK × POKÉMON 20TH ANNIVERSARY SPECIAL
          </span>
          <span>•</span>
          <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold">
            CLEANTRACK LAUNDRY 🔴⚪
          </span>
          <span>•</span>
          <span>TRAIN ON. CLEAN ON. ⚡</span>
          <span>•</span>
          <span>HEAL YOUR FIT TO 100% HP 💖</span>
          <span>•</span>
          <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-bold">
            ZERO QUEUE ERA ⏱️
          </span>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Pokemon 20th Brand Logo with CleanTrack */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={onScrollToTrack}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white poke-box-sm flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[2px_2px_0px_#0f172a]">
              <PokeballIcon size={28} variant="gold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-tighter text-slate-950 leading-none">
                  CleanTrack
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-pixel text-[8px] font-black border border-slate-900 shadow-[1px_1px_0px_#0f172a]">
                  20th
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Pokémon 20th Anniversary Edition • 1996-2016
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-2 font-bold text-xs">
            <button
              type="button"
              onClick={onScrollToTrack}
              className="px-3.5 py-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              Track Order
            </button>

            <button
              type="button"
              onClick={onScrollToPickup}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isCurrentOrderReady
                  ? 'bg-amber-400 text-slate-950 poke-box-sm font-black animate-bounce'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <PokeballIcon size={16} variant={isCurrentOrderReady ? 'gold' : 'standard'} />
              <span>Trainer Pickup Pass</span>
              {isCurrentOrderReady && (
                <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-mono text-[9px] font-black">
                  FULL HP!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onScrollToHowItWorks}
              className="px-3.5 py-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              How It Works
            </button>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-2 rounded-xl bg-white poke-box-sm poke-box-hover text-slate-950 flex items-center gap-1.5 font-mono text-xs"
              >
                <Layers className="w-3.5 h-3.5 text-red-600" />
                <span>Trainer: {currentOrder ? currentOrder.orderNumber : 'Select'}</span>
                <ChevronDown className="w-3 h-3 text-slate-700" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white poke-box rounded-2xl p-2.5 z-50 space-y-1.5 shadow-2xl animate-in fade-in"
                  onClick={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>⚡ Sample Trainers</span>
                    <span className="font-pixel text-[8px] text-amber-500">20TH</span>
                  </div>
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => selectOrder(o)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                        currentOrder?.id === o.id
                          ? 'bg-amber-300 text-slate-950 font-bold poke-box-sm'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold block flex items-center gap-1.5">
                          <PokeballIcon size={14} variant={o.status === 'READY' ? 'gold' : 'standard'} />
                          {o.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-600 pl-5">{o.customerName}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 text-white">
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
            {currentOrder && (
              <button
                type="button"
                onClick={() => triggerMockWhatsAppAlert(currentOrder)}
                className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 poke-box-sm poke-box-hover text-xs font-bold transition-all flex items-center gap-1.5"
                title="Simulate WhatsApp notification from PokéCenter Bot"
              >
                <BellRing className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp Ping</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white poke-box-sm poke-box-hover text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              id="btn-staff-portal-nav"
            >
              <PokeballIcon size={16} variant="ultra" />
              <span>PokéCenter Counter</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white poke-box-sm text-xs font-mono font-bold flex items-center gap-1"
            >
              <PokeballIcon size={14} />
              <span>Staff</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white poke-box-sm text-slate-950"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-slate-900 bg-white px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  onScrollToTrack();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-100 poke-box-sm rounded-xl text-left"
              >
                Track Order
              </button>
              <button
                type="button"
                onClick={() => {
                  onScrollToPickup();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-amber-400 text-slate-950 poke-box-sm rounded-xl text-left font-black"
              >
                Trainer Pass 🎟️
              </button>
              <button
                type="button"
                onClick={() => {
                  onScrollToHowItWorks();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-slate-100 poke-box-sm rounded-xl text-left"
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
                  className="py-2.5 px-3 bg-emerald-500 text-white poke-box-sm rounded-xl text-left font-bold"
                >
                  WhatsApp Ping 📲
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Sample Trainers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      selectOrder(o);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-mono font-bold ${
                      currentOrder?.id === o.id
                        ? 'bg-amber-400 text-slate-950 poke-box-sm'
                        : 'bg-white poke-box-sm text-slate-800'
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
