import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { orderService } from '@/services/order.service';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [inputQuery, setInputQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsLoading(true);
    setSearched(true);
    try {
      const found = await orderService.getOrderById(queryToSearch.trim());
      setOrder(found);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const param = searchParams.get('order');
    if (param) {
      setInputQuery(param);
      handleSearch(param);
    } else {
      // Default demo order
      handleSearch('AURA-2026-1001');
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-10">
      {/* Title */}
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Seguimiento de Pedido en Vivo
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Ingresa tu número de orden (ej: AURA-2026-1001) o código de seguimiento de courier.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(inputQuery);
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="AURA-2026-1001"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          Buscar
        </Button>
      </form>

      {/* Search Result */}
      {order ? (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Top Order Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Orden Oficial AURA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">{order.orderNumber}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fecha de compra: {new Date(order.createdAt).toLocaleDateString('es-CL')}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <Badge
                variant={
                  order.status === 'delivered'
                    ? 'success'
                    : order.status === 'shipped'
                    ? 'accent'
                    : 'secondary'
                }
                className="text-xs uppercase font-bold px-3 py-1"
              >
                {order.status === 'delivered'
                  ? 'Entregado'
                  : order.status === 'shipped'
                  ? 'En Despacho'
                  : order.status === 'processing'
                  ? 'Preparando'
                  : 'Confirmado'}
              </Badge>
              {order.trackingNumber && (
                <span className="text-xs text-muted-foreground font-mono">
                  Guía Courier: {order.trackingNumber}
                </span>
              )}
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Línea de Tiempo del Envío
            </h3>
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-card ${
                      step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-foreground">{step.label}</p>
                      {step.date && (
                        <span className="text-[11px] text-muted-foreground">({step.date})</span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Dirección de Entrega</span>
              </h4>
              <p className="text-muted-foreground">
                {order.shippingAddress.street} #{order.shippingAddress.number},{' '}
                {order.shippingAddress.apartment}
              </p>
              <p className="text-muted-foreground">
                {order.shippingAddress.commune}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.region}
              </p>
              <p className="text-muted-foreground">Receptor: {order.customerName}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span>Productos en el paquete ({order.items.length})</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-muted-foreground">
                    <span className="truncate max-w-[200px]">{item.quantity}x {item.productName}</span>
                    <span className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        searched && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card">
            <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">No encontramos esa orden</p>
            <p className="text-xs text-muted-foreground mt-1">
              Verifica haber escrito el código completo como <strong>AURA-2026-1001</strong> o <strong>AURA-2026-1002</strong>.
            </p>
          </div>
        )
      )}
    </div>
  );
};
