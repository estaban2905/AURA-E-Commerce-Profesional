import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Check, ShoppingBag, Heart, Shield, RotateCcw, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useUIStore } from '@/store/ui.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-context';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, setCartDrawerOpen } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const activeVariant = product.variants?.[selectedVariantIndex];
  const price = activeVariant?.price || product.price;
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - price) / product.compareAtPrice!) * 100)
    : 0;

  const allImages = [
    ...(product.images || []),
    ...(product.variants?.map((v) => v.image).filter(Boolean) as string[] || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const currentImage = activeImageOverride || activeVariant?.image || allImages[0] || product.images[0];

  const handleAddToCart = () => {
    addItem(product, activeVariant, quantity);
    setIsAdded(true);
    toast.success('¡Agregado al carrito!', `${product.name} ha sido agregado.`);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
      setCartDrawerOpen(true);
    }, 600);
  };

  const handleViewFullProduct = () => {
    setQuickViewProduct(null);
    navigate(`/product/${product.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-card border border-border shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors bg-background/80 backdrop-blur-xs"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Media Column */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-muted/20 border-b md:border-b-0 md:border-r border-border">
          <div className="relative aspect-square w-full max-w-sm rounded-xl overflow-hidden bg-muted/30">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-3 left-3 font-semibold">
                -{discountPercent}% OFF
              </Badge>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto max-w-full pb-1">
              {allImages.map((img, idx) => {
                const isActive = currentImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageOverride(img);
                      const matchIdx = product.variants?.findIndex((v) => v.image === img);
                      if (matchIdx !== undefined && matchIdx >= 0) {
                        setSelectedVariantIndex(matchIdx);
                      }
                    }}
                    className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive ? 'border-primary ring-1 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto max-h-[500px] md:max-h-none">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {product.brand} • {product.sku}
          </div>

          <h2 className="text-xl font-bold text-foreground leading-tight mb-2">{product.name}</h2>

          <div className="flex items-center gap-3 mb-4">
            <Rating value={product.rating} showCount count={product.reviewsCount} />
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Agotado'}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-2xl font-extrabold text-foreground">{formatCurrency(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {product.shortDescription}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-4 space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Color / Acabado: <span className="font-normal text-muted-foreground">{activeVariant?.name}</span>
              </label>
              <div className="flex gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(i);
                      if (v.image) {
                        setActiveImageOverride(v.image);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedVariantIndex === i
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="h-3 w-3 rounded-full border border-black/20"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-auto pt-4 space-y-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-input rounded-lg bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 gap-2"
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Agregar al Carrito</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => toggleItem(product)}
                className={`p-2.5 rounded-lg border border-input text-foreground hover:bg-muted transition-colors ${
                  isFavorite ? 'text-rose-500' : ''
                }`}
                title="Lista de deseos"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleViewFullProduct}
              className="w-full text-xs"
            >
              Ver ficha completa del producto
            </Button>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-muted-foreground text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-primary" />
                <span>Envío express</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>Garantía 2 años</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                <span>Devolución 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
