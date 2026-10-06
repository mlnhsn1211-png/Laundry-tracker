import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  Store,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  CreditCard,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { BookingType, LaundryBooking } from '../types';
import { formatRupiah, buildWhatsAppLink, buildBookingWhatsAppMessage } from '../utils/formatters';

interface BookingSectionProps {
  onBookingCreated?: (booking: LaundryBooking) => void;
}

const SERVICE_PACKAGES = [
  {
    id: 'wash-fold',
    name: 'Regular Wash & Fold',
    category: 'kg',
    unitPrice: 15000,
    estimatedTurnaround: '24 Hours',
    desc: 'Eco-detergent, tumble dried, folded & bagged',
  },
  {
    id: 'express-rush',
    name: 'Express 4-Hour Rush',
    category: 'kg',
    unitPrice: 25000,
    estimatedTurnaround: '4 - 6 Hours',
    desc: 'Priority drum wash & swift steam packing',
  },
  {
    id: 'bedding-care',
    name: 'Bedcover & Duvet Deep Clean',
    category: 'set',
    unitPrice: 45000,
    estimatedTurnaround: '2 Days',
    desc: 'Thermal sanitization & anti-mite treatment',
  },
  {
    id: 'dry-clean',
    name: 'Suit & Delicate Dry Clean',
    category: 'pcs',
    unitPrice: 40000,
    estimatedTurnaround: '3 Days',
    desc: 'Solvent wash for blazers, silk & batik',
  },
];

const TIME_SLOTS = [
  '08:00 - 10:00 WIB (Pagi)',
  '10:00 - 12:00 WIB (Siang)',
  '13:00 - 15:00 WIB (Siang)',
  '16:00 - 18:00 WIB (Sore)',
  '19:00 - 21:00 WIB (Malam)',
];

