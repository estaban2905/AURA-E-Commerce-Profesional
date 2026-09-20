import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ThemeMode } from '@/types';

interface UIState {
  theme: ThemeMode;
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  searchModalOpen: boolean;
  quickViewProduct: Product | null;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      mobileMenuOpen: false,
      cartDrawerOpen: false,
      searchModalOpen: false,
      quickViewProduct: null,

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: next };
        }),

      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },

      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
    }),
    {
      name: 'aura_ui_store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
