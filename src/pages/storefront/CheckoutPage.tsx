import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  Truck,
  MapPin,
  Check,
  ArrowRight,
  Lock,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { orderService } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-context';
import { PaymentMethod, ShippingMethod } from '@/types';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, getShippingCost, getTotal, discountAmount, coupon, clearCart } =
    useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    email: user?.email || 'nicolas.morales@example.com',
    firstName: user?.name || 'Nicolás',
    lastName: user?.lastName || 'Morales',
    phone: user?.phone || '+56 9 8765 4321',
    rut: '18.492.301-4',
    street: user?.addresses[0]?.street || 'Av. El Bosque Norte',
    number: user?.addresses[0]?.number || '0123',
    apartment: user?.addresses[0]?.apartment || 'Oficina 804',
    commune: user?.addresses[0]?.commune || 'Las Condes',
    city: 'Santiago',
    region: 'Región Metropolitana',
    notes: 'Dejar en conserjería si no respondo.',
    shippingMethod: 'standard' as ShippingMethod,
    paymentMethod: 'webpay' as PaymentMethod,
  });

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-2">No hay productos para pagar</h2>
        <p className="text-xs text-muted-foreground mb-6">
          Agrega productos a tu carrito antes de proceder a la pantalla de pago.
        </p>
        <Button asChild variant="primary">
          <Link to="/catalog">Ir al Catálogo</Link>
        </Button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Build order items
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        variantName: item.variant?.name,
        sku: item.variant?.sku || item.product.sku,
        price: item.variant?.price || item.product.price,
        quantity: item.quantity,
      }));

      const newOrder = await orderService.createOrder({
        customerId: user?.id || 'cust-01',
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: orderItems,
        subtotal,
        discount: discountAmount,
        shippingCost: shipping,
        tax: Math.round(total * 0.19),
        total,
        status: 'confirmed',
        shippingMethod: formData.shippingMethod,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          title: 'Dirección de Entrega',
          recipientName: `${formData.firstName} ${formData.lastName}`,
          street: formData.street,
          number: formData.number,
          apartment: formData.apartment,
          city: formData.city,
          commune: formData.commune,
          region: formData.region,
          postalCode: '7550000',
          phone: formData.phone,
          isDefault: true,
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'paid',
      });

      // Fire victory confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
      toast.success('¡Pago Aprobado!', `Orden #${newOrder.orderNumber} generada con éxito.`);
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    } catch (err: any) {
      toast.error('Error al procesar', 'No se pudo completar el pedido de prueba.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-base">
              A
            </div>
            <span className="font-display font-black text-xl tracking-tight text-foreground">
              AURA CHECKOUT
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-foreground">Proceso Seguro 256-bit</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Checkout Form Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Navigation Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-card border border-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  step === 1
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>1. Identificación</span>
              </button>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  step === 2
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>2. Despacho</span>
              </button>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  step === 3
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>3. Pago</span>
              </button>
            </div>

            {/* Step 1: Customer Info */}
            {step === 1 && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
                <h3 className="text-base font-bold text-foreground">1. Datos Personales & Facturación</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Apellidos"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Teléfono Móvil"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  <Input
                    label="RUT / DNI"
                    value={formData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setStep(2)}
                    className="gap-2"
                  >
                    <span>Continuar a Despacho</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address & Method */}
            {step === 2 && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
                <h3 className="text-base font-bold text-foreground">2. Dirección de Entrega</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Calle o Avenida"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Número"
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Depto / Oficina (opcional)"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">Comuna</label>
                    <select
                      value={formData.commune}
                      onChange={(e) => handleInputChange('commune', e.target.value)}
                      className="w-full h-10 text-xs rounded-lg border border-input bg-background px-3 text-foreground"
                    >
                      <option value="Las Condes">Las Condes</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Santiago Centro">Santiago Centro</option>
                      <option value="Vitacura">Vitacura</option>
                      <option value="Ñuñoa">Ñuñoa</option>
                      <option value="Viña del Mar">Viña del Mar</option>
                      <option value="Concepción">Concepción</option>
                    </select>
                  </div>
                  <div>
                    <Input
                      label="Ciudad"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                </div>

                {/* Shipping Method Radios */}
                <div className="pt-3 border-t border-border space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Método de Entrega
                  </label>
                  <div className="space-y-2.5">
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.shippingMethod === 'standard'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={() => handleInputChange('shippingMethod', 'standard')}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">Despacho Estándar (24 a 48 hrs)</p>
                          <p className="text-[11px] text-muted-foreground">Chilexpress o Starken con seguimiento</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {subtotal >= 50000 ? 'GRATIS' : '$3.990'}
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.shippingMethod === 'express'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={formData.shippingMethod === 'express'}
                          onChange={() => handleInputChange('shippingMethod', 'express')}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">Despacho Mismo Día (Same Day)</p>
                          <p className="text-[11px] text-muted-foreground">Entregas en RM comprando antes de las 13:00 hrs</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground">$5.990</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.shippingMethod === 'pickup'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={formData.shippingMethod === 'pickup'}
                          onChange={() => handleInputChange('shippingMethod', 'pickup')}
                          className="text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">Retiro Inmediato en Showroom</p>
                          <p className="text-[11px] text-muted-foreground">Av. El Bosque Norte 0123, Las Condes</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">GRATIS</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between">
                  <Button variant="outline" size="md" onClick={() => setStep(1)}>
                    Atrás
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setStep(3)} className="gap-2">
                    <span>Continuar al Pago</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
                <h3 className="text-base font-bold text-foreground">3. Método de Pago</h3>
                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'webpay'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'webpay'}
                      onChange={() => handleInputChange('paymentMethod', 'webpay')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">Webpay Plus (Débito y Crédito)</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted">Hasta 12 cuotas</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Transbank oficial. Tarjetas Visa, Mastercard, Magna, American Express.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'mercadopago'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'mercadopago'}
                      onChange={() => handleInputChange('paymentMethod', 'mercadopago')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">Mercado Pago</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Paga con dinero en cuenta, tarjetas guardadas o cuotas sin interés.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={() => handleInputChange('paymentMethod', 'bank_transfer')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">Transferencia Electrónica Directa</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Datos de cuenta corriente del Banco Santander provistos al finalizar.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Simulated Payment Trigger */}
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <Button variant="outline" size="md" onClick={() => setStep(2)}>
                    Atrás
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isProcessing}
                    onClick={handlePlaceOrder}
                    className="font-bold gap-2"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Pagar {formatCurrency(total)}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Review Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-foreground pb-3 border-b border-border">
                Artículos en tu orden ({items.length})
              </h3>

              {/* Items preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-border/60 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-lg object-cover bg-muted border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.variant?.price || item.product.price)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formatCurrency((item.variant?.price || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Descuento ({coupon?.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Costo de envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATIS</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm">
                  <span className="font-bold text-foreground">Total Final</span>
                  <span className="text-xl font-black text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">Garantía Oficial AURA</p>
                <p>Todos nuestros productos cuentan con 2 años de garantía contra defectos y 30 días de satisfacción o devolución.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
