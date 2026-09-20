import { Order, OrderStatus } from '@/types';
import { delay, getStoredOrders, saveStoredOrders } from '@/mocks/api';

export const orderService = {
  async getOrders(customerId?: string): Promise<Order[]> {
    await delay(300);
    const orders = getStoredOrders();
    if (customerId) {
      return orders.filter((o) => o.customerId === customerId);
    }
    return orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    await delay(250);
    const orders = getStoredOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Promise<Order> {
    await delay(500);
    const orders = getStoredOrders();
    const orderNumber = `AURA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      trackingNumber: `TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
      timeline: [
        {
          status: 'pending',
          label: 'Pedido realizado',
          date: formattedDate,
          description: 'Orden ingresada al sistema de AURA',
          completed: true,
        },
        {
          status: 'confirmed',
          label: 'Confirmado',
          date: formattedDate,
          description: `Pago procesado exitosamente vía ${orderData.paymentMethod.replace('_', ' ').toUpperCase()}`,
          completed: true,
          current: true,
        },
        {
          status: 'processing',
          label: 'Preparando pedido',
          date: 'Pendiente',
          description: 'Control de calidad y embalaje en centro de distribución',
          completed: false,
        },
        {
          status: 'shipped',
          label: 'Enviado',
          date: 'Pendiente',
          description: 'Despachado con número de seguimiento asignado',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Entregado',
          date: 'Pendiente',
          description: 'Recepción conforme en domicilio',
          completed: false,
        },
      ],
    };

    saveStoredOrders([newOrder, ...orders]);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    await delay(300);
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Pedido no encontrado');

    const order = orders[index];
    order.status = status;
    // update timeline items
    const nowStr = new Date().toISOString().split('T')[0];
    order.timeline = order.timeline.map((t) => {
      if (t.status === status) {
        return { ...t, completed: true, current: true, date: nowStr };
      }
      return t;
    });

    orders[index] = order;
    saveStoredOrders([...orders]);
    return order;
  },

  async updateTracking(id: string, trackingNumber: string, _courier?: string): Promise<Order> {
    await delay(250);
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Pedido no encontrado');

    const order = orders[index];
    order.trackingNumber = trackingNumber;
    order.status = 'shipped';
    const nowStr = new Date().toISOString().split('T')[0];
    order.timeline = order.timeline.map((t) => {
      if (t.status === 'shipped') {
        return { ...t, completed: true, current: true, date: nowStr, description: `Despachado vía ${_courier || 'Courier'} con guía #${trackingNumber}` };
      }
      return t;
    });

    orders[index] = order;
    saveStoredOrders([...orders]);
    return order;
  },
};
