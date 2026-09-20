import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-context';
import { Order, OrderStatus } from '@/types';

export const AdminOrdersPage: React.FC = () => {
  const { orders, isLoading, updateStatus, updateTracking } = useOrders();
  const toast = useToast();

  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = activeStatusTab === 'all' || ord.status === activeStatusTab;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateStatus(orderId, status);
    toast.success('Estado actualizado', `Orden #${orderId} cambió a ${status}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleAssignTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !trackingCode.trim()) return;
    await updateTracking(selectedOrder.id, trackingCode.trim(), 'Chilexpress');
    toast.success('Seguimiento guardado', `Guía ${trackingCode} asignada`);
    setSelectedOrder({ ...selectedOrder, trackingNumber: trackingCode.trim(), status: 'shipped' });
    setTrackingCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Gestión de Pedidos ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Control de despachos, asignación de guías de courier y monitoreo de pagos.
        </p>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-card rounded-2xl border border-border">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'confirmed', label: 'Confirmados' },
            { id: 'processing', label: 'En Preparación' },
            { id: 'shipped', label: 'En Tránsito' },
            { id: 'delivered', label: 'Entregados' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeStatusTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por # de orden (AURA-2026-1001), nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Orden</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Artículos</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Pago</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No hay pedidos con el filtro actual.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground">{ord.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">{ord.customerName}</p>
                      <p className="text-[11px] text-muted-foreground">{ord.customerEmail}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="p-4">{ord.items.length} unids.</td>
                    <td className="p-4 font-black text-foreground">{formatCurrency(ord.total)}</td>
                    <td className="p-4">
                      <Badge variant="success" className="text-[10px] uppercase font-bold">
                        {ord.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          ord.status === 'delivered'
                            ? 'success'
                            : ord.status === 'shipped'
                            ? 'accent'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(ord)}
                        className="gap-1.5 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Ver</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-xs font-mono text-muted-foreground">Detalle de Pedido</span>
                <h3 className="text-lg font-black text-foreground">
                  Orden #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Change Status Fast Actions */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Cambiar Estado Operacional
              </label>
              <div className="flex flex-wrap gap-2">
                {(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        selectedOrder.status === st
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-card border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Courier Assignment Form */}
            <form onSubmit={handleAssignTracking} className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Asignar Guía de Despacho (Courier)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: CHX-998234123"
                  value={trackingCode || selectedOrder.trackingNumber || ''}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground font-mono"
                />
                <Button type="submit" variant="outline" size="sm">
                  Guardar Guía
                </Button>
              </div>
            </form>

            {/* Products Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Artículos ({selectedOrder.items.length})
              </h4>
              <div className="rounded-xl border border-border divide-y divide-border">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-10 w-10 rounded-lg object-cover bg-muted border border-border"
                      />
                      <div>
                        <p className="font-bold text-foreground">{item.productName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-1 text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Dirección de Destino:</p>
              <p>{selectedOrder.shippingAddress.street} #{selectedOrder.shippingAddress.number}, {selectedOrder.shippingAddress.apartment}</p>
              <p>{selectedOrder.shippingAddress.commune}, {selectedOrder.shippingAddress.city}</p>
              <p>Receptor: {selectedOrder.customerName} ({selectedOrder.shippingAddress.phone})</p>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-border">
              <div className="text-xs">
                <span className="text-muted-foreground">Total de la orden:</span>{' '}
                <strong className="text-base font-black text-primary">
                  {formatCurrency(selectedOrder.total)}
                </strong>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Cerrar Detalle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
