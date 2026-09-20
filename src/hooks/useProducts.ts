import { useState, useEffect, useCallback } from 'react';
import { Product, FilterState, SortOption } from '@/types';
import { productService, ProductQueryResult } from '@/services/product.service';

interface UseProductsOptions {
  initialFilters?: Partial<FilterState>;
  initialSort?: SortOption;
  initialPage?: number;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<ProductQueryResult>({
    products: [],
    total: 0,
    page: options.initialPage || 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Partial<FilterState>>(options.initialFilters || {});
  const [sort, setSort] = useState<SortOption>(options.initialSort || 'relevance');
  const [page, setPage] = useState<number>(options.initialPage || 1);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts({
        ...filters,
        sort,
        page,
        limit: options.limit || 12,
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, options.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter change
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    products: data.products,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    isLoading,
    error,
    filters,
    sort,
    setSort,
    setPage,
    updateFilter,
    clearFilters,
    refetch: fetchProducts,
  };
}

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    productService.getFeaturedProducts(limit).then((res) => {
      if (mounted) {
        setProducts(res);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [limit]);

  return { products, isLoading };
}

export function useProductOffers(limit = 8) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    productService.getOffers(limit).then((res) => {
      if (mounted) {
        setProducts(res);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [limit]);

  return { products, isLoading };
}

export function useProduct(slugOrId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        let p = await productService.getProductBySlug(slugOrId);
        if (!p) {
          p = await productService.getProductById(slugOrId);
        }
        if (mounted) {
          setProduct(p);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Error al cargar el producto');
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [slugOrId]);

  return { product, isLoading, error };
}
