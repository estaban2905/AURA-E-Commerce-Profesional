import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Promotion } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: Promotion | null;
  discountAmount: number;
  freeShippingThreshold: number;
  standardShippingCost: number;

  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Promotion, discountAmount: number) => void;
  removeCoupon: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getFreeShippingProgress: () => number; // 0 to 100
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        // Seed default item for instant realistic feel
        {
          id: 'prod-001_v-1',
          product: {
            id: 'prod-001',
            sku: 'AUR-NOV-001',
            slug: 'novaaudio-pro-wireless-anc',
            name: 'NovaAudio Pro Wireless ANC Headphone',
            shortDescription: 'Auriculares over-ear de berilio con cancelación activa híbrida y 48h de autonomía.',
            description: '',
            brand: 'NovaAudio',
            category: 'cat-audio',
            price: 189990,
            compareAtPrice: 229990,
            rating: 4.9,
            reviewsCount: 128,
            stock: 24,
            images: [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
            ],
            variants: [],
            attributes: [],
            tags: ['Hi-Fi'],
            createdAt: '2026-01-10',
          },
          variant: {
            id: 'v-1',
            name: 'Negro Mate',
            sku: 'AUR-NOV-001-BLK',
            color: 'Negro Mate',
            colorHex: '#18181b',
            price: 189990,
            stock: 15,
          },
          quantity: 1,
          selectedColor: 'Negro Mate',
        },
      ],
      coupon: null,
      discountAmount: 0,
      freeShippingThreshold: 50000,
      standardShippingCost: 3990,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        const lineId = variant ? `${product.id}_${variant.id}` : `${product.id}_base`;
        const existingIndex = items.findIndex((i) => i.id === lineId);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          const newItem: CartItem = {
            id: lineId,
            product,
            variant,
            quantity,
            selectedColor: variant?.color,
            selectedSize: variant?.size,
          };
          set({ items: [newItem, ...items] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null, discountAmount: 0 });
      },

      applyCoupon: (coupon, discountAmount) => {
        set({ coupon, discountAmount });
      },

      removeCoupon: () => {
        set({ coupon: null, discountAmount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.variant?.price || item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= get().freeShippingThreshold) {
          return 0;
        }
        return get().standardShippingCost;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().discountAmount;
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        const threshold = get().freeShippingThreshold;
        if (subtotal >= threshold) return 100;
        return Math.min(100, Math.round((subtotal / threshold) * 100));
      },
    }),
    {
      name: 'aura_cart_store_v1',
    }
  )
);
