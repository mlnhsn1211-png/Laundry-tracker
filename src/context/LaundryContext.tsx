import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LaundryOrder,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderItem,
} from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { buildWhatsAppMessage } from '../utils/formatters';

interface TrackResult {
  success: boolean;
  order?: LaundryOrder;
  error?: string;
}

interface NotificationToast {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  message: string;
  pickupCode: string;
  totalPrice: number;
  timestamp: string;
}

interface LaundryContextType {
  orders: LaundryOrder[];
  currentOrder: LaundryOrder | null;
  customerHistory: LaundryOrder[];
  lastSearchedPhone: string;
  activeNotification: NotificationToast | null;
  dismissNotification: () => void;
  trackOrder: (orderQuery: string, phoneQuery: string) => TrackResult;
  selectOrder: (order: LaundryOrder | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  markOrderAsPaid: (orderId: string, method?: PaymentMethod) => void;
  verifyPickup: (codeOrToken: string) => { valid: boolean; order?: LaundryOrder; error?: string };
  confirmHandover: (orderId: string, staffName?: string) => { success: boolean; message: string };
  createOrder: (orderData: Partial<LaundryOrder> & { items: OrderItem[] }) => LaundryOrder;
  resetToMockData: () => void;
  triggerMockWhatsAppAlert: (order: LaundryOrder) => void;
}

const STORAGE_KEY = 'cleantrack_laundry_orders_v1';

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<LaundryOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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

  const triggerMockWhatsAppAlert = (order: LaundryOrder) => {
    const msg = buildWhatsAppMessage({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      pickupCode: order.pickupCode,
    });

    setActiveNotification({
      id: Date.now().toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      message: msg,
      pickupCode: order.pickupCode,
      totalPrice: order.totalPrice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
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
      branchName: 'CleanTrack Laundry - Central Hub',
      branchAddress: 'Jl. Surya Kencana No. 42, Kebayoran, Jakarta Selatan',
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

  const resetToMockData = () => {
    setOrders(INITIAL_ORDERS);
    setCurrentOrder(INITIAL_ORDERS[0]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <LaundryContext.Provider
      value={{
        orders,
        currentOrder,
        customerHistory,
        lastSearchedPhone,
        activeNotification,
        dismissNotification,
        trackOrder,
        selectOrder,
        updateOrderStatus,
        markOrderAsPaid,
        verifyPickup,
        confirmHandover,
        createOrder,
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
