import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { promotionService } from '@/services/promotion.service';
import { useToast } from '@/components/ui/toast-context';
import { mockProducts } from '@/data/products';

export const CartPage: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingCost,
    getTotal,
    discountAmount,
    coupon,
    applyCoupon,
    removeCoupon,
    getFreeShippingProgress,
    freeShippingThreshold,
    addItem,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const progress = getFreeShippingProgress();
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Recommended items
  const suggestedAccessories = mockProducts
    .filter((p) => p.category === 'cat-desk' || p.category === 'cat-gaming')
    .slice(0, 3);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const res = await promotionService.validateCoupon(couponCode, subtotal);
      if (res.valid && res.promotion) {
        applyCoupon(res.promotion, res.discountAmount);
        toast.success('¡Cupón aplicado!', res.message);
        setCouponCode('');
      } else {
        toast.error('Cupón inválido', res.message);
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Tu carrito está vacío</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 mb-6">
          Aún no has agregado ningún hardware a tu compra. Descubre nuestras colecciones de ingeniería.
        </p>
        <Button asChild variant="primary" size="lg">
          <Link to="/catalog">Explorar Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Title & Return */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Carrito de Compras ({items.reduce((acc, i) => acc + i.quantity, 0)} artículos)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Revisa los artículos seleccionados antes de pasar a la confirmación de envío y pago.
          </p>
        </div>
        <Link
          to="/catalog"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continuar comprando</span>
        </Link>
      </div>

      {/* Free Shipping Meter */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span className="font-semibold text-foreground flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            {diffToFreeShipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ¡Calificas para despacho gratis a todo Chile!
              </span>
            ) : (
              <span>
                Agrega <strong className="text-foreground">{formatCurrency(diffToFreeShipping)}</strong> más para envío gratuito
              </span>
            )}
          </span>
          <span className="font-bold">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              diffToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {items.map((item) => {
              const unitPrice = item.variant?.price || item.product.price;
              const lineTotal = unitPrice * item.quantity;
              const image = item.product.images[0];

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <img
                    src={image}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-xl object-cover bg-muted border border-border/80 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="block text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">
                        Color / Modelo: <strong>{item.variant.name}</strong>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground sm:hidden">
                      Precio Unitario: {formatCurrency(unitPrice)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-input rounded-xl bg-background shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      title="Reducir cantidad"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      title="Aumentar cantidad"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Line Total Price */}
                  <div className="text-right shrink-0 min-w-[100px]">
                    <span className="text-base font-black text-foreground block">
                      {formatCurrency(lineTotal)}
                    </span>
                    <span className="text-[11px] text-muted-foreground hidden sm:block">
                      {item.quantity}x {formatCurrency(unitPrice)}
                    </span>
                  </div>

                  {/* Remove item button */}
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.id);
                      toast.info('Producto removido del carrito');
                    }}
                    className="p-2 text-muted-foreground hover:text-rose-500 transition-colors self-end sm:self-center"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Add Suggestions */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Accesorios recomendados para complementar tu setup</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedAccessories.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-border bg-card flex items-center gap-3"
                >
                  <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                    <p className="text-xs font-black text-primary">{formatCurrency(p.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(p, p.variants?.[0], 1);
                      toast.success('¡Añadido al carrito!', p.name);
                    }}
                    className="h-8 w-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shrink-0"
                    title="Añadir accesorio"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
              Resumen de la Orden
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal de productos</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Descuento aplicado ({coupon?.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Costo de envío estimado</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATIS</span>
                  ) : (
                    <span className="font-semibold text-foreground">{formatCurrency(shipping)}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>IVA Incluido (19%)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(Math.round(total * 0.19))}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="text-base font-extrabold text-foreground">Total a Pagar</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon Application */}
            <div className="pt-2 border-t border-border space-y-2">
              <label className="text-xs font-semibold text-foreground block">¿Tienes un cupón?</label>
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="h-4 w-4" />
                    <span>{coupon.code} ({coupon.discountType === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código (ej: BIENVENIDO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 uppercase text-xs rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button type="submit" variant="outline" size="sm" isLoading={isApplying}>
                    Aplicar
                  </Button>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2 font-bold"
              onClick={() => navigate('/checkout')}
            >
              <span>Continuar al Pago</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Trust Badges */}
            <div className="space-y-2 pt-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Transacción segura y encriptada SSL de 256 bits</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Despacho con seguro de extravío total incluido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
