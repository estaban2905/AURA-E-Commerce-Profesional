import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';

export function useOrders(customerId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders(customerId);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener órdenes');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  };

  const updateTracking = async (orderId: string, trackingNumber: string, courier?: string) => {
    const updated = await orderService.updateTracking(orderId, trackingNumber, courier);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  };

  return { orders, isLoading, error, refetch: fetchOrders, updateStatus, updateTracking };
}

export function useCustomerOrders(customerId: string) {
  return useOrders(customerId);
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    orderService.getOrderById(orderId).then((res) => {
      if (mounted) {
        setOrder(res);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [orderId]);

  return { order, isLoading };
}
