import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { promotionService } from '@/services/promotion.service';
import { useToast } from '@/components/ui/toast-context';

export const CartDrawer: React.FC = () => {
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();
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
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const progress = getFreeShippingProgress();
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const res = await promotionService.validateCoupon(couponInput, subtotal);
      if (res.valid && res.promotion) {
        applyCoupon(res.promotion, res.discountAmount);
        toast.success('Cupón aplicado', res.message);
        setCouponInput('');
      } else {
        toast.error('Cupón inválido', res.message);
      }
    } catch {
      toast.error('Error', 'No se pudo aplicar el cupón');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleGoToCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleGoToCart = () => {
    setCartDrawerOpen(false);
    navigate('/cart');
  };

  if (!cartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCartDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl border-l border-border z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Tu Carrito ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="border-b border-border bg-muted/40 px-5 py-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" />
              {diffToFreeShipping === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ¡Felicitaciones! Tienes Envío Gratis
                </span>
              ) : (
                <span>
                  Te faltan <strong className="text-foreground">{formatCurrency(diffToFreeShipping)}</strong> para envío gratis
                </span>
              )}
            </span>
            <span className="font-semibold text-xs">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                diffToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border/60">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Tu carrito está vacío</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Explora nuestras colecciones exclusivas y agrega tus productos favoritos.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-5"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/catalog');
                }}
              >
                Ver Catálogo
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const unitPrice = item.variant?.price || item.product.price;
              const image = item.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200';

              return (
                <div key={item.id} className="py-4 flex gap-3.5 items-start">
                  <img
                    src={image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover bg-muted/40 border border-border/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={() => setCartDrawerOpen(false)}
                      className="text-xs font-semibold text-foreground hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Variante: {item.variant.name}
                      </p>
                    )}
                    <div className="mt-1 font-bold text-xs text-foreground">
                      {formatCurrency(unitPrice)}
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-input rounded-md bg-background">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-md"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-md"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Coupon, Totals & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border bg-card p-5 space-y-4">
            {/* Coupon Code Section */}
            {coupon ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Cupón <strong>{coupon.code}</strong> aplicado</span>
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
                  placeholder="Código de cupón (ej: BIENVENIDO10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs uppercase rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  isLoading={isApplyingCoupon}
                  disabled={!couponInput.trim()}
                >
                  Aplicar
                </Button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Descuento</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Envío estimado</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GRATIS</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                <span>Total Estimado</span>
                <span className="text-base text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" size="md" onClick={handleGoToCart}>
                Ver Carrito
              </Button>
              <Button variant="primary" size="md" onClick={handleGoToCheckout} className="gap-2">
                <span>Pagar</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Trust Seal */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Compra 100% segura con garantía oficial AURA</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
