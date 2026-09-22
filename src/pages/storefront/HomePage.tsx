import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MoveRight,
  ArrowUpRight,
  AudioWaveform,
  SlidersHorizontal,
  ChevronRight,
  Box,
  Shield,
  Cpu,
  Cable,
  Layers2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { mockCategories } from '@/data/categories';
import { useFeaturedProducts, useProductOffers } from '@/hooks/useProducts';
import { ProductCard } from '@/components/common/ProductCard';
import { HeroBannerSlider } from '@/components/storefront/HeroBannerSlider';
import { Button } from '@/components/ui/button';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'audio' | 'gaming' | 'desk'>('all');

  const { products: featured, isLoading: isFeaturedLoading } = useFeaturedProducts(8);
  const { products: offers, isLoading: isOffersLoading } = useProductOffers(4);

  const filteredFeatured = featured.filter((p) => {
    if (activeTab === 'audio') return p.category === 'cat-audio';
    if (activeTab === 'gaming') return p.category === 'cat-gaming';
    if (activeTab === 'desk') return p.category === 'cat-desk';
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Unobstructed, High-Fidelity Hero Spotlight */}
      <HeroBannerSlider />

      {/* 2. Direct Category Navigation - Clear visual cards without clutter */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5 sm:mb-1">
              Catálogo de Ecosistemas
            </span>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Categorías de Hardware
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground flex items-center gap-1 group shrink-0"
          >
            <span>Ver todo</span>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile: Smooth Snap-X Horizontal Carousel, Tablet/Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:pb-0">
          {mockCategories.slice(0, 6).map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="min-w-[130px] sm:min-w-0 snap-start flex-1"
            >
              <Link
                to={`/catalog?category=${cat.id}`}
                className="group relative flex flex-col justify-end aspect-4/5 sm:aspect-3/4 rounded-xl overflow-hidden border border-border/80 bg-muted/30 p-3 transition-all hover:border-foreground/40 hover:shadow-md"
              >
                {/* Clear product image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle dark gradient at bottom for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Information */}
                <div className="relative z-10 space-y-0.5 text-white">
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-300 block">
                    {cat.itemCount} modelos
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold leading-tight line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products - Direct, Unobstructed Shopping Grid */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5 sm:mb-1">
              Selección de Productos
            </span>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Hardware Destacado
            </h2>
          </div>

          {/* Clean category filter tabs with mobile horizontal scroll */}
          <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-muted/60 rounded-xl border border-border/60 max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos ({featured.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'audio'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Audio & Hi-Fi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gaming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'gaming'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gaming & 8K
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('desk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'desk'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Workspace Pro
            </button>
          </div>
        </div>

        {/* Clean, visible product cards grid: 2 columns on mobile, 4 on desktop */}
        {isFeaturedLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 sm:h-80 rounded-xl bg-muted/40 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Curated Opportunities - Clean, Focused Row */}
      {offers.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5 sm:mb-1">
                Disponibilidad Especial
              </span>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                Ediciones con Descuento Directo
              </h2>
            </div>
            <Link
              to="/catalog?filter=offers"
              className="text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground flex items-center gap-1 group shrink-0"
            >
              <span>Ver ofertas</span>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Minimalist Engineering & Architecture Showcase */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200/90 dark:border-zinc-800 bg-gradient-to-br from-stone-100 via-white to-stone-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-5 sm:p-8 lg:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 text-xs font-medium shadow-xs">
                <Layers2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">AURA STUDIO LAB</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">Diseño & Ergonomía</span>
              </div>

              <h3 className="font-display text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
                Herramientas Diseñadas para Alto Rendimiento
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Cada componente de audio, periférico y soporte ergonómico pasa por rigurosos controles
                de respuesta acústica y durabilidad de materiales antes del ensamblaje final.
              </p>

              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <Button asChild className="w-full sm:w-auto bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 font-bold px-6 py-2.5 shadow-md justify-center">
                  <Link to="/catalog" className="gap-2">
                    <span>Explorar Todo el Catálogo</span>
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto border-stone-300 bg-white text-stone-800 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 justify-center">
                  <Link to="/about">Conocer el Manifiesto</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200/80 dark:border-zinc-800 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80"
                  alt="Espacio de trabajo ergonómico Aura"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Authentic Technical Standards Strip */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Box className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground">Despacho Asegurado</h4>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Embalaje protector y tracking en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground">Garantía Directa</h4>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  24 meses de cobertura directa con fabricante.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground">Hardware Calibrado</h4>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Respuesta acústica y switches testeados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Cable className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground">Compatibilidad Total</h4>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  macOS, Windows, Linux y consolas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
