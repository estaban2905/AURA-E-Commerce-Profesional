export type ThemeMode = 'light' | 'dark';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  stock: number;
  image?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  brand: string;
  category: string;
  subcategoryId?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  createdAt: string;
  specifications?: Record<string, string>;
  warranty?: string;
  shippingInfo?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Address {
  id: string;
  title: string;
  recipientName: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  commune: string;
  region: string;
  postalCode?: string;
  phone: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  avatar?: string;
  addresses: Address[];
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'blocked';
  rewardPoints: number;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
}

export type ShippingMethod = 'standard' | 'express' | 'pickup';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'mercadopago' | 'webpay';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  timeline: OrderTimelineItem[];
}

export interface Promotion {
  id: string;
  code: string;
  title?: string;
  discountType: 'percentage' | 'fixed' | 'fixed_amount';
  value: number;
  minPurchase?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  maxUsageLimit?: number;
  currentUsageCount?: number;
  validFrom?: string;
  validUntil?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  active: boolean;
  description: string;
  category?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  linkUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge: string;
  badgeText?: string;
  imageUrl: string;
  bgGradient?: string;
}

export interface CartItem {
  id: string; // unique cart line id (productId + variantId)
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  category: 'pedidos' | 'pagos' | 'envios' | 'devoluciones' | 'productos' | 'cuenta';
  question: string;
  answer: string;
}

export type SortOption = 'relevance' | 'best-selling' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export interface FilterState {
  category: string;
  subcategoryId?: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  colors: string[];
  sizes: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  searchQuery?: string;
}
