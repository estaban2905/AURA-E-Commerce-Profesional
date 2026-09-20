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

  const currentImage = (selectedVariant && variantImages[selectedVariant.id]) || product.images[0];

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
      {/* 1. Modern Luminous Hero Section: Clean, Airy & Striking */}
      <section
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/40 py-12 lg:py-20"
        aria-label="Lanzamiento Insignia"
      >
        {/* Subtle Ambient Studio Lighting - Soft Electric Glows */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Product Information */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badges: Flagship & Rating */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>LANZAMIENTO DESTACADO 2026</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold">4.9</span>
                  <span className="text-amber-700/80">(128 opiniones)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.12]">
                  {product.name}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                  {product.shortDescription ||
                    'Cancelación activa adaptativa de 45dB, transductores de berilio de 40mm y 48 horas de autonomía sin pérdidas.'}
                </p>
              </div>

              {/* Hardware Spec Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                  Transductor 40mm Berilio
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                  LDAC 24-bit / 990kbps
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                  ANC Adaptativo 45dB
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                  48h Batería Continua
                </span>
              </div>

              {/* Tactile Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acabado:{' '}
                    <strong className="text-slate-900 font-bold">{selectedVariant?.name}</strong>
                  </span>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-slate-950 text-white shadow-md ring-2 ring-slate-950/20'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
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
              <div className="pt-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-lg line-through text-slate-400 font-mono">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-white bg-rose-600 px-2.5 py-0.5 rounded-md shadow-xs">
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Hasta 12 cuotas sin interés de <strong className="text-slate-800">{formatCurrency(Math.round(product.price / 12))}</strong> con tarjetas bancarias
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
                >
                  {isAdded ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-white" />
                      <span>¡Añadido con éxito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      <span>Añadir al Carrito</span>
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-slate-50 text-slate-900 border-slate-300 font-semibold px-6 py-6 text-base rounded-xl shadow-xs"
                >
                  <Link to={`/product/${product.slug}`}>
                    <span>Ver Ficha Técnica</span>
                    <ArrowRight className="h-4 w-4 ml-2 text-slate-500" />
                  </Link>
                </Button>
              </div>

              {/* Live Dispatch & Stock Ticker */}
              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  En stock ({product.stock} unidades) • <strong>Despacho prioritario hoy</strong>
                </span>
              </div>

            </div>

            {/* Right Column: High-Impact Clean Studio Product Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Clean Product Stage with Soft Studio Lighting */}
                <div className="relative aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/50 border border-slate-200/80 shadow-2xl shadow-slate-200/60 p-4 sm:p-6 flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-500 hover:scale-105"
                  />

                  {/* Top-Right Badge: Sound Fidelity */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Hi-Res Audio Cert</span>
                  </div>

                  {/* Bottom-Left Feature Card */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Sliders className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">ANC Híbrido</p>
                      <p className="text-[10px] text-slate-500">45dB cancelación</p>
                    </div>
                  </div>

                  {/* Bottom-Right Feature Card */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <BatteryCharging className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">48 Horas</p>
                      <p className="text-[10px] text-slate-500">Carga rápida USB-C</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Value Proposition Pillars: Clean, Crisp White Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Envío Express 24h</p>
              <p className="text-[11px] sm:text-xs text-slate-500">A todo Chile con seguimiento</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Garantía 2 Años</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Cobertura oficial del fabricante</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">12 Cuotas Sin Interés</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Con todas las tarjetas de crédito</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">30 Días de Prueba</p>
              <p className="text-[11px] sm:text-xs text-slate-500">Devolución simple y garantizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
