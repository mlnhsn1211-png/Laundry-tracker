export type OrderStatus =
  | 'RECEIVED'
  | 'WASHING'
  | 'DRYING'
  | 'IRONING'
  | 'READY'
  | 'PICKED_UP'
  | 'DELAYED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentMethod =
  | 'QRIS'
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'ONLINE_GATEWAY';

export interface OrderItem {
  id: string;
  serviceName: string;
  weightOrQty: number;
  unit: 'kg' | 'pcs' | 'set';
  unitPrice: number;
  subtotal: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface LaundryOrder {
  id: string;
  orderNumber: string; // e.g. #LDR-10293
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  totalPrice: number;
  estimatedReadyAt: string; // formatted or ISO
  createdAt: string;
  updatedAt: string;
  pickedUpAt?: string;
  pickupCode: string; // e.g. 4821
  qrToken: string;
  branchName: string;
  branchAddress: string;
  notes?: string;
  statusHistory: StatusHistoryItem[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'STAFF' | 'MANAGER';
}