export const BookingSection: React.FC<BookingSectionProps> = ({ onBookingCreated }) => {
  const { bookings, createBooking, cancelBooking } = useLaundry();

  const [bookingType, setBookingType] = useState<BookingType>('HOME_PICKUP');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('wash-fold');
  const [scheduledDate, setScheduledDate] = useState<string>('Today');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [estimatedQty, setEstimatedQty] = useState<number>(4);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [successBooking, setSuccessBooking] = useState<LaundryBooking | null>(null);
  const [activeTab, setActiveTab] = useState<'new-booking' | 'my-bookings'>('new-booking');

  const selectedPkg = SERVICE_PACKAGES.find((p) => p.id === selectedServiceId) || SERVICE_PACKAGES[0];
  const estimatedCost = selectedPkg.unitPrice * estimatedQty;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const name = customerName.trim() || 'Pelanggan CleanTrack';
    const phone = customerPhone.trim() || '081234567890';
    const address = bookingType === 'HOME_PICKUP' ? pickupAddress.trim() || 'Alamat Penjemputan' : undefined;

    const newBooking = createBooking({
      customerName: name,
      customerPhone: phone,
      bookingType,
      scheduledDate,
      timeSlot,
      pickupAddress: address,
      branchName: 'CleanTrack Laundry - Central Hub',
      serviceCategory: selectedPkg.name,
      estimatedWeightOrQty: `${estimatedQty} ${selectedPkg.category}`,
      estimatedCost,
      notes: notes.trim(),
    });

    setSuccessBooking(newBooking);
    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
  };

  const directWaBookingText = buildBookingWhatsAppMessage({
    bookingNumber: successBooking ? successBooking.bookingNumber : '#BK-NEW',
    customerName: customerName || 'Pelanggan',
    bookingType,
    scheduledDate,
    timeSlot,
    serviceCategory: selectedPkg.name,
    estimatedWeightOrQty: `${estimatedQty} ${selectedPkg.category}`,
    estimatedCost,
    pickupAddress,
    branchName: 'CleanTrack Laundry - Central Hub',
    notes,
  });

  const directWaLink = buildWhatsAppLink(
    customerPhone.trim() || '081234567890',
    directWaBookingText
  );

  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="booking-section">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Featured Laundry Booking</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Book Laundry Pickup & Drop-Off
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Schedule a doorstep courier pickup from your home or reserve a zero-wait express counter drop-off slot with real-time WhatsApp reminders.
          </p>
        </div>

        {/* View My Bookings Pill Toggle */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('new-booking')}
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'new-booking'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            New Booking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-bookings')}
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-bookings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>My Bookings</span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.2 rounded-full font-mono text-emerald-300">
              {bookings.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'new-booking' ? (
        <div className="p-6 sm:p-8">
          {successBooking ? (
            /* Booking Confirmation Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-2xl mx-auto"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                  Booking Confirmed
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                  Ref: {successBooking.bookingNumber}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Thank you, <strong>{successBooking.customerName}</strong>! Your laundry{' '}
                  {successBooking.bookingType === 'HOME_PICKUP' ? 'doorstep pickup' : 'express drop-off slot'}{' '}
                  has been scheduled for <strong>{successBooking.scheduledDate} ({successBooking.timeSlot})</strong>.
                </p>
              </div>

              {/* Courier info if home pickup */}
              {successBooking.assignedCourier && (
                <div className="bg-white rounded-xl p-4 border border-emerald-200 text-left flex items-center justify-between text-xs max-w-md mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                        Assigned Courier
                      </span>
                      <strong className="text-slate-900 text-sm block">
                        {successBooking.assignedCourier.name}
                      </strong>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Plat: {successBooking.assignedCourier.vehiclePlate} • Rating: ⭐ {successBooking.assignedCourier.rating}
                      </span>
                    </div>
                  </div>
                  <a
                    href={buildWhatsAppLink(
                      successBooking.assignedCourier.phone,
                      `Halo Mas ${successBooking.assignedCourier.name}, saya pelanggan booking ${successBooking.bookingNumber}. Alamat saya di: ${successBooking.pickupAddress || ''}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat WA</span>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={directWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Confirmation to Customer WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSuccessBooking(null)}
                  className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Create Another Booking
                </button>
              </div>
            </motion.div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="space-y-8">
              {/* Step 1: Booking Mode Toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  1. Choose Booking Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingType('HOME_PICKUP')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      bookingType === 'HOME_PICKUP'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        bookingType === 'HOME_PICKUP'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Doorstep Home Pickup</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded uppercase">
                          Popular
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Courier picks up directly from your home or apartment lobby. Includes digital scale verification.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('STORE_DROP_OFF')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      bookingType === 'STORE_DROP_OFF'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        bookingType === 'STORE_DROP_OFF'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">Fast-Track Counter Slot</span>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Reserve your drop-off window at the counter. Bypass queueing with pre-tagged digital intake.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Service Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  2. Select Service Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SERVICE_PACKAGES.map((pkg) => {
                    const isSelected = pkg.id === selectedServiceId;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedServiceId(pkg.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 font-medium'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{pkg.name}</span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-blue-600 block">
                          {formatRupiah(pkg.unitPrice)} / {pkg.category}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{pkg.desc}</p>
                        <span className="inline-block mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                          Ready: {pkg.estimatedTurnaround}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Time Slot Scheduling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    3. Scheduled Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setScheduledDate(d)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                          scheduledDate === d
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Time Slot Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Customer Details & Pickup Address */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  4. Contact & Location Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maulan Hasan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {bookingType === 'HOME_PICKUP' ? (
                  <div>
                    <label className="text-xs text-slate-600 block mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Doorstep Pickup Address & Unit / Apartment Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Jl. Senopati No. 18, Apartemen Residence Tower A Lt. 8 No. 802. Depan lobby utama."
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-600" />
                      <span>
                        Drop-Off Location: <strong>CleanTrack Central Hub</strong> (Jl. Surya Kencana No. 42)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700">07:00 – 21:00 WIB</span>
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Special Fabric Notes or Courier Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ada jas sutra butuh penanganan ekstra, mohon jemput sebelum jam 11."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Bottom Cost Summary & Submit Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                    Estimated Booking Cost
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-700">
                      {formatRupiah(estimatedCost)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({estimatedQty} {selectedPkg.category} • {selectedPkg.name})
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    ✓ Free WhatsApp Live Notifications Included
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                    id="btn-confirm-laundry-booking"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>

                  <a
                    href={directWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                    title="Send booking draft directly to CleanTrack WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Book via WA</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* My Bookings Tab */
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Active Bookings</h3>
              <p className="text-xs text-slate-500">Scheduled pickups and drop-off reservations</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
              {bookings.length} Total Bookings
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {bookings.map((bk) => (
              <div key={bk.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{bk.bookingNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        bk.status === 'COURIER_ASSIGNED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : bk.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {bk.status}
                    </span>
                    <span className="text-xs text-slate-500">• {bk.bookingType === 'HOME_PICKUP' ? 'Home Pickup' : 'Store Slot'}</span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {bk.serviceCategory} ({bk.estimatedWeightOrQty}) • {bk.scheduledDate} ({bk.timeSlot})
                  </p>
                  {bk.pickupAddress && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {bk.pickupAddress}
                    </p>
                  )}
                  {bk.assignedCourier && (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Kurir: {bk.assignedCourier.name} ({bk.assignedCourier.vehiclePlate})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm mr-2">
                    {formatRupiah(bk.estimatedCost)}
                  </span>

                  <a
                    href={buildWhatsAppLink(
                      bk.customerPhone,
                      `Halo CleanTrack, saya ingin menanyakan jadwal booking ${bk.bookingNumber} (${bk.serviceCategory}) atas nama ${bk.customerName}. Terima kasih!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Bot</span>
                  </a>

                  {bk.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(bk.id)}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-xs transition-colors cursor-pointer"
                      title="Cancel Booking"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
