import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Share2,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  ThumbsUp,
  MapPin,
} from 'lucide-react';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { ProductCard } from '@/components/common/ProductCard';
import { useToast } from '@/components/ui/toast-context';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(slug || '');
  const { addItem } = useCartStore();
  const { setCartDrawerOpen } = useUIStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const toast = useToast();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'box' | 'reviews'>('desc');
  const [communeZip, setCommuneZip] = useState('Santiago Centro');
  const [shippingCalculated, setShippingCalculated] = useState(false);

  // Reset variant and active image when navigating products
  React.useEffect(() => {
    setSelectedVariantIndex(0);
    setActiveImageOverride(null);
  }, [product?.id]);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { reviews, addReview, markHelpful } = useReviews(product?.id);
  const { products: relatedProducts } = useProducts({
    initialFilters: { category: product?.category },
    limit: 4,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-muted/40 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted/40 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-muted/40 rounded animate-pulse" />
            <div className="h-8 w-40 bg-muted/40 rounded animate-pulse" />
            <div className="h-24 w-full bg-muted/40 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Producto no encontrado</h2>
        <p className="text-xs text-muted-foreground mb-6">
          El artículo que buscas no existe o ha sido descontinuado de nuestro catálogo.
        </p>
        <Button asChild variant="primary">
          <Link to="/catalog">Volver al Catálogo</Link>
        </Button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const activeVariant = product.variants?.[selectedVariantIndex];
  const price = activeVariant?.price || product.price;
  const compareAtPrice = product.compareAtPrice;
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Aggregate all unique images: standard product images + variant-specific images
  const allImages = React.useMemo(() => {
    const list: string[] = [...(product.images || [])];
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.image && !list.includes(v.image)) {
          list.push(v.image);
        }
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];
  }, [product]);

  const currentImage = activeImageOverride || activeVariant?.image || allImages[0];
  const quotaAmount = Math.round(price / 12);

  const handleAddToCart = () => {
    addItem(product, activeVariant, quantity);
    toast.success('¡Agregado al carrito!', `${quantity}x ${product.name}`);
    setCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    addItem(product, activeVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim() || !reviewName.trim()) {
      toast.error('Campos incompletos', 'Por favor llena todos los campos de la reseña.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        productName: product.name,
        userName: reviewName.trim(),
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        verified: true,
      });
      toast.success('¡Reseña publicada!', 'Gracias por compartir tu experiencia con la comunidad.');
      setReviewTitle('');
      setReviewComment('');
      setReviewName('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalog" className="hover:text-foreground">Catálogo</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/catalog?category=${product.category || 'all'}`} className="hover:text-foreground">
          {product.category ? product.category.replace('cat-', '').toUpperCase() : 'PRODUCTO'}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout (Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/20 border border-border group">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-4 left-4 font-bold text-xs shadow-md">
                -{discountPercent}% OFF
              </Badge>
            )}
            {product.new && (
              <Badge variant="accent" className="absolute top-4 right-4 font-bold text-xs shadow-md">
                Lanzamiento 2026
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
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
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      isActive
                        ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-sm'
                        : 'border-border/80 opacity-70 hover:opacity-100 hover:border-foreground/30'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ángulo ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">
              <span>{product.brand}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-3">
              <Rating value={product.rating} showCount count={product.reviewsCount} size="md" />
              <span className="text-xs text-muted-foreground">|</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-primary font-medium hover:underline"
              >
                Ver {reviews.length} opiniones
              </button>
            </div>
          </div>

          {/* Price Block */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-foreground">{formatCurrency(price)}</span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">
                  {formatCurrency(compareAtPrice!)}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              💳 Hasta 12 cuotas sin interés de <strong>{formatCurrency(quotaAmount)}</strong> con tarjetas bancarias
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Variants Selector (Colors / Capacities) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Selecciona Color / Variante: <span className="text-primary font-semibold">{activeVariant?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      if (variant.image) {
                        setActiveImageOverride(variant.image);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariantIndex === idx
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {variant.colorHex && (
                      <span
                        className="h-4 w-4 rounded-full border border-black/20"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                product.stock > 10
                  ? 'bg-emerald-500'
                  : product.stock > 0
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className={product.stock > 0 ? 'text-foreground' : 'text-rose-500'}>
              {product.stock > 10
                ? `Disponibilidad inmediata (${product.stock} unidades listas para despacho)`
                : product.stock > 0
                ? `¡Últimas ${product.stock} unidades en bodega!`
                : 'Agotado temporalmente'}
            </span>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-input rounded-xl bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-foreground">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Agregar al Carrito</span>
              </Button>

              <button
                type="button"
                onClick={() => toggleItem(product)}
                className={`p-3 rounded-xl border border-input text-foreground hover:bg-muted transition-colors ${
                  isFavorite ? 'text-rose-500' : ''
                }`}
                title="Favoritos"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now instant checkout */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-foreground text-background hover:opacity-90 font-bold"
            >
              Comprar Ahora con 1-Click
            </Button>
          </div>

          {/* Shipping Calculator Box */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Calculador de Despacho a Domicilio</span>
            </div>
            <div className="flex gap-2">
              <select
                value={communeZip}
                onChange={(e) => {
                  setCommuneZip(e.target.value);
                  setShippingCalculated(true);
                }}
                className="flex-1 text-xs rounded-lg border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="Santiago Centro">Santiago Centro</option>
                <option value="Las Condes">Las Condes</option>
                <option value="Providencia">Providencia</option>
                <option value="Viña del Mar">Viña del Mar / Valparaíso</option>
                <option value="Concepción">Concepción / Bío Bío</option>
                <option value="Antofagasta">Antofagasta / Norte</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShippingCalculated(true)}
              >
                Calcular
              </Button>
            </div>
            <div className="text-xs space-y-1 text-muted-foreground pt-1">
              <div className="flex justify-between">
                <span>Despacho Normal (24-48 hrs):</span>
                <span className="font-semibold text-foreground">
                  {price >= 50000 ? 'GRATIS' : '$3.990'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Retiro en Tienda Las Condes:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Disponible Hoy
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/60 text-[11px] text-muted-foreground text-center">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-card border border-border/60">
              <Truck className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Envío a Todo Chile</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-card border border-border/60">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Garantía 2 Años</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-card border border-border/60">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">30 Días de Prueba</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div id="product-tabs" className="pt-8 border-t border-border">
        <div className="flex border-b border-border gap-6 text-sm font-semibold mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Descripción Detallada
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Especificaciones Técnicas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('box')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'box'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Contenido de la Caja
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Reseñas de Clientes</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{reviews.length}</span>
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="max-w-3xl space-y-4 text-sm text-foreground/80 leading-relaxed">
            <p>{product.description || product.shortDescription}</p>
            <h4 className="text-base font-bold text-foreground pt-4">Destacados del Producto</h4>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {(product.attributes || []).map((attr, idx) => (
                <li key={idx}>
                  <strong className="text-foreground">{attr.name}:</strong> {attr.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl">
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {(product.attributes || []).map((attr, idx) => (
                <div key={idx} className="grid grid-cols-3 p-3 text-xs">
                  <span className="font-semibold text-foreground">{attr.name}</span>
                  <span className="col-span-2 text-muted-foreground">{attr.value}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-foreground">Marca</span>
                <span className="col-span-2 text-muted-foreground">{product.brand}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-foreground">SKU Oficial</span>
                <span className="col-span-2 text-muted-foreground">{product.sku}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-foreground">Garantía</span>
                <span className="col-span-2 text-muted-foreground">24 Meses oficial con fabricante</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Box Contents */}
        {activeTab === 'box' && (
          <div className="max-w-xl space-y-3 text-xs">
            <p className="text-sm font-semibold text-foreground">Todo lo necesario para iniciar:</p>
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Package className="h-4 w-4 text-primary" />
                <span>1x {product.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Cable de conexión reforzado con trenzado premium</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Funda o estuche de transporte con cierre impermeable</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Guía rápida de inicio en español y certificado de autenticidad AURA</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-border bg-card">
              <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0">
                <span className="text-5xl font-black text-foreground">{(product.rating || 5).toFixed(1)}</span>
                <Rating value={product.rating || 5} size="lg" className="my-2" />
                <span className="text-xs text-muted-foreground">
                  Basado en {reviews.length} valoraciones verificadas
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.rating === stars).length;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-12 text-muted-foreground">{stars} estrellas</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Review call to action */}
              <div className="flex flex-col justify-center items-center text-center">
                <h4 className="text-sm font-bold text-foreground mb-1">¿Tienes este producto?</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Tu opinión ayuda a otros profesionales a elegir con certeza.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Escribir una reseña
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Comentarios de Usuarios</h3>
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{rev.userName}</span>
                      {rev.verified && (
                        <Badge variant="success" className="text-[10px] py-0">
                          Compra Verificada
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                  </div>

                  <Rating value={rev.rating} size="sm" showCount={false} />

                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{rev.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => markHelpful(rev.id)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>¿Te fue útil? ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Form */}
            <div id="review-form" className="p-6 rounded-2xl border border-border bg-card space-y-4 max-w-xl">
              <h3 className="text-base font-bold text-foreground">Deja tu Valoración</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Calificación general
                  </label>
                  <Rating
                    value={reviewRating}
                    size="lg"
                    interactive
                    onChange={(val) => setReviewRating(val)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      placeholder="Ej: Nicolás M."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Título de la reseña
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Excelente respuesta acústica"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Tu comentario
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos sobre los acabados, durabilidad y sensaciones de uso..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="md" isLoading={isSubmittingReview}>
                  Publicar Reseña
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel / Grid */}
      <div className="pt-12 border-t border-border">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-6">
          Quienes vieron esto también compraron
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
