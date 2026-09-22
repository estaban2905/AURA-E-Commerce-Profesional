import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Grid3X3,
  LayoutList,
  Search,
  Check,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { mockCategories } from '@/data/categories';
import { mockBrands } from '@/data/brands';
import { ProductCard } from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { SortOption } from '@/types';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Read URL params
  const initialCategory = searchParams.get('category') || undefined;
  const initialSearch = searchParams.get('q') || undefined;
  const initialFilter = searchParams.get('filter');

  const {
    products,
    total,
    page,
    totalPages,
    isLoading,
    filters,
    sort,
    setSort,
    setPage,
    updateFilter,
    clearFilters,
  } = useProducts({
    initialFilters: {
      category: initialCategory,
      searchQuery: initialSearch,
      onSaleOnly: initialFilter === 'offers',
    },
    limit: 12,
  });

  // Sync URL params when they change externally
  useEffect(() => {
    const cat = searchParams.get('category') || undefined;
    const q = searchParams.get('q') || undefined;
    const f = searchParams.get('filter');
    updateFilter({
      category: cat,
      searchQuery: q,
      onSaleOnly: f === 'offers',
    });
  }, [searchParams]);

  const handleCategorySelect = (catId?: string) => {
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    updateFilter({ category: catId });
  };

  const handleBrandToggle = (brandName: string) => {
    const currentBrands = filters.brands || [];
    const updated = currentBrands.includes(brandName)
      ? currentBrands.filter((b) => b !== brandName)
      : [...currentBrands, brandName];
    updateFilter({ brands: updated });
  };

  const activeFiltersCount =
    (filters.category ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.brands?.length || 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const selectedCategoryObj = mockCategories.find((c) => c.id === filters.category);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>Inicio</span>
          <span>/</span>
          <span>Catálogo</span>
          {selectedCategoryObj && (
            <>
              <span>/</span>
              <span className="text-foreground font-semibold">{selectedCategoryObj.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {selectedCategoryObj ? selectedCategoryObj.name : 'Catálogo de Hardware & Periféricos'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {selectedCategoryObj?.description ||
                'Explora nuestra selección completa de tecnología de precisión, audio de alta fidelidad y workspace.'}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <Badge variant="primary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm font-bold text-foreground">Filtros Avanzados</span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams({});
                    clearFilters();
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* In-Catalog Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Buscar en catálogo</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Modelo, keyword..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => updateFilter({ searchQuery: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">Categorías</label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategorySelect(undefined)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    !filters.category ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span>Todas las categorías</span>
                  <span>50</span>
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      filters.category === cat.id
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground block">Rango de Precio</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground">Mínimo</span>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Máximo</span>
                  <input
                    type="number"
                    placeholder="$1.000.000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Brands Multi-Select */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground block">Marcas</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {mockBrands.map((b) => {
                  const isChecked = filters.brands?.includes(b.name) || false;
                  return (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(b.name)}
                        className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>{b.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground block">Calificación Mínima</label>
              <div className="space-y-1 text-xs">
                {[4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateFilter({ minRating: filters.minRating === r ? undefined : r })}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      filters.minRating === r
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{r}★ estrellas o más</span>
                    {filters.minRating === r && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles (Stock & Offers) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="flex items-center justify-between text-xs text-foreground cursor-pointer">
                <span>Solo en stock</span>
                <input
                  type="checkbox"
                  checked={!!filters.inStockOnly}
                  onChange={(e) => updateFilter({ inStockOnly: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-foreground cursor-pointer">
                <span>Solo ofertas con descuento</span>
                <input
                  type="checkbox"
                  checked={!!filters.onSaleOnly}
                  onChange={(e) => updateFilter({ onSaleOnly: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid & Header Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Filter Bar (Results count, Sort, View mode) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl border border-border bg-card">
            <div className="text-[11px] sm:text-xs text-muted-foreground">
              Mostrando <strong className="text-foreground">{products.length}</strong> de{' '}
              <strong className="text-foreground">{total}</strong> productos
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none">
                <span className="text-xs text-muted-foreground hidden md:inline-block">Ordenar por:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full sm:w-auto text-[11px] sm:text-xs rounded-lg border border-input bg-background px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="relevance">Destacados / Relevancia</option>
                  <option value="best-selling">Más vendidos</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Calificados</option>
                  <option value="newest">Lanzamientos Recientes</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Vista cuadrícula"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Vista lista"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Filtros aplicados:</span>
              {filters.category && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <span>Cat: {selectedCategoryObj?.name || filters.category}</span>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(undefined)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <span>Búsqueda: "{filters.searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => updateFilter({ searchQuery: undefined })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.brands?.map((b) => (
                <Badge key={b} variant="secondary" className="gap-1 text-xs">
                  <span>{b}</span>
                  <button
                    type="button"
                    onClick={() => handleBrandToggle(b)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.inStockOnly && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <span>En stock</span>
                  <button
                    type="button"
                    onClick={() => updateFilter({ inStockOnly: false })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.onSaleOnly && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <span>En oferta</span>
                  <button
                    type="button"
                    onClick={() => updateFilter({ onSaleOnly: false })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchParams({});
                  clearFilters();
                }}
                className="text-xs text-primary font-medium hover:underline ml-1"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {/* Product Items */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 sm:h-96 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center bg-card">
              <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">No se encontraron productos</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                No hay productos que coincidan con los filtros seleccionados. Prueba relajando el rango de precios o cambiando de categoría.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchParams({});
                  clearFilters();
                }}
              >
                Restablecer todos los filtros
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'
                  : 'space-y-3 sm:space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                        page === pNum
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-start lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative flex h-full w-full max-w-xs flex-col bg-background p-6 shadow-xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-base font-bold text-foreground">Filtros</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Category mobile */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">Categoría</label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCategorySelect(undefined);
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full text-left py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Todas las categorías
                  </button>
                  {mockCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        handleCategorySelect(c.id);
                        setMobileFiltersOpen(false);
                      }}
                      className="w-full text-left py-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-border">
                <label className="flex items-center justify-between text-xs text-foreground">
                  <span>Solo en stock</span>
                  <input
                    type="checkbox"
                    checked={!!filters.inStockOnly}
                    onChange={(e) => updateFilter({ inStockOnly: e.target.checked })}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-foreground">
                  <span>Solo en oferta</span>
                  <input
                    type="checkbox"
                    checked={!!filters.onSaleOnly}
                    onChange={(e) => updateFilter({ onSaleOnly: e.target.checked })}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Ver {total} resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
