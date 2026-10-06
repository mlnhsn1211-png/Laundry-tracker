import { OrderStatus, PaymentStatus } from '../types';

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

export interface StatusMeta {
  label: string;
  subtext: string;
  stepIndex: number;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  dotColor: string;
}

export const STATUS_PROGRESS_ORDER: OrderStatus[] = [
  'RECEIVED',
  'WASHING',
  'DRYING',
  'IRONING',
  'READY',
  'PICKED_UP',
];

export const STATUS_DETAILS: Record<OrderStatus, StatusMeta> = {
  RECEIVED: {
    label: 'Order Received',
    subtext: 'Weighed, tagged, and queued in laundry queue',
    stepIndex: 0,
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    borderClass: 'border-blue-200',
    dotColor: 'bg-blue-600',
  },
  WASHING: {
    label: 'Washing',
    subtext: 'Separating fabrics & eco-cycle washing in progress',
    stepIndex: 1,
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    borderClass: 'border-cyan-200',
    dotColor: 'bg-cyan-600',
  },
  DRYING: {
    label: 'Drying',
    subtext: 'Temperature-controlled tumble drying',
    stepIndex: 2,
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    borderClass: 'border-amber-200',
    dotColor: 'bg-amber-600',
  },
  IRONING: {
    label: 'Ironing & Folding',
    subtext: 'Steam pressing, fragrance treatment, and sealed bagging',
    stepIndex: 3,
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    dotColor: 'bg-indigo-600',
  },
  READY: {
    label: 'Ready for Pickup',
    subtext: 'Stored in shelf. Show your pickup code at the counter!',
    stepIndex: 4,
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderClass: 'border-emerald-300',
    dotColor: 'bg-emerald-600',
  },
  PICKED_UP: {
    label: 'Picked Up',
    subtext: 'Handed over and verified at counter. Thank you!',
    stepIndex: 5,
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    borderClass: 'border-slate-300',
    dotColor: 'bg-slate-600',
  },
  DELAYED: {
    label: 'Delayed',
    subtext: 'Requires extra gentle care or additional wash cycle',
    stepIndex: 2,
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    borderClass: 'border-rose-200',
    dotColor: 'bg-rose-600',
  },
  CANCELLED: {
    label: 'Cancelled',
    subtext: 'Order cancelled by customer or branch',
    stepIndex: -1,
    badgeBg: 'bg-neutral-100',
    badgeText: 'text-neutral-600',
    borderClass: 'border-neutral-300',
    dotColor: 'bg-neutral-500',
  },
};

export const PAYMENT_DETAILS: Record<
  PaymentStatus,
  { label: string; badgeBg: string; badgeText: string; isPaid: boolean }
> = {
  PAID: {
    label: 'PAID',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeText: 'text-emerald-700',
    isPaid: true,
  },
  UNPAID: {
    label: 'UNPAID',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: 'text-amber-700',
    isPaid: false,
  },
  PAYMENT_PENDING: {
    label: 'PAYMENT PENDING',
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    badgeText: 'text-blue-700',
    isPaid: false,
  },
  REFUND_PENDING: {
    label: 'REFUND PENDING',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
    badgeText: 'text-purple-700',
    isPaid: false,
  },
  REFUNDED: {
    label: 'REFUNDED',
    badgeBg: 'bg-slate-100 border-slate-300 text-slate-700',
    badgeText: 'text-slate-700',
    isPaid: false,
  },
};

export type WhatsAppAlertType =
  | 'READY'
  | 'STATUS_UPDATE'
  | 'DELAYED'
  | 'PICKED_UP'
  | 'CUSTOM_UPDATE'
  | 'BOOKING_CONFIRMATION'
  | 'STATUS_INQUIRY';

export interface WhatsAppOrderPayload {
  customerName: string;
  orderNumber: string;
  totalPrice: number;
  pickupCode: string;
  paymentStatus?: PaymentStatus;
  status?: OrderStatus;
  branchName?: string;
  branchAddress?: string;
  orderUrl?: string;
  itemsCount?: number;
  estimatedReadyAt?: string;
  customNote?: string;
}

