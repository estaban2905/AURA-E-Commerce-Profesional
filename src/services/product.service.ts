import { Product, Category, Brand, SortOption, FilterState } from '@/types';
import { mockCategories } from '@/data/categories';
import { mockBrands } from '@/data/brands';
import { delay, getStoredProducts, saveStoredProducts } from '@/mocks/api';

export interface ProductQueryResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const productService = {
  async getProducts(params?: Partial<FilterState> & { sort?: SortOption; page?: number; limit?: number }): Promise<ProductQueryResult> {
    await delay(300);
    let list = [...getStoredProducts()];

    if (params) {
      if (params.searchQuery && params.searchQuery.trim() !== '') {
        const q = params.searchQuery.toLowerCase().trim();
        list = list.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      if (params.category && params.category !== 'all') {
        list = list.filter((p) => p.category === params.category);
      }

      if (params.subcategoryId && params.subcategoryId !== 'all') {
        list = list.filter((p) => p.subcategoryId === params.subcategoryId);
      }

      if (params.brands && params.brands.length > 0) {
        list = list.filter((p) => params.brands!.includes(p.brand));
      }

      if (params.minPrice !== undefined) {
        list = list.filter((p) => p.price >= params.minPrice!);
      }

      if (params.maxPrice !== undefined && params.maxPrice > 0) {
        list = list.filter((p) => p.price <= params.maxPrice!);
      }

      if (params.minRating !== undefined && params.minRating > 0) {
        list = list.filter((p) => p.rating >= params.minRating!);
      }

      if (params.inStockOnly) {
        list = list.filter((p) => p.stock > 0);
      }

      if (params.onSaleOnly) {
        list = list.filter((p) => !!p.compareAtPrice && p.compareAtPrice > p.price);
      }

      // Sorting
      if (params.sort) {
        switch (params.sort) {
          case 'price-asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            list.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'best-selling':
            list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
            break;
          case 'relevance':
          default:
            list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
        }
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      total,
      page,
      totalPages,
    };
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    await delay(200);
    const all = getStoredProducts();
    return all.filter((p) => p.featured || p.bestseller).slice(0, limit);
  },

  async getOffers(limit = 8): Promise<Product[]> {
    await delay(200);
    const all = getStoredProducts();
    return all.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    await delay(200);
    const all = getStoredProducts();
    return all.filter((p) => p.new).slice(0, limit);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(250);
    const all = getStoredProducts();
    return all.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    const all = getStoredProducts();
    return all.find((p) => p.id === id) || null;
  },

  async getRelatedProducts(category: string, currentId: string, limit = 4): Promise<Product[]> {
    await delay(200);
    const all = getStoredProducts();
    return all.filter((p) => p.category === category && p.id !== currentId).slice(0, limit);
  },

  async getCategories(): Promise<Category[]> {
    await delay(150);
    return mockCategories;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(150);
    return mockCategories.find((c) => c.slug === slug) || null;
  },

  async getBrands(): Promise<Brand[]> {
    await delay(150);
    return mockBrands;
  },

  // Admin CRUD mutations
  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await delay(350);
    const products = getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProduct, ...products];
    saveStoredProducts(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay(300);
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    saveStoredProducts([...products]);
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await delay(300);
    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveStoredProducts(filtered);
    return true;
  },
};
