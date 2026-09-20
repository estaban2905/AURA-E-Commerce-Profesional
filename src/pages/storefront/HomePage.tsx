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
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
              Catálogo de Ecosistemas
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Categorías de Hardware
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground flex items-center gap-1 group"
          >
            <span>Ver catálogo completo</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {mockCategories.slice(0, 6).map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/catalog?category=${cat.id}`}
                className="group relative flex flex-col justify-end aspect-3/4 sm:aspect-4/5 rounded-xl overflow-hidden border border-border/80 bg-muted/30 p-3.5 transition-all hover:border-foreground/40 hover:shadow-md"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Information */}
                <div className="relative z-10 space-y-0.5 text-white">
                  <span className="text-[10px] font-mono text-zinc-300 block">
                    {cat.itemCount} modelos
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold leading-tight">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
              Selección de Productos
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Hardware Destacado
            </h2>
          </div>

          {/* Clean category filter tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-muted/60 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'desk'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Workspace Pro
            </button>
          </div>
        </div>

        {/* Clean, visible product cards grid */}
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-muted/40 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Curated Opportunities - Clean, Focused Row */}
      {offers.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                Disponibilidad Especial
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                Ediciones con Descuento Directo
              </h2>
            </div>
            <Link
              to="/catalog?filter=offers"
              className="text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground flex items-center gap-1 group"
            >
              <span>Ver todas las ofertas</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Minimalist Engineering & Architecture Showcase */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200/90 dark:border-zinc-800 bg-gradient-to-br from-stone-100 via-white to-stone-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-stone-200 text-xs font-medium shadow-xs">
                <Layers2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">AURA STUDIO LAB</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 dark:text-zinc-400 text-[11px]">Diseño & Ergonomía</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
                Herramientas Diseñadas para Alto Rendimiento
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Cada componente de audio, periférico y soporte ergonómico pasa por rigurosos controles
                de respuesta acústica y durabilidad de materiales antes del ensamblaje final.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button asChild className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 font-bold px-6 shadow-md">
                  <Link to="/catalog" className="gap-2">
                    <span>Explorar Todo el Catálogo</span>
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-stone-300 bg-white text-stone-800 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
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
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Box className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Despacho Asegurado</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Embalaje protector antichoque y seguimiento en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Garantía Directa</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  24 meses de cobertura directa contra fallas de fabricación.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Hardware Probado</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Calibración individual de drivers y respuesta táctil.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Cable className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Compatibilidad Abierta</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Integración fluida con macOS, Windows, Linux y consolas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
