import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  mockDashboardStats,
  mockDailySales,
  mockCategoryDistribution,
  mockLowStockAlerts,
  mockTopSellingProducts,
} from '@/data/dashboard';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-context';
import { OrderStatus } from '@/types';

export const AdminDashboardPage: React.FC = () => {
  const { orders, updateStatus } = useOrders();
  const toast = useToast();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'year'>('30d');

  const stats = mockDashboardStats;

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateStatus(orderId, newStatus);
    toast.success('Estado actualizado', `Orden #${orderId} cambió a ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Dashboard de Control
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Métricas de facturación, volumen de pedidos y rendimiento del comercio en tiempo real.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 p-1 bg-card rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === '7d'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7 Días
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === '30d'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            30 Días
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === 'year'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Año 2026
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Ingresos Totales
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {formatCurrency(stats.totalRevenue)}
            </span>
            <div className="flex items-center gap-1.5 text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+{stats.salesGrowth}% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pedidos Totales
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {stats.totalOrders}
            </span>
            <div className="flex items-center gap-1.5 text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+{stats.ordersGrowth}% en volumen</span>
            </div>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Ticket Promedio (AOV)
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {formatCurrency(stats.averageTicket)}
            </span>
            <div className="flex items-center gap-1.5 text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+6.2% optimización checkout</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Clientes Registrados
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {stats.totalCustomers}
            </span>
            <div className="flex items-center gap-1.5 text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+{stats.customersGrowth}% retención VIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Flow Area Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Curva de Ingresos Diarios</h3>
              <p className="text-xs text-muted-foreground">Ventas acumuladas en moneda nacional (CLP)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              +18.5% MoM
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDailySales}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #2563eb)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary, #2563eb)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Ventas']}
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--color-primary, #2563eb)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Breakdown */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-foreground">Ventas por Categoría</h3>
            <p className="text-xs text-muted-foreground">Distribución porcentual de facturación</p>
          </div>

          <div className="space-y-4 pt-2">
            {mockCategoryDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/60">
            <div className="rounded-xl bg-muted/40 p-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Categoría líder:</span>
              <span className="font-bold text-foreground">Audio & Hi-Fi (34%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Últimos Pedidos Ingresados</h3>
              <p className="text-xs text-muted-foreground">Actualización en tiempo real con transacciones mock</p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link to="/admin/orders">Ver Todos los Pedidos</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3 font-semibold">Orden</th>
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Fecha</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Estado</th>
                  <th className="pb-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-muted/30">
                    <td className="py-3 font-mono font-bold text-foreground">{ord.orderNumber}</td>
                    <td className="py-3 font-medium text-foreground">{ord.customerName}</td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-3 font-bold text-foreground">{formatCurrency(ord.total)}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          ord.status === 'delivered'
                            ? 'success'
                            : ord.status === 'shipped'
                            ? 'accent'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {ord.status === 'processing' ? (
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(ord.id, 'shipped')}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Marcar Enviado
                        </button>
                      ) : (
                        <Link
                          to="/admin/orders"
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center justify-end gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Ver</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Alert Card */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Alertas de Inventario Bajo</h3>
              <p className="text-[11px] text-muted-foreground">Stock crítico ≤ 8 unidades</p>
            </div>
          </div>

          <div className="space-y-3">
            {mockLowStockAlerts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-rose-500 font-semibold">
                    Quedan solo {p.stock} unidades (mín: {p.minStock})
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success(
                      'Reabastecimiento solicitado',
                      `+20 unidades pedidas para ${p.name}`
                    )
                  }
                  className="text-xs shrink-0"
                >
                  Reponer
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button asChild variant="secondary" size="sm" className="w-full text-xs">
              <Link to="/admin/products">Gestionar Todo el Catálogo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
