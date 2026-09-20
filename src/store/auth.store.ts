import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Address } from '@/types';
import { mockCustomers } from '@/data/customers';

interface AuthState {
  user: Customer | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<Customer>) => void;
  updateProfile: (profile: { name: string; lastName: string; email: string; phone: string }) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  toggleAdminMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockCustomers[0], // Default logged-in customer for seamless demo experience
      isAuthenticated: true,
      isAdmin: false,

      login: async (email: string) => {
        const found = mockCustomers.find((c) => c.email.toLowerCase() === email.toLowerCase());
        if (found) {
          set({ user: found, isAuthenticated: true });
          return true;
        }
        // Fallback create virtual customer
        const fallbackUser: Customer = {
          id: `cust-${Date.now()}`,
          name: email.split('@')[0],
          lastName: 'Usuario',
          email,
          phone: '+56 9 1234 5678',
          ordersCount: 0,
          totalSpent: 0,
          status: 'active',
          rewardPoints: 100,
          createdAt: new Date().toISOString().split('T')[0],
          addresses: [],
        };
        set({ user: fallbackUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },

      updateProfile: (profile) => {
        const current = get().user;
        if (current) {
          set({
            user: {
              ...current,
              name: profile.name,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone,
            },
          });
        }
      },

      addAddress: (address) => {
        const current = get().user;
        if (current) {
          set({
            user: {
              ...current,
              addresses: [...current.addresses, address],
            },
          });
        }
      },

      removeAddress: (addressId) => {
        const current = get().user;
        if (current) {
          set({
            user: {
              ...current,
              addresses: current.addresses.filter((a) => a.id !== addressId),
            },
          });
        }
      },

      toggleAdminMode: () => {
        set((state) => ({ isAdmin: !state.isAdmin }));
      },
    }),
    {
      name: 'aura_auth_store_v1',
    }
  )
);
