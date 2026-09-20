import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useUIStore } from '@/store/ui.store';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const recentSearches = ['Sony', 'Mechanical Keyboard', 'Ergonomic Desk', 'Backpack', 'OLED'];
  const popularKeywords = ['Auriculares ANC', 'Teclados Hotswap', 'Standing Desk', 'Mochila Impermeable'];

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productService.getProducts({ searchQuery: query, limit: 6 });
        setResults(res.products);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug: string) => {
    setSearchModalOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchModalOpen(false);
    navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
  };

  if (!searchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSearchModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card border border-border shadow-2xl z-10"
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-border px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por producto, marca, categoría o tecnología..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80"
          >
            ESC
          </button>
        </form>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {isSearching ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
              <p>Buscando en catálogo...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2 mb-1">
                <span>Resultados encontrados ({results.length})</span>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase font-medium">{product.brand}</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{formatCurrency(product.price)}</p>
                    {product.compareAtPrice && (
                      <p className="text-[11px] text-muted-foreground line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-foreground">No encontramos resultados para "{query}"</p>
              <p className="mt-1 text-xs text-muted-foreground">Prueba revisando la ortografía o usando términos más generales.</p>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              {/* Popular Searches */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Búsquedas populares
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setQuery(kw)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted/60 text-foreground hover:bg-muted transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Sugerencias rápidas
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground flex justify-between">
          <span>Presiona <strong>Enter</strong> para ver todos los resultados</span>
          <span>AURA Search Engine v2</span>
        </div>
      </motion.div>
    </div>
  );
};
