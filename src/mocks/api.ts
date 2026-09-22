// Mock API Helper with realistic artificial delay and local storage persistence
import { mockProducts } from '@/data/products';
import { mockCategories } from '@/data/categories';
import { mockBrands } from '@/data/brands';
import { mockOrders } from '@/data/orders';
import { mockCustomers } from '@/data/customers';
import { mockReviews } from '@/data/reviews';
import { mockPromotions } from '@/data/promotions';
import { Product, Order, Customer, Review, Promotion, Category, Brand } from '@/types';

export const delay = (ms = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const STORAGE_KEYS = {
  PRODUCTS: 'aura_mock_products_v1',
  ORDERS: 'aura_mock_orders_v1',
  CUSTOMERS: 'aura_mock_customers_v1',
  REVIEWS: 'aura_mock_reviews_v1',
  PROMOTIONS: 'aura_mock_promotions_v1',
};

// Initialize or read from localStorage so Admin mutations persist across views
export function getStoredProducts(): Product[] {
  let list: Product[] = mockProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Sanitize all products to prevent runtime crashes from missing optional fields
  return list.map((p) => ({
    ...p,
    id: p.id || `prod-${Math.random().toString(36).substring(2, 9)}`,
    slug: p.slug || `producto-${p.id}`,
    name: p.name || 'Producto sin nombre',
    brand: p.brand || 'AURA',
    category: p.category || 'cat-audio',
    price: typeof p.price === 'number' ? p.price : 0,
    stock: typeof p.stock === 'number' ? p.stock : 10,
    rating: typeof p.rating === 'number' && !isNaN(p.rating) ? p.rating : 4.8,
    reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : 12,
    images: Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    variants: Array.isArray(p.variants) ? p.variants : [],
    attributes: Array.isArray(p.attributes) ? p.attributes : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    shortDescription: p.shortDescription || '',
    description: p.description || p.shortDescription || '',
  }));
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return mockOrders;
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return mockCustomers;
}

export function saveStoredCustomers(customers: Customer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return mockReviews;
}

export function saveStoredReviews(reviews: Review[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredPromotions(): Promotion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return mockPromotions;
}

export function saveStoredPromotions(promotions: Promotion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
  } catch (e) {
    console.error(e);
  }
}

export function resetMockData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error(e);
  }
}

