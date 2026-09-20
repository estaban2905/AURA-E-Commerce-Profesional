import { Customer, Address } from '@/types';
import { delay, getStoredCustomers, saveStoredCustomers } from '@/mocks/api';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay(250);
    return getStoredCustomers();
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    await delay(200);
    const customers = getStoredCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  async updateProfile(id: string, updates: Partial<Customer>): Promise<Customer> {
    await delay(350);
    const customers = getStoredCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');

    const updated = { ...customers[index], ...updates };
    customers[index] = updated;
    saveStoredCustomers([...customers]);
    return updated;
  },

  async addAddress(customerId: string, address: Omit<Address, 'id'>): Promise<Address> {
    await delay(300);
    const customers = getStoredCustomers();
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1) throw new Error('Cliente no encontrado');

    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    if (newAddress.isDefault) {
      customers[index].addresses = customers[index].addresses.map((a) => ({ ...a, isDefault: false }));
    }

    customers[index].addresses.push(newAddress);
    saveStoredCustomers([...customers]);
    return newAddress;
  },

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    await delay(250);
    const customers = getStoredCustomers();
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1) return false;

    customers[index].addresses = customers[index].addresses.filter((a) => a.id !== addressId);
    saveStoredCustomers([...customers]);
    return true;
  },

  async setDefaultAddress(customerId: string, addressId: string): Promise<boolean> {
    await delay(200);
    const customers = getStoredCustomers();
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1) return false;

    customers[index].addresses = customers[index].addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    saveStoredCustomers([...customers]);
    return true;
  },
};
