export interface SalesDataPoint {
  date: string;
  ventas: number;
  pedidos: number;
}

export interface CategorySalesPoint {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  averageTicket: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 28450900,
  totalOrders: 318,
  totalCustomers: 184,
  conversionRate: 3.42,
  averageTicket: 89468,
  salesGrowth: 18.5,
  ordersGrowth: 12.2,
  customersGrowth: 24.8,
};

export const mockDailySales: SalesDataPoint[] = [
  { date: '01 Mar', ventas: 890000, pedidos: 10 },
  { date: '02 Mar', ventas: 1120000, pedidos: 13 },
  { date: '03 Mar', ventas: 940000, pedidos: 9 },
  { date: '04 Mar', ventas: 1450000, pedidos: 16 },
  { date: '05 Mar', ventas: 1680000, pedidos: 19 },
  { date: '06 Mar', ventas: 1210000, pedidos: 14 },
  { date: '07 Mar', ventas: 1890000, pedidos: 21 },
  { date: '08 Mar', ventas: 2100000, pedidos: 24 },
  { date: '09 Mar', ventas: 1540000, pedidos: 17 },
  { date: '10 Mar', ventas: 1780000, pedidos: 20 },
  { date: '11 Mar', ventas: 1950000, pedidos: 22 },
  { date: '12 Mar', ventas: 2340000, pedidos: 27 },
  { date: '13 Mar', ventas: 2120000, pedidos: 23 },
  { date: '14 Mar', ventas: 2580000, pedidos: 29 },
  { date: '15 Mar', ventas: 2410000, pedidos: 26 },
  { date: '16 Mar', ventas: 2890000, pedidos: 32 },
];

export const mockCategoryDistribution: CategorySalesPoint[] = [
  { name: 'Audio & Hi-Fi', value: 34, color: '#2563eb' },
  { name: 'Gaming & Periféricos', value: 26, color: '#7c3aed' },
  { name: 'Ergonomía & Escritorio', value: 20, color: '#059669' },
  { name: 'Mochilas Tech', value: 12, color: '#ea580c' },
  { name: 'Smart Home', value: 8, color: '#0284c7' },
];

export const mockTopSellingProducts = [
  { id: 'prod-001', name: 'NovaAudio Pro Wireless ANC Headphone', sales: 64, revenue: 12159360, stock: 24 },
  { id: 'prod-026', name: 'Kinetix Apex 8K Hotswap Hall Effect Keyboard', sales: 52, revenue: 8319480, stock: 19 },
  { id: 'prod-037', name: 'Aerotech Apex Commuter Backpack 26L', sales: 48, revenue: 6239520, stock: 20 },
  { id: 'prod-009', name: 'Lumina ScreenBar Pro Wireless Controller', sales: 45, revenue: 2924550, stock: 35 },
  { id: 'prod-032', name: 'Minimalis Studio Standing Desk Nogal Macizo', sales: 22, revenue: 10999780, stock: 8 },
];

export const mockLowStockAlerts = [
  { id: 'prod-015', name: 'Hyperion Blade 16 Pro Creator Laptop', stock: 7, minStock: 10, sku: 'AURA-HYP-015' },
  { id: 'prod-020', name: 'Hyperion Canvas Studio Display 32" 6K', stock: 5, minStock: 8, sku: 'AURA-HYP-020' },
  { id: 'prod-032', name: 'Minimalis Studio Standing Desk Nogal Macizo', stock: 8, minStock: 12, sku: 'AURA-MIN-032' },
  { id: 'prod-008', name: 'NovaAudio Master Reference Studio Monitors', stock: 8, minStock: 10, sku: 'AUR-NOV-008' },
];
