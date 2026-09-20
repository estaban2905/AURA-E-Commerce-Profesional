import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Printer, Download, MapPin } from 'lucide-react';
import { useOrder } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, isLoading } = useOrder(orderId || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-3 text-xs text-muted-foreground">Cargando detalles de la confirmación...</p>
      </div>
    );
  }

  const orderNumber = order?.orderNumber || orderId || 'AURA-2026-1001';
  const items = order?.items || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-8">
      {/* Hero Success Badge */}
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Pago Exitoso & Confirmado
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
          ¡Gracias por tu compra en AURA!
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Hemos recibido tu pedido con el identificador <strong className="text-foreground">#{orderNumber}</strong>. Hemos enviado el comprobante a tu correo electrónico.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="primary" size="md">
            <Link to={`/tracking?order=${orderNumber}`} className="gap-2">
              <Truck className="h-4 w-4" />
              <span>Rastrear Despacho</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Recibo</span>
          </Button>
        </div>
      </div>

      {/* Order Timeline Visualizer */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Estado del Pedido en Tiempo Real
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">1. Confirmado</p>
              <p className="text-[10px] text-muted-foreground">Pago validado</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <PackageCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">2. En Preparación</p>
              <p className="text-[10px] text-muted-foreground">Embalaje con sello</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">3. En Tránsito</p>
              <p className="text-[10px] text-muted-foreground">Con courier</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">4. Entregado</p>
              <p className="text-[10px] text-muted-foreground">En tu domicilio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Payment summary */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Datos de Entrega</span>
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">{order?.customerName || 'Nicolás Morales'}</p>
            <p>{order?.shippingAddress.street} #{order?.shippingAddress.number}, {order?.shippingAddress.apartment}</p>
            <p>{order?.shippingAddress.commune}, {order?.shippingAddress.region}</p>
            <p>Teléfono: {order?.shippingAddress.phone || '+56 9 8765 4321'}</p>
            <p>Método de Envío: {order?.shippingMethod?.toUpperCase() || 'ESTÁNDAR (24-48 HRS)'}</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h4 className="text-sm font-bold text-foreground">Resumen del Pago</h4>
          <div className="text-xs space-y-1.5 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatCurrency(order?.subtotal || 229990)}</span>
            </div>
            {order?.discount && order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Despacho</span>
              <span className="text-emerald-600 font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
              <span>Total Pagado</span>
              <span className="text-primary text-base font-black">
                {formatCurrency(order?.total || 229990)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Return to store */}
      <div className="text-center pt-6">
        <Button asChild variant="outline">
          <Link to="/catalog">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  );
};
