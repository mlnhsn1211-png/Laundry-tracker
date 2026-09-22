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

export function buildWhatsAppMessage(order: {
  customerName: string;
  orderNumber: string;
  totalPrice: number;
  pickupCode: string;
  orderUrl?: string;
}): string {
  const url = order.orderUrl || window.location.origin;
  return `Hi ${order.customerName}! Your laundry order *${order.orderNumber}* is ready for pickup.\nTotal: *${formatRupiah(order.totalPrice)}*\nPickup Code: *${order.pickupCode}*\n\nTap here to view your order and pickup details:\n${url}?order=${encodeURIComponent(order.orderNumber)}`;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  // normalize Indonesian phone number e.g. 08123... -> 628123...
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
