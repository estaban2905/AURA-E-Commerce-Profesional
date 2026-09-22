import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useUIStore } from '@/store/ui.store';
import { useToast } from '@/components/ui/toast-context';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { setQuickViewProduct, setCartDrawerOpen: openCartDrawer } = useUIStore();
  const toast = useToast();

  const isFavorite = isInWishlist(product.id);
  const activeVariant = product.variants?.[selectedVariantIndex];
  const price = activeVariant?.price || product.price || 0;
  const compareAtPrice = product.compareAtPrice;
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  // Safe image resolution with fallbacks
  const primaryImage =
    activeVariant?.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800';
  const hoverImage = (Array.isArray(product.images) && product.images[1]) || primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, activeVariant, 1);
    setJustAdded(true);
    toast.success('Producto añadido al carrito', `${product.name} ha sido agregado con éxito.`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!isFavorite) {
      toast.info('Guardado en favoritos', `${product.name} está en tu lista de deseos.`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group relative flex flex-col rounded-xl border border-border/80 bg-card transition-all duration-200 hover:border-foreground/30 hover:shadow-md overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container - Crystal clear product photo */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/25">
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
            }}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-104"
          />
        </Link>

        {/* Minimalist discreet tag - only when on sale or new */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none z-10">
          {hasDiscount && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-950/85 text-white backdrop-blur-sm border border-zinc-800">
              -{discountPercent}%
            </span>
          )}
          {product.new && !hasDiscount && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-foreground text-background">
              NOVEDAD
            </span>
          )}
        </div>

        {/* Quick action buttons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Agregar a favoritos"
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm text-foreground shadow-sm transition-all hover:bg-background ${
              isFavorite ? 'text-rose-500 fill-rose-500' : 'hover:text-rose-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleQuickView}
            aria-label="Vista rápida"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm text-foreground shadow-sm transition-all hover:bg-background hover:text-foreground"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add To Cart Button on hover (Bottom of Image) */}
        <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold shadow-md transition-all active:scale-98 ${
              product.stock <= 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : justAdded
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Añadido al carrito</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Sin existencias</span>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
        {/* Brand & Category & Rating */}
        <div className="mb-1 sm:mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-[9px] sm:text-[10px] text-primary/90 bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[90px] sm:max-w-none">
            {product.brand || 'AURA'}
          </span>
          <Rating value={product.rating || 5} size="sm" showCount={false} />
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-xs sm:text-[14px] md:text-[15px] font-semibold text-foreground hover:text-primary transition-colors mb-1.5 sm:mb-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Color Swatches if available */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
            {product.variants.slice(0, 4).map((variant, idx) => (
              <button
                key={variant.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border border-border/80 transition-transform ${
                  selectedVariantIndex === idx ? 'ring-2 ring-primary ring-offset-1 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: variant.colorHex || '#333' }}
                title={variant.name}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">+{product.variants.length - 4}</span>
            )}
          </div>
        )}

        {/* Price & Mobile Add Button */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between border-t border-border/40 gap-1">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base md:text-lg font-black text-foreground tracking-tight truncate">
              {formatCurrency(price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-muted-foreground/80 line-through truncate">
                {formatCurrency(compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Mobile action button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl transition-all shadow-xs sm:hidden shrink-0 active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            aria-label="Agregar al carrito"
          >
            {justAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

