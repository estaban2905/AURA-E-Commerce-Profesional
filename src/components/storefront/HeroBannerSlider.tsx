import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Check,
  Star,
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  BatteryCharging,
  Sliders,
} from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useCartStore } from '@/store/cart.store';
import { useToast } from '@/components/ui/toast-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const HeroBannerSlider: React.FC = () => {
  const { addItem } = useCartStore();
  const { success } = useToast();

  // Flagship star product
  const product = mockProducts.find((p) => p.id === 'prod-001') || mockProducts[0];
  
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [isAdded, setIsAdded] = useState(false);

  // Variant image mapping for clean studio visual feedback
  const variantImages: Record<string, string> = {
    'v-1': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=85',
    'v-2': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=85',
  };

  const currentImage =
    (selectedVariant && variantImages[selectedVariant.id]) ||
    (Array.isArray(product.images) && product.images[0]) ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85';

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1);
    setIsAdded(true);
    success(
      'Añadido al carrito',
      `${product.name} (${selectedVariant?.name || 'Estándar'}) listo para compra.`
    );
    setTimeout(() => setIsAdded(false), 2400);
  };

  return (
    <div className="w-full bg-background border-b border-border/60">
      {/* 1. Modern Hero Section: Responsive, Theme-Aware & Striking */}
      <section
        className="relative w-full overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background py-8 sm:py-12 lg:py-16"
        aria-label="Lanzamiento Insignia"
      >
        {/* Subtle Ambient Studio Lighting */}
        <div className="absolute top-10 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-6 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Editorial Product Information */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 order-2 lg:order-1">
              
              {/* Badges: Flagship & Rating */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  <span>LANZAMIENTO DESTACADO 2026</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-medium">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold">4.9</span>
                  <span className="text-muted-foreground">(128 opiniones)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed font-normal max-w-xl">
                  {product.shortDescription ||
                    'Cancelación activa adaptativa de 45dB, transductores de berilio de 40mm y 48 horas de autonomía sin pérdidas.'}
                </p>
              </div>

              {/* Hardware Spec Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                <span className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-card text-foreground border border-border shadow-xs">
                  Transductor 40mm Berilio
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-card text-foreground border border-border shadow-xs">
                  LDAC 24-bit / 990kbps
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-card text-foreground border border-border shadow-xs">
                  ANC Adaptativo 45dB
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-card text-foreground border border-border shadow-xs">
                  48h Batería Continua
                </span>
              </div>

              {/* Tactile Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acabado:{' '}
                    <strong className="text-foreground font-bold">{selectedVariant?.name}</strong>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-foreground text-background shadow-md ring-2 ring-foreground/20'
                              : 'bg-card text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: v.colorHex || '#18181b' }}
                          />
                          <span>{v.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price & Installments Section */}
              <div className="pt-1 sm:pt-2">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground font-mono tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-base sm:text-lg line-through text-muted-foreground/70 font-mono">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-[10px] sm:text-xs font-bold text-white bg-rose-600 px-2 py-0.5 rounded-md shadow-xs">
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 font-medium">
                  Hasta 12 cuotas sin interés de <strong className="text-foreground">{formatCurrency(Math.round(product.price / 12))}</strong> con tarjetas bancarias
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 sm:px-8 py-3.5 sm:py-5 text-sm sm:text-base rounded-xl shadow-md active:scale-95 transition-all"
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>¡Añadido con éxito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>Añadir al Carrito</span>
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-card hover:bg-muted text-foreground border-border font-semibold px-5 sm:px-6 py-3.5 sm:py-5 text-xs sm:text-sm rounded-xl shadow-xs"
                >
                  <Link to={`/product/${product.slug}`} className="flex items-center justify-center">
                    <span>Ver Ficha Técnica</span>
                    <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
                  </Link>
                </Button>
              </div>

              {/* Live Dispatch & Stock Ticker */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  En stock ({product.stock} unidades) • <strong className="text-foreground">Despacho prioritario hoy</strong>
                </span>
              </div>

            </div>

            {/* Right Column: Clean Studio Product Showcase */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                
                {/* Clean Product Stage with Soft Studio Lighting */}
                <div className="relative aspect-4/3 sm:aspect-16/11 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-muted/50 to-muted/20 border border-border shadow-xl p-3 sm:p-6 flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-500 hover:scale-105"
                  />

                  {/* Sound Fidelity Pill */}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md border border-border px-2.5 py-1 rounded-lg sm:rounded-xl shadow-sm flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-foreground">
                    <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                    <span>Hi-Res Audio</span>
                  </div>

                  {/* Desktop Feature Badges (hidden on compact mobile to prevent overlapping) */}
                  <div className="hidden sm:flex absolute bottom-4 left-4 bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl shadow-md items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Sliders className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-tight">ANC Híbrido</p>
                      <p className="text-[9px] text-muted-foreground">45dB cancelación</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex absolute bottom-4 right-4 bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl shadow-md items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <BatteryCharging className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-tight">48 Horas</p>
                      <p className="text-[9px] text-muted-foreground">Carga rápida</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Micro Specs Strip beneath stage */}
                <div className="flex sm:hidden items-center justify-around mt-2.5 px-1 py-1.5 rounded-xl bg-card border border-border text-[10px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-primary" /> ANC 45dB
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <BatteryCharging className="h-3 w-3 text-emerald-500" /> 48h Batería
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="h-3 w-3 text-primary" /> LDAC Hi-Res
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Value Proposition Pillars: Clean, Crisp Responsive Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border bg-card flex items-center gap-2.5 sm:gap-3.5 shadow-xs transition-all">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">Envío Express 24h</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">A todo Chile</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border bg-card flex items-center gap-2.5 sm:gap-3.5 shadow-xs transition-all">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">Garantía 2 Años</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Directa oficial</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border bg-card flex items-center gap-2.5 sm:gap-3.5 shadow-xs transition-all">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">12 Cuotas Sin Interés</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Con tarjetas</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border bg-card flex items-center gap-2.5 sm:gap-3.5 shadow-xs transition-all">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">30 Días Devolución</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Garantizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
