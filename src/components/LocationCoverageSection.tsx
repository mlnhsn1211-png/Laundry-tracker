import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  MessageSquare,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Store,
} from 'lucide-react';

export const LocationCoverageSection: React.FC = () => {
  const coverageAreas = [
    { zone: 'Munggu & Seseh', eta: '10 – 20 Mins', tag: 'Free Pickup > 5kg', fee: 'Free (> 5kg)' },
    { zone: 'Pererenan Beach', eta: '15 – 25 Mins', tag: 'Daily Route', fee: 'Rp 10.000' },
    { zone: 'Canggu & Batu Bolong', eta: '20 – 30 Mins', tag: 'Twice Daily', fee: 'Rp 15.000' },
    { zone: 'Cemagi & Mengening', eta: '15 – 25 Mins', tag: 'Daily Route', fee: 'Rp 10.000' },
    { zone: 'Mengwi & Kediri', eta: '20 – 30 Mins', tag: 'On Schedule', fee: 'Rp 15.000' },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="location-section">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Compass className="w-4 h-4" />
              <span className="uppercase tracking-wider font-mono">Our Physical Hub & Delivery Reach</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Badung, Bali</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Munggu Studio Location & Delivery Coverage
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Visit our clean air-conditioned counter or schedule our courier to pick up and return clothes to your villa, homestay, or home.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Counter Hours</span>
              <strong className="text-white text-sm block">07:00 – 21:00 WITA</strong>
              <span className="text-emerald-400 text-[11px] font-medium">Open 7 Days a Week</span>
            </div>
          </div>
        </div>

        {/* Content Split: Outlet Details & Delivery Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left: Outlet Information & Physical Amenities */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Storefront Address
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    CleanTrack Laundry - Munggu Bali Hub
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                    Jl. Raya Munggu, Munggu, Kecamatan Mengwi, Kabupaten Badung, Bali
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct main road access • Easy scooter & car parking • 5 minutes from Seseh Beach
                  </p>
                </div>
              </div>
            </div>

            {/* Counter Amenities */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-700">Counter Drop-Off Perks:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital Scale Live Tare</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant 4-Digit Passcode</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>QRIS & Cash Accepted</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Under 2-Min Handover</span>
                </div>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://maps.google.com/?q=Jl.+Raya+Munggu,+Munggu,+Kecamatan+Mengwi,+Kabupaten+Badung,+Bali"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Open Google Maps</span>
              </a>

              <a
                href="https://wa.me/6281234567890?text=Halo%20CleanTrack%20Munggu%2C%20saya%20ingin%20tanya%20lokasi%20atau%20jadwal%20laundry"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Counter Desk</span>
              </a>
            </div>
          </div>

          {/* Right: Courier Delivery Coverage */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Pickup & Delivery Radius
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Doorstep Courier Coverage in Southwest Badung
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Stay relaxing at your villa or working from your laptop. Our electric courier fleet stops by your address at your scheduled hour.
              </p>
            </div>

            {/* Coverage zones table */}
            <div className="space-y-2">
              {coverageAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 font-semibold">{area.zone}</strong>
                      <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">
                        Avg ETA: {area.eta}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {area.fee}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Villa Doorstep Protocol:</strong> Couriers carry hanging garment garment bags and digital scales. You can pay via QRIS right at your villa gate or charge via digital transfer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