export function buildWhatsAppMessage(
  order: WhatsAppOrderPayload,
  alertType: WhatsAppAlertType = 'READY'
): string {
  const url = order.orderUrl || window.location.origin;
  const directLink = `${url}?order=${encodeURIComponent(order.orderNumber)}`;
  const branch = order.branchName || 'CleanTrack Laundry - Munggu Bali Hub';
  const paymentNotice =
    order.paymentStatus === 'PAID'
      ? `✅ Payment: *PAID* (${formatRupiah(order.totalPrice)})`
      : `⚠️ Payment: *UNPAID* (${formatRupiah(order.totalPrice)}) - Settle via QRIS or Cash at counter`;

  if (alertType === 'READY' || order.status === 'READY') {
    return (
      `🧺 *CleanTrack Laundry - Order Ready!* 🧺\n\n` +
      `Hi *${order.customerName}*,\n` +
      `Your laundry *${order.orderNumber}* is fresh, folded, inspected, and ready for pickup!\n\n` +
      `🎟️ *4-Digit Pickup Passcode:* *${order.pickupCode}*\n` +
      `${paymentNotice}\n\n` +
      `⚡ *Zero-Wait Fast Track Collection:*\n` +
      `Simply mention code *${order.pickupCode}* or show your digital pass:\n` +
      `${directLink}\n\n` +
      `📍 *Pickup Branch:* ${branch}\n` +
      `⏰ *Operating Hours:* 07:00 – 21:00 WITA\n\n` +
      `Thank you for choosing CleanTrack!`
    );
  }

  if (alertType === 'CUSTOM_UPDATE' || order.customNote) {
    const stage = order.status ? STATUS_DETAILS[order.status]?.label : 'Active Order';
    return (
      `💬 *CleanTrack Laundry - Update Pakaian Anda* 💬\n\n` +
      `Halo *${order.customerName}*,\n` +
      `Berikut update terbaru untuk pesanan laundry *${order.orderNumber}*:\n\n` +
      `📍 *Tahapan Saat Ini:* ${stage}\n` +
      `📝 *Catatan Tim CleanTrack:* "${order.customNote || 'Sedang diproses dengan standar higienis maksimal.'}"\n\n` +
      `🕒 *Estimasi Selesai:* ${order.estimatedReadyAt || 'Sesuai jadwal'}\n` +
      `🎟️ *Kode Pengambilan:* *${order.pickupCode}*\n\n` +
      `Pantau progres live:\n` +
      `${directLink}\n\n` +
      `Ada pertanyaan? Balas pesan ini kapan saja!`
    );
  }

  if (alertType === 'DELAYED' || order.status === 'DELAYED') {
    return (
      `⚠️ *CleanTrack Laundry - Care Update* ⚠️\n\n` +
      `Hi *${order.customerName}*,\n` +
      `Regarding your order *${order.orderNumber}*:\n` +
      `Our fabric specialists have given your garments an extra gentle care cycle to guarantee quality.\n\n` +
      `🕒 *Revised Estimated Ready Time:* ${order.estimatedReadyAt || 'Later today'}\n` +
      `🎟️ *Pickup Code:* *${order.pickupCode}*\n\n` +
      `Track live progress anytime:\n` +
      `${directLink}\n\n` +
      `We appreciate your patience!`
    );
  }

  if (alertType === 'PICKED_UP' || order.status === 'PICKED_UP') {
    return (
      `✨ *CleanTrack Laundry - Handover Complete* ✨\n\n` +
      `Hi *${order.customerName}*,\n` +
      `Thank you for picking up your laundry order *${order.orderNumber}*!\n\n` +
      `💰 *Total Paid:* ${formatRupiah(order.totalPrice)}\n` +
      `🧾 *Digital Itemized Receipt:* ${directLink}\n\n` +
      `Have a wonderful day, and see you next time at CleanTrack!`
    );
  }

  // Default status update (e.g. WASHING, DRYING, IRONING)
  const currentStage = order.status ? STATUS_DETAILS[order.status]?.label : 'Processing';
  return (
    `🧺 *CleanTrack Laundry - Status Update* 🧺\n\n` +
    `Hi *${order.customerName}*,\n` +
    `Your order *${order.orderNumber}* is now in stage: *${currentStage}*.\n\n` +
    `🕒 *Target Ready Time:* ${order.estimatedReadyAt || 'Soon'}\n` +
    `🎟️ *Passcode:* *${order.pickupCode}*\n\n` +
    `Track your laundry in real time:\n` +
    `${directLink}`
  );
}

export function buildBookingWhatsAppMessage(booking: {
  bookingNumber: string;
  customerName: string;
  bookingType: 'HOME_PICKUP' | 'STORE_DROP_OFF';
  scheduledDate: string;
  timeSlot: string;
  serviceCategory: string;
  estimatedWeightOrQty: string;
  estimatedCost: number;
  pickupAddress?: string;
  branchName?: string;
  notes?: string;
}): string {
  const isHomePickup = booking.bookingType === 'HOME_PICKUP';
  return (
    `🛵 *CleanTrack - Konfirmasi Booking Laundry* 🛵\n\n` +
    `Halo *${booking.customerName}*,\n` +
    `Booking Anda *${booking.bookingNumber}* berhasil kami jadwalkan!\n\n` +
    `📦 *Tipe Layanan:* ${booking.serviceCategory} (${booking.estimatedWeightOrQty})\n` +
    `📅 *Jadwal:* ${booking.scheduledDate} • Slot ${booking.timeSlot}\n` +
    `📍 *Lokasi:* ${isHomePickup ? 'Jemput ke Rumah: ' + (booking.pickupAddress || 'Alamat Terdaftar') : 'Fast-Track Drop-Off di: ' + (booking.branchName || 'CleanTrack Munggu Bali Hub')}\n` +
    `💰 *Estimasi Biaya:* ${formatRupiah(booking.estimatedCost)}\n` +
    (booking.notes ? `📝 *Catatan Khusus:* ${booking.notes}\n` : '') +
    `\nKurir / tim CleanTrack akan menghubungi WhatsApp ini 15 menit sebelum waktu penjemputan. Terima kasih!`
  );
}

export function buildCustomerInquiryMessage(orderNumber: string, customerName?: string): string {
  return `Halo CleanTrack Bot! 👋\nSaya ingin menanyakan update status cucian saya dengan nomor nota *${orderNumber}*${customerName ? ` atas nama *${customerName}*` : ''}.\nApakah pakaian saya sudah selesai dan bisa diambil? Terima kasih!`;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62') && cleanPhone.length >= 9) {
    cleanPhone = '62' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Gentle Web Audio synthesizer chime for incoming alert notifications
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.12, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch {
    // AudioContext might be blocked before first user interaction
  }
}
