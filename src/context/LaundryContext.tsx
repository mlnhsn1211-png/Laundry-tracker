import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LaundryOrder,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderItem,
  LaundryBooking,
} from '../types';
import { INITIAL_ORDERS, INITIAL_BOOKINGS } from '../data/mockData';
import {
  buildWhatsAppMessage,
  buildBookingWhatsAppMessage,
  WhatsAppAlertType,
  playNotificationChime,
} from '../utils/formatters';

interface TrackResult {
  success: boolean;
  order?: LaundryOrder;
  error?: string;
}

export interface NotificationToast {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  message: string;
  pickupCode: string;
  totalPrice: number;
  timestamp: string;
  alertType?: WhatsAppAlertType;
}

interface LaundryContextType {
  orders: LaundryOrder[];
  currentOrder: LaundryOrder | null;
  customerHistory: LaundryOrder[];
  bookings: LaundryBooking[];
  lastSearchedPhone: string;
  activeNotification: NotificationToast | null;
  notificationHistory: NotificationToast[];
  dismissNotification: () => void;
  trackOrder: (orderQuery: string, phoneQuery: string) => TrackResult;
  selectOrder: (order: LaundryOrder | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  markOrderAsPaid: (orderId: string, method?: PaymentMethod) => void;
  verifyPickup: (codeOrToken: string) => { valid: boolean; order?: LaundryOrder; error?: string };
  confirmHandover: (orderId: string, staffName?: string) => { success: boolean; message: string };
  createOrder: (orderData: Partial<LaundryOrder> & { items: OrderItem[] }) => LaundryOrder;
  createBooking: (
    bookingData: Omit<LaundryBooking, 'id' | 'bookingNumber' | 'createdAt' | 'status'>
  ) => LaundryBooking;
  cancelBooking: (bookingId: string) => void;
  sendWhatsAppCustomUpdate: (
    orderId: string,
    customNote: string,
    newStatus?: OrderStatus,
    targetPhone?: string
  ) => void;
  simulateBotReply: (order: LaundryOrder) => void;
  resetToMockData: () => void;
  triggerMockWhatsAppAlert: (
    order: LaundryOrder,
    alertType?: WhatsAppAlertType,
    targetPhone?: string
  ) => void;
}

const STORAGE_KEY = 'cleantrack_laundry_orders_v4';

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<LaundryOrder[]>(() => {
    try {
      // Clear legacy storage if present
      localStorage.removeItem('cleantrack_laundry_orders_v1');
      localStorage.removeItem('pokewash_laundry_orders_20th_v2');
      localStorage.removeItem('cleantrack_laundry_orders_20th_v3');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((ord: any) => ({
            ...ord,
            branchName: 'CleanTrack Laundry - Munggu Bali Hub',
            branchAddress: 'Jl. Raya Munggu, Munggu, Kecamatan Mengwi, Kabupaten Badung, Bali',
          }));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [currentOrder, setCurrentOrder] = useState<LaundryOrder | null>(() => {
    // Default initial preview: Maulan's ready order #LDR-10293
    return INITIAL_ORDERS[0] || null;
  });

  const [lastSearchedPhone, setLastSearchedPhone] = useState<string>('081234567890');
  const [activeNotification, setActiveNotification] = useState<NotificationToast | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<NotificationToast[]>([]);
  const [bookings, setBookings] = useState<LaundryBooking[]>(() => {
    try {
      const saved = localStorage.getItem('cleantrack_bookings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cleantrack_bookings_v1', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Auto-detect and resolve order from URL query parameters (e.g. ?order=#LDR-10293 or ?code=4821 or ?phone=0812...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const orderParam = params.get('order') || params.get('ord') || params.get('id');
      const pickupParam = params.get('pickup') || params.get('code');
      const phoneParam = params.get('phone') || params.get('tel');

      if (orderParam || pickupParam || phoneParam) {
        const found = orders.find((o) => {
          if (orderParam) {
            const cleanO = orderParam.trim().toUpperCase().replace('#', '');
            const oNum = o.orderNumber.toUpperCase().replace('#', '');
            if (oNum === cleanO || oNum.endsWith(cleanO) || o.id.toUpperCase() === cleanO) return true;
          }
          if (pickupParam && o.pickupCode === pickupParam.trim()) return true;
          if (phoneParam) {
            const cleanP = phoneParam.replace(/\D/g, '');
            const oPhone = o.customerPhone.replace(/\D/g, '');
            if (cleanP && (cleanP.endsWith(oPhone) || oPhone.endsWith(cleanP))) return true;
          }
          return false;
        });

        if (found) {
          setCurrentOrder(found);
          setLastSearchedPhone(found.customerPhone);
        }
      }
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Keep currentOrder updated if orders state changes
  useEffect(() => {
    if (currentOrder) {
      const updated = orders.find((o) => o.id === currentOrder.id);
      if (updated) {
        setCurrentOrder(updated);
      }
    }
  }, [orders]);

  // Derive customer history based on last searched phone or current order's phone
  const customerPhone = currentOrder?.customerPhone || lastSearchedPhone;
  const customerHistory = orders.filter(
    (o) =>
      o.customerPhone.replace(/\D/g, '') === customerPhone.replace(/\D/g, '') &&
      o.id !== currentOrder?.id
  );

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const triggerMockWhatsAppAlert = (
    order: LaundryOrder,
    alertType: WhatsAppAlertType = 'READY',
    targetPhone?: string
  ) => {
    const phoneToUse = targetPhone || order.customerPhone;
    const msg = buildWhatsAppMessage(
      {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        pickupCode: order.pickupCode,
        paymentStatus: order.paymentStatus,
        status: order.status,
        branchName: order.branchName,
        branchAddress: order.branchAddress,
        estimatedReadyAt: order.estimatedReadyAt,
        itemsCount: order.items.length,
      },
      alertType
    );

    playNotificationChime();

    const toast: NotificationToast = {
      id: Date.now().toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: phoneToUse,
      message: msg,
      pickupCode: order.pickupCode,
      totalPrice: order.totalPrice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      alertType,
    };

    setActiveNotification(toast);
    setNotificationHistory((prev) => [toast, ...prev.slice(0, 9)]);
  };

  const trackOrder = (orderQuery: string, phoneQuery: string): TrackResult => {
    const cleanOrder = orderQuery.trim().toUpperCase().replace('#', '');
    const cleanPhone = phoneQuery.trim().replace(/\D/g, '');

    if (!cleanOrder && !cleanPhone) {
      return {
        success: false,
        error: 'Please enter both Order ID and Phone Number.',
      };
    }

    const found = orders.find((o) => {
      const oNum = o.orderNumber.toUpperCase().replace('#', '');
      const oPhone = o.customerPhone.replace(/\D/g, '');
      const oId = o.id.toUpperCase();

      const orderMatches = oNum === cleanOrder || oId === cleanOrder || oNum.endsWith(cleanOrder);
      const phoneMatches = oPhone.endsWith(cleanPhone) || cleanPhone.endsWith(oPhone);

      return orderMatches && phoneMatches;
    });

    if (found) {
      setCurrentOrder(found);
      setLastSearchedPhone(found.customerPhone);
      return { success: true, order: found };
    }

    return {
      success: false,
      error: "We couldn't find your order. Please check your Order ID and phone number.",
    };
  };

  const selectOrder = (order: LaundryOrder | null) => {
    setCurrentOrder(order);
    if (order) {
      setLastSearchedPhone(order.customerPhone);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const newHistoryItem = {
          status: newStatus,
          timestamp: nowStr,
          note: note || `Status updated to ${newStatus}`,
        };

        const updatedOrder: LaundryOrder = {
          ...order,
          status: newStatus,
          updatedAt: nowStr,
          pickedUpAt: newStatus === 'PICKED_UP' ? nowStr : order.pickedUpAt,
          statusHistory: [...order.statusHistory, newHistoryItem],
        };

        // If transitioning to READY, trigger the important Ready Notification (PRD Section 7.2 & 13)
        if (newStatus === 'READY' && order.status !== 'READY') {
          triggerMockWhatsAppAlert(updatedOrder);
        }

        return updatedOrder;
      })
    );
  };

  const markOrderAsPaid = (orderId: string, method: PaymentMethod = 'QRIS') => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          paymentStatus: 'PAID',
          paymentMethod: method,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
      })
    );
  };

  const verifyPickup = (codeOrToken: string) => {
    const query = codeOrToken.trim().toUpperCase();
    if (!query) {
      return { valid: false, error: 'Please enter a pickup code or scan a QR code.' };
    }

    const order = orders.find((o) => {
      return (
        o.pickupCode === query ||
        o.orderNumber.toUpperCase() === query ||
        o.orderNumber.toUpperCase().replace('#', '') === query ||
        o.qrToken === query
      );
    });

    if (!order) {
      return {
        valid: false,
        error: 'No order matched this pickup code or QR token.',
      };
    }

    if (order.status === 'PICKED_UP') {
      return {
        valid: false,
        order,
        error: 'This order has already been picked up.',
      };
    }

    if (order.status !== 'READY') {
      return {
        valid: false,
        order,
        error: `Order is not ready for pickup yet (Current status: ${order.status}).`,
      };
    }

    return { valid: true, order };
  };

  const confirmHandover = (orderId: string, staffName: string = 'Staff Counter') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    if (order.status !== 'READY') {
      return {
        success: false,
        message: 'Only orders marked READY can be handed over and completed.',
      };
    }

    updateOrderStatus(
      orderId,
      'PICKED_UP',
      `Handover verified and completed by ${staffName}`
    );

    return { success: true, message: 'Order successfully marked as Picked Up!' };
  };

  const createOrder = (
    orderData: Partial<LaundryOrder> & { items: OrderItem[] }
  ): LaundryOrder => {
    const nextNum = 10450 + Math.floor(Math.random() * 500);
    const orderNumber = `#LDR-${nextNum}`;
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const calculatedTotal = orderData.items.reduce((sum, it) => sum + it.subtotal, 0);

    const newOrder: LaundryOrder = {
      id: `ord-${nextNum}`,
      orderNumber,
      customerName: orderData.customerName || 'New Customer',
      customerPhone: orderData.customerPhone || '081234567890',
      customerEmail: orderData.customerEmail,
      status: 'RECEIVED',
      paymentStatus: orderData.paymentStatus || 'UNPAID',
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      totalPrice: calculatedTotal,
      estimatedReadyAt: orderData.estimatedReadyAt || 'Tomorrow, 16:00',
      createdAt: nowStr,
      updatedAt: nowStr,
      pickupCode,
      qrToken: `QR-${orderNumber.replace('#', '')}-${pickupCode}-VERIFIED`,
      branchName: 'CleanTrack Laundry - Munggu Bali Hub',
      branchAddress: 'Jl. Raya Munggu, Munggu, Kecamatan Mengwi, Kabupaten Badung, Bali',
      notes: orderData.notes || '',
      statusHistory: [
        {
          status: 'RECEIVED',
          timestamp: nowStr,
          note: 'Drop-off order created by counter staff',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const createBooking = (
    bookingData: Omit<LaundryBooking, 'id' | 'bookingNumber' | 'createdAt' | 'status'>
  ): LaundryBooking => {
    const nextNum = 8300 + Math.floor(Math.random() * 500);
    const bookingNumber = `#BK-${nextNum}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newBooking: LaundryBooking = {
      ...bookingData,
      id: `bk-${nextNum}`,
      bookingNumber,
      status: 'CONFIRMED',
      createdAt: nowStr,
      assignedCourier:
        bookingData.bookingType === 'HOME_PICKUP'
          ? {
              name: 'Dimas Kurniawan',
              phone: '081298881234',
              vehiclePlate: 'B 4192 SXZ',
              rating: 4.9,
            }
          : undefined,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send WhatsApp notification alert
    const waMessage = buildBookingWhatsAppMessage(newBooking);
    playNotificationChime();
    const toast: NotificationToast = {
      id: Date.now().toString(),
      orderNumber: bookingNumber,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      message: waMessage,
      pickupCode: bookingNumber.replace('#BK-', ''),
      totalPrice: newBooking.estimatedCost,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      alertType: 'BOOKING_CONFIRMATION',
    };
    setActiveNotification(toast);
    setNotificationHistory((prev) => [toast, ...prev.slice(0, 9)]);

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b))
    );
  };

  const sendWhatsAppCustomUpdate = (
    orderId: string,
    customNote: string,
    newStatus?: OrderStatus,
    targetPhone?: string
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (newStatus && newStatus !== order.status) {
      updateOrderStatus(orderId, newStatus, customNote);
    }

    const targetStatus = newStatus || order.status;
    const phoneToUse = targetPhone || order.customerPhone;
    const msg = buildWhatsAppMessage(
      {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        pickupCode: order.pickupCode,
        paymentStatus: order.paymentStatus,
        status: targetStatus,
        branchName: order.branchName,
        branchAddress: order.branchAddress,
        estimatedReadyAt: order.estimatedReadyAt,
        itemsCount: order.items.length,
        customNote,
      },
      'CUSTOM_UPDATE'
    );

    playNotificationChime();
    const toast: NotificationToast = {
      id: Date.now().toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: phoneToUse,
      message: msg,
      pickupCode: order.pickupCode,
      totalPrice: order.totalPrice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      alertType: 'CUSTOM_UPDATE',
    };
    setActiveNotification(toast);
    setNotificationHistory((prev) => [toast, ...prev.slice(0, 9)]);
  };

  const simulateBotReply = (order: LaundryOrder) => {
    const msg =
      `🤖 *CleanTrack WhatsApp Bot - Live Status Reply*\n\n` +
      `Halo *${order.customerName}*! Status cucian *${order.orderNumber}*:\n` +
      `⚡ *Tahap Saat Ini:* *${order.status}*\n` +
      `🕒 *Target Selesai:* ${order.estimatedReadyAt}\n` +
      `🎟️ *Kode Pengambilan:* *${order.pickupCode}*\n` +
      `💰 *Status Pembayaran:* ${order.paymentStatus} (${order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'})\n\n` +
      `Buka pass digital langsung:\n${window.location.origin}?order=${encodeURIComponent(order.orderNumber)}`;

    playNotificationChime();
    const toast: NotificationToast = {
      id: Date.now().toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      message: msg,
      pickupCode: order.pickupCode,
      totalPrice: order.totalPrice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      alertType: 'STATUS_INQUIRY',
    };
    setActiveNotification(toast);
    setNotificationHistory((prev) => [toast, ...prev.slice(0, 9)]);
  };

  const resetToMockData = () => {
    setOrders(INITIAL_ORDERS);
    setCurrentOrder(INITIAL_ORDERS[0]);
    setBookings(INITIAL_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cleantrack_bookings_v1');
  };

  return (
    <LaundryContext.Provider
      value={{
        orders,
        currentOrder,
        customerHistory,
        bookings,
        lastSearchedPhone,
        activeNotification,
        notificationHistory,
        dismissNotification,
        trackOrder,
        selectOrder,
        updateOrderStatus,
        markOrderAsPaid,
        verifyPickup,
        confirmHandover,
        createOrder,
        createBooking,
        cancelBooking,
        sendWhatsAppCustomUpdate,
        simulateBotReply,
        resetToMockData,
        triggerMockWhatsAppAlert,
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundry = () => {
  const context = useContext(LaundryContext);
  if (!context) {
    throw new Error('useLaundry must be used within a LaundryProvider');
  }
  return context;
};
