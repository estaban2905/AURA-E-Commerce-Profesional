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
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return mockProducts;
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

